import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./authStore";
import { sessionsStore } from "./sessionsStore";

export interface AttendanceRecord {
  studentId: string;
  name: string;
  status: 'present' | 'late';
  method: 'qr' | 'pin';
  checkedInAt: number;
  locationVerified: boolean;
  deviceFingerprint: string;
}

export interface AttendanceSession {
  sessionId: string;
  qrCode: string;
  pin: string;
  pinExpiresAt: number;
  isOpen: boolean;
  openedAt: number;
  allowLate: boolean;
  lateThreshold: number; // minutes
  classroomLat: number;
  classroomLng: number;
  radiusMeters: number;
  submissions: AttendanceRecord[];
}

const KEY = "bec.dev.attendance.v1";

const DEFAULT_SESSION: AttendanceSession = {
  sessionId: "",
  qrCode: "",
  pin: "",
  pinExpiresAt: 0,
  isOpen: false,
  openedAt: 0,
  allowLate: true,
  lateThreshold: 10,
  classroomLat: 12.9716, // Default to a central location if not set
  classroomLng: 77.5946,
  radiusMeters: 150,
  submissions: [],
};

const read = (): AttendanceSession => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SESSION;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SESSION;
  }
};

const write = (session: AttendanceSession) => {
  localStorage.setItem(KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent("bec:attendance-updated"));
};

export function useAttendanceStore() {
  const [activeSession, setActiveSession] = useState<AttendanceSession>(() => read());

  useEffect(() => {
    const sync = () => setActiveSession(read());
    window.addEventListener("bec:attendance-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("bec:attendance-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const openRoom = useCallback((sessionId: string) => {
    const pin = String(Math.floor(100000 + Math.random() * 900000));
    const qrCode = `${sessionId}-${Date.now()}`;
    const newSession: AttendanceSession = {
      ...DEFAULT_SESSION,
      sessionId,
      isOpen: true,
      openedAt: Date.now(),
      pin,
      pinExpiresAt: Date.now() + 3 * 60 * 1000,
      qrCode,
      submissions: [],
    };
    write(newSession);
  }, []);

  const closeRoom = useCallback(() => {
    write({ ...activeSession, isOpen: false });
  }, [activeSession]);

  const rotatePIN = useCallback(() => {
    const newPIN = String(Math.floor(100000 + Math.random() * 900000));
    write({
      ...activeSession,
      pin: newPIN,
      pinExpiresAt: Date.now() + 3 * 60 * 1000,
    });
  }, [activeSession]);

  const submitAttendance = useCallback((record: AttendanceRecord) => {
    const current = read();
    if (!current.isOpen) return false;
    
    // Prevent duplicates
    if (current.submissions.some(s => s.studentId === record.studentId)) return true;

    const updated = {
      ...current,
      submissions: [...current.submissions, record]
    };
    write(updated);

    // PERSIST TO GLOBAL SESSIONS STORE
    if (current.sessionId) {
      sessionsStore.updateAttendance(current.sessionId, record.studentId, true);
    }
    
    return true;
  }, []);

  // Auto-rotate PIN every 3 minutes
  useEffect(() => {
    if (!activeSession.isOpen) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= activeSession.pinExpiresAt - 5000) { // Rotate 5s before expiry
        rotatePIN();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeSession.isOpen, activeSession.pinExpiresAt, rotatePIN]);

  return {
    activeSession,
    openRoom,
    closeRoom,
    rotatePIN,
    submitAttendance,
    submissions: activeSession.submissions
  };
}

// Helpers
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000; // meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function getDeviceFingerprint() {
  const { userAgent, language, platform } = navigator;
  const { width, height, colorDepth } = screen;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const raw = `${userAgent}|${language}|${platform}|${width}x${height}|${colorDepth}|${tz}`;
  return raw.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0) | 0, 0).toString(36);
}
