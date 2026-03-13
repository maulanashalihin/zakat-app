import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Counter for generating different salts
let saltCounter = 0;

// Helper to convert string to array buffer
function stringToBuffer(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

// Simple mock PBKDF2 implementation
async function mockPBKDF2(password: ArrayBuffer, salt: ArrayBuffer, iterations: number, keyLen: number): Promise<ArrayBuffer> {
  const passBytes = new Uint8Array(password);
  const saltBytes = new Uint8Array(salt);
  
  // Simple key derivation - XOR password with salt repeatedly
  const result = new Uint8Array(keyLen);
  
  for (let i = 0; i < keyLen; i++) {
    result[i] = (passBytes[i % passBytes.length] ^ saltBytes[i % saltBytes.length]) % 256;
  }
  
  return result.buffer;
}

// Properly mock crypto.subtle for PBKDF2
const mockCryptoSubtle = {
  importKey: vi.fn(async (format: string, keyData: ArrayBuffer, algorithm: any, extractable: boolean, keyUsages: string[]) => {
    return { 
      type: 'secret', 
      algorithm, 
      extractable, 
      usages: keyUsages,
      _keyData: new Uint8Array(keyData),
    };
  }),
  deriveBits: vi.fn(async (algorithm: any, baseKey: any, length: number) => {
    const salt = new Uint8Array(algorithm.salt);
    const iterations = algorithm.iterations;
    return mockPBKDF2(baseKey._keyData.buffer, salt.buffer, iterations, length / 8);
  }),
  digest: vi.fn(async (algorithm: string, data: ArrayBuffer) => {
    const result = new Uint8Array(32);
    const input = new Uint8Array(data);
    for (let i = 0; i < result.length; i++) {
      result[i] = input[i % input.length] || i;
    }
    return result.buffer;
  }),
};

// Mock crypto for consistent tests
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => `test-uuid-${++saltCounter}`,
    getRandomValues: (arr: Uint8Array) => {
      // Return different values for salt to ensure different hashes
      const counter = ++saltCounter;
      for (let i = 0; i < arr.length; i++) {
        arr[i] = ((counter * 7 + i * 13) % 256);
      }
      return arr;
    },
    subtle: mockCryptoSubtle,
  },
  writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Clean up after each test
import { cleanup } from '@testing-library/svelte';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
