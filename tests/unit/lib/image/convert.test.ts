import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validateImageFile,
  getExtensionFromMimeType,
  generateAvatarFilename,
} from '$lib/image/convert';

describe('Image Conversion', () => {
  describe('validateImageFile', () => {
    it('should validate valid image file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 }); // 1KB

      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate PNG image', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      Object.defineProperty(file, 'size', { value: 1024 });

      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });

    it('should validate GIF image', () => {
      const file = new File(['test'], 'test.gif', { type: 'image/gif' });
      Object.defineProperty(file, 'size', { value: 1024 });

      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });

    it('should validate WebP image', () => {
      const file = new File(['test'], 'test.webp', { type: 'image/webp' });
      Object.defineProperty(file, 'size', { value: 1024 });

      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid file type', () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 1024 });

      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid file type');
    });

    it('should reject file too large', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 }); // 6MB

      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too large');
    });

    it('should accept file at exactly 5MB', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 }); // 5MB

      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });
  });

  describe('getExtensionFromMimeType', () => {
    it('should return correct extension for JPEG', () => {
      expect(getExtensionFromMimeType('image/jpeg')).toBe('jpg');
    });

    it('should return correct extension for PNG', () => {
      expect(getExtensionFromMimeType('image/png')).toBe('png');
    });

    it('should return correct extension for GIF', () => {
      expect(getExtensionFromMimeType('image/gif')).toBe('gif');
    });

    it('should return correct extension for WebP', () => {
      expect(getExtensionFromMimeType('image/webp')).toBe('webp');
    });

    it('should return bin for unknown mime type', () => {
      expect(getExtensionFromMimeType('application/octet-stream')).toBe('bin');
    });

    it('should return bin for empty string', () => {
      expect(getExtensionFromMimeType('')).toBe('bin');
    });
  });

  describe('generateAvatarFilename', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should generate filename with correct format', () => {
      const userId = 'user-123';
      const filename = generateAvatarFilename(userId);

      expect(filename).toMatch(/^avatars\/user-123\/\d+\.webp$/);
    });

    it('should include timestamp in filename', () => {
      const userId = 'user-123';
      const filename = generateAvatarFilename(userId);
      const timestamp = new Date('2024-01-01T00:00:00Z').getTime();

      expect(filename).toContain(timestamp.toString());
    });

    it('should have webp extension', () => {
      const userId = 'user-123';
      const filename = generateAvatarFilename(userId);

      expect(filename.endsWith('.webp')).toBe(true);
    });

    it('should include userId in path', () => {
      const userId = 'user-abc-123';
      const filename = generateAvatarFilename(userId);

      expect(filename).toContain(`avatars/${userId}/`);
    });
  });
});
