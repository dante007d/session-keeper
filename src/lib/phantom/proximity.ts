/**
 * PHANTOM PROXIMITY LAYER v2.0
 * Verifies local network presence using WebRTC ICE candidate analysis.
 */

const PRIVATE_IP_PATTERNS = [
  /^192\.168\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^169\.254\./,   // Link-local
  /^::1$/,         // IPv6 loopback
  /^fc[0-9a-f]{2}:/, // IPv6 ULA
];

function isPrivateIP(ip: string) {
  return PRIVATE_IP_PATTERNS.some(p => p.test(ip));
}

export class ProximityVerifier {
  private localCandidates: string[] = [];

  // 1. Collect LAN IPs via RTCPeerConnection
  async collectLocalCandidates(): Promise<string[]> {
    return new Promise((resolve) => {
      const candidates: string[] = [];
      const pc = new RTCPeerConnection({
        iceServers: [] // No STUN/TURN - we only want local host candidates
      });

      pc.createDataChannel(''); // Need a channel to trigger ICE

      pc.onicecandidate = (e) => {
        if (!e.candidate) {
          pc.close();
          resolve(candidates);
          return;
        }
        
        const parts = e.candidate.candidate.split(' ');
        const ip = parts[4];
        const type = parts[7];
        
        if (type === 'host' && isPrivateIP(ip)) {
          if (!candidates.includes(ip)) {
            candidates.push(ip);
          }
        }
      };

      pc.createOffer().then(offer => pc.setLocalDescription(offer));
      
      // Safety timeout
      setTimeout(() => {
        pc.close();
        resolve(candidates);
      }, 3000);
    });
  }

  // 2. Compare prefixes (Must share at least a /24 subnet)
  verifyProximity(teacherIPs: string[], studentIPs: string[]) {
    const teacherPrefixes = teacherIPs.map(ip => ip.split('.').slice(0, 3).join('.'));
    const studentPrefixes = studentIPs.map(ip => ip.split('.').slice(0, 3).join('.'));

    const overlap = teacherPrefixes.some(tp => studentPrefixes.includes(tp));

    return {
      verified: overlap,
      confidence: overlap ? 'high' : 'fail',
      teacherNetwork: teacherPrefixes[0] || 'unknown',
      studentNetwork: studentPrefixes[0] || 'unknown',
    };
  }
}

export const proximityVerifier = new ProximityVerifier();
