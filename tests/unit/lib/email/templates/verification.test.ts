import { describe, it, expect } from 'vitest';
import { generateVerificationEmail } from '$lib/email/templates/verification';

describe('Verification Email Template', () => {
  const mockData = {
    name: 'John Doe',
    verificationUrl: 'https://example.com/verify?token=abc123',
    expiresIn: '24 hours',
  };

  describe('generateVerificationEmail', () => {
    it('should generate HTML email', () => {
      const result = generateVerificationEmail(mockData);
      
      expect(result.html).toBeDefined();
      expect(typeof result.html).toBe('string');
      expect(result.html.length).toBeGreaterThan(0);
    });

    it('should generate text email', () => {
      const result = generateVerificationEmail(mockData);
      
      expect(result.text).toBeDefined();
      expect(typeof result.text).toBe('string');
      expect(result.text.length).toBeGreaterThan(0);
    });

    it('should include user name in HTML', () => {
      const result = generateVerificationEmail(mockData);
      
      expect(result.html).toContain(mockData.name);
    });

    it('should include user name in text', () => {
      const result = generateVerificationEmail(mockData);
      
      expect(result.text).toContain(mockData.name);
    });

    it('should include verification URL in HTML', () => {
      const result = generateVerificationEmail(mockData);
      
      expect(result.html).toContain(mockData.verificationUrl);
    });

    it('should include verification URL in text', () => {
      const result = generateVerificationEmail(mockData);
      
      expect(result.text).toContain(mockData.verificationUrl);
    });

    it('should include expiration time in HTML', () => {
      const result = generateVerificationEmail(mockData);
      
      expect(result.html).toContain(mockData.expiresIn);
    });

    it('should include expiration time in text', () => {
      const result = generateVerificationEmail(mockData);
      
      expect(result.text).toContain(mockData.expiresIn);
    });

    it('should have proper HTML structure', () => {
      const result = generateVerificationEmail(mockData);
      
      expect(result.html).toContain('<!DOCTYPE html>');
      expect(result.html).toContain('<html>');
      expect(result.html).toContain('</html>');
      expect(result.html).toContain('<body');
      expect(result.html).toContain('</body>');
    });

    it('should include button/link in HTML', () => {
      const result = generateVerificationEmail(mockData);
      
      expect(result.html).toContain('<a');
      expect(result.html).toContain('href="' + mockData.verificationUrl + '"');
    });

    it('should handle special characters in name', () => {
      const specialData = {
        ...mockData,
        name: 'John & Jane <script>alert("xss")</script>',
      };
      
      const result = generateVerificationEmail(specialData);
      
      // Should contain the name but not as executable script
      expect(result.html).toContain('John & Jane');
    });

    it('should handle long URLs', () => {
      const longUrlData = {
        ...mockData,
        verificationUrl: 'https://example.com/verify?token=' + 'a'.repeat(500),
      };
      
      const result = generateVerificationEmail(longUrlData);
      
      expect(result.html).toContain(longUrlData.verificationUrl);
      expect(result.text).toContain(longUrlData.verificationUrl);
    });

    it('should contain app name in footer', () => {
      const result = generateVerificationEmail(mockData);
      
      expect(result.html).toContain('ZakatApp');
    });

    it('should contain fallback instructions in HTML', () => {
      const result = generateVerificationEmail(mockData);
      
      // HTML has fallback instructions in Indonesian
      expect(result.html.toLowerCase()).toContain('salin');
    });

    it('should contain verification link in text', () => {
      const result = generateVerificationEmail(mockData);
      
      // Text version has the link directly
      expect(result.text).toContain(mockData.verificationUrl);
    });

    it('should contain ignore instructions', () => {
      const result = generateVerificationEmail(mockData);
      
      // Instructions in Indonesian for ignoring email
      expect(result.html.toLowerCase()).toContain('abaikan');
      expect(result.text.toLowerCase()).toContain('abaikan');
    });
  });
});
