import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateState,
  generateCodeVerifier,
  getGoogleUserInfo,
  type GoogleUserInfo,
} from '$lib/auth/google';

describe('Google OAuth', () => {
  describe('generateState', () => {
    it('should generate a UUID string', () => {
      const state = generateState();
      expect(typeof state).toBe('string');
      expect(state).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should generate unique states', () => {
      // Mock crypto.randomUUID to return different values
      let counter = 0;
      const originalRandomUUID = crypto.randomUUID;
      vi.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        return `test-uuid-${counter++}`;
      });

      const state1 = generateState();
      const state2 = generateState();
      expect(state1).not.toBe(state2);

      // Restore original
      vi.restoreAllMocks();
    });
  });

  describe('generateCodeVerifier', () => {
    it('should generate a code verifier', () => {
      const verifier = generateCodeVerifier();
      expect(typeof verifier).toBe('string');
      expect(verifier.length).toBeGreaterThanOrEqual(43);
      expect(verifier.length).toBeLessThanOrEqual(128);
    });

    it('should only contain valid PKCE characters', () => {
      const verifier = generateCodeVerifier();
      expect(verifier).toMatch(/^[A-Za-z0-9\-._~]+$/);
    });

    it('should generate unique verifiers', () => {
      const verifiers = new Set();
      for (let i = 0; i < 10; i++) {
        verifiers.add(generateCodeVerifier());
      }
      expect(verifiers.size).toBe(10);
    });
  });

  describe('getGoogleUserInfo', () => {
    const mockUserInfo: GoogleUserInfo = {
      sub: '123456789',
      email: 'test@example.com',
      email_verified: true,
      name: 'Test User',
      picture: 'https://example.com/avatar.jpg',
      given_name: 'Test',
      family_name: 'User',
    };

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('should fetch user info successfully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockUserInfo,
      });

      const result = await getGoogleUserInfo('valid-access-token');

      expect(result).toEqual(mockUserInfo);
      expect(fetch).toHaveBeenCalledWith(
        'https://openidconnect.googleapis.com/v1/userinfo',
        {
          headers: {
            Authorization: 'Bearer valid-access-token',
            Accept: 'application/json',
          },
        }
      );
    });

    it('should throw error when fetch fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      });

      await expect(getGoogleUserInfo('invalid-token')).rejects.toThrow(
        'Failed to fetch Google user info: 401'
      );
    });

    it('should throw error when network fails', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(getGoogleUserInfo('token')).rejects.toThrow('Network error');
    });

    it('should handle user info without optional fields', async () => {
      const minimalUserInfo: GoogleUserInfo = {
        sub: '123',
        email: 'minimal@example.com',
        email_verified: false,
        name: 'Minimal User',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => minimalUserInfo,
      });

      const result = await getGoogleUserInfo('token');
      expect(result).toEqual(minimalUserInfo);
    });
  });
});
