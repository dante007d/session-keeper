import { useState, useEffect, useCallback } from "react";
import { PHANTOM_CRYPTO } from "./phantom/crypto";
import { proximityVerifier } from "./phantom/proximity";
import { auditChain } from "./phantom/audit";
import { TrustEngine } from "./phantom/trustEngine";
import { sessionsStore } from "./sessionsStore";

export interface PhantomSubmission extends Omit<PendingJoin, 'status'> {
  verdict: 'present' | 'suspect' | 'absent';
  timestamp: number;
  tabSwitches: number;
  proximityVerified: boolean;
  timingAnomalies: number;
  hardwareMatch: boolean;
  heartbeatGaps: number;
}

export interface PendingJoin {
  studentId: string;
  name: string;
  status: 'pending' | 'allowed' | 'denied';
  signals: Record<string, boolean>;
  score: number;
  sharedSecretB64: string;
}

export interface PhantomSession {
  sessionId: string;
  isOpen: boolean;
  openedAt: number;
  teacherPubKeyB64: string;
  teacherPrivateKey?: CryptoKey; // Transient, only in teacher's memory
  sessionSeed: string;
  roomCode: string; // Friendly alias
  submissions: PhantomSubmission[];
  pendingJoins: PendingJoin[];
  activeChallengeId?: string;
}

const KEY = "bec.dev.phantom.v2";

const DEFAULT_SESSION: PhantomSession = {
  sessionId: "",
  isOpen: false,
  openedAt: 0,
  teacherPubKeyB64: "",
  sessionSeed: "",
  roomCode: "",
  submissions: [],
  pendingJoins: [],
};

const read = (): PhantomSession => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SESSION;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SESSION, ...parsed };
  } catch {
    return DEFAULT_SESSION;
  }
};

const write = (session: PhantomSession) => {
  localStorage.setItem(KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent("bec:phantom-updated"));
};

export function usePhantomStore() {
  const [activeSession, setActiveSession] = useState<PhantomSession>(() => read());
  const [trustEngine, setTrustEngine] = useState<TrustEngine | null>(null);

  useEffect(() => {
    if (activeSession.sessionSeed) {
      setTrustEngine(new TrustEngine(activeSession.sessionSeed));
    }
  }, [activeSession.sessionSeed]);

  useEffect(() => {
    const sync = () => setActiveSession(read());
    window.addEventListener("bec:phantom-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("bec:phantom-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const openRoom = useCallback(async (sessionId: string, roomCode: string) => {
    const { keyPair, pubKeyB64 } = await PHANTOM_CRYPTO.generateSessionKeyPair();
    const sessionSeed = await PHANTOM_CRYPTO.hash(`${sessionId}:${Date.now()}`);
    
    const newSession: PhantomSession = {
      sessionId,
      isOpen: true,
      openedAt: Date.now(),
      teacherPubKeyB64: pubKeyB64,
      teacherPrivateKey: keyPair.privateKey,
      sessionSeed,
      roomCode,
      submissions: [],
      pendingJoins: [],
    };
    
    write(newSession);
    await auditChain.addEntry({
      type: 'room_open',
      actor: 'teacher',
      score: 100,
      signals: ['CRYPTO_JOIN']
    });
  }, []);

  const closeRoom = useCallback(async () => {
    const current = read();
    write({ ...current, isOpen: false, pendingJoins: [] });
    await auditChain.addEntry({
      type: 'room_close',
      actor: 'teacher',
      score: 100,
      signals: []
    });
  }, []);

  const requestJoin = useCallback(async (join: Omit<PendingJoin, 'status'>) => {
    const current = read();
    if (!current.isOpen) return;
    
    // Check if already in pending or submissions
    if (current.submissions.some(s => s.studentId === join.studentId)) return;
    if (current.pendingJoins.some(p => p.studentId === join.studentId)) return;

    write({
      ...current,
      pendingJoins: [...current.pendingJoins, { ...join, status: 'pending' }]
    });
  }, []);

  const approveJoin = useCallback(async (studentId: string) => {
    const current = read();
    const join = current.pendingJoins.find(p => p.studentId === studentId);
    if (!join) return;

    write({
      ...current,
      pendingJoins: current.pendingJoins.map(p => 
        p.studentId === studentId ? { ...p, status: 'allowed' } : p
      )
    });
  }, []);

  const rejectJoin = useCallback(async (studentId: string) => {
    const current = read();
    write({
      ...current,
      pendingJoins: current.pendingJoins.map(p => 
        p.studentId === studentId ? { ...p, status: 'denied' } : p
      )
    });
  }, []);

  const submitJoin = useCallback(async (submission: PhantomSubmission) => {
    const current = read();
    if (!current.isOpen) return false;

    // Prevent duplicates
    if (current.submissions.some(s => s.studentId === submission.studentId)) return true;

    // Remove from pending
    const updated = {
      ...current,
      submissions: [...current.submissions, submission],
      pendingJoins: current.pendingJoins.filter(p => p.studentId !== submission.studentId)
    };
    
    write(updated);

    // PERSIST TO GLOBAL SESSIONS STORE
    if (current.sessionId && (submission.verdict === 'present' || submission.verdict === 'suspect')) {
      sessionsStore.updateAttendance(current.sessionId, submission.studentId, true);
    }
    
    await auditChain.addEntry({
      type: 'verdict_set',
      studentId: submission.studentId,
      verdict: submission.verdict,
      score: submission.score,
      signals: Object.keys(submission.signals).filter(k => submission.signals[k]),
      actor: 'system'
    });
    
    return true;
  }, []);

  return {
    activeSession,
    openRoom,
    closeRoom,
    requestJoin,
    approveJoin,
    rejectJoin,
    submitJoin,
    trustEngine,
    submissions: activeSession.submissions,
    pendingJoins: activeSession.pendingJoins
  };
}
