/**
 * PHANTOM CRYPTO LAYER v2.0
 * Uses Web Crypto API for zero-knowledge-style proofs and ephemeral session keys.
 */

export const PHANTOM_CRYPTO = {
  // 1. Generate Session Keypair (Teacher side)
  async generateSessionKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      ['deriveKey', 'deriveBits']
    );
    
    const pubKeyRaw = await window.crypto.subtle.exportKey('raw', keyPair.publicKey);
    const pubKeyB64 = btoa(String.fromCharCode(...new Uint8Array(pubKeyRaw)));
    
    return { keyPair, pubKeyB64 };
  },

  // 2. Derive Shared Secret (Student side)
  async deriveSharedSecret(studentPrivKey: CryptoKey, teacherPubKeyB64: string) {
    const pubKeyBytes = Uint8Array.from(atob(teacherPubKeyB64), c => c.charCodeAt(0));
    const teacherPubKey = await window.crypto.subtle.importKey(
      'raw',
      pubKeyBytes,
      { name: 'ECDH', namedCurve: 'P-256' },
      false,
      []
    );
    
    const sharedBits = await window.crypto.subtle.deriveBits(
      { name: 'ECDH', public: teacherPubKey },
      studentPrivKey,
      256
    );
    
    return new Uint8Array(sharedBits);
  },

  // 3. Generate Join Proof (Student side)
  async generateJoinProof(sharedSecret: Uint8Array, studentId: string, timestamp: number) {
    const key = await window.crypto.subtle.importKey(
      'raw',
      sharedSecret,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const data = new TextEncoder().encode(`${studentId}:${timestamp}`);
    const sig = await window.crypto.subtle.sign('HMAC', key, data);
    return btoa(String.fromCharCode(...new Uint8Array(sig)));
  },

  // 4. Verify Join Proof (Teacher side)
  async verifyJoinProof(sharedSecret: Uint8Array, studentId: string, timestamp: number, proof: string, maxAgeMs = 60000) {
    if (Date.now() - timestamp > maxAgeMs) return false; // Replay protection
    
    const expected = await this.generateJoinProof(sharedSecret, studentId, timestamp);
    return expected === proof;
  },

  // 5. Hash for Audit Chain
  async hash(data: any): Promise<string> {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
};
