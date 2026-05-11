import { useState, useEffect, useCallback } from "react";

export interface Assignment {
  id: string;
  studentId: string;
  sessionId: string;
  type: 'github' | 'demo' | 'figma' | 'doc' | 'image';
  url: string;
  notes: string;
  submittedAt: number;
}

export interface QAEntry {
  id: string;
  sessionId: string;
  question: string;
  answer?: string;
  isAnonymous: boolean;
  author: string;
  timestamp: number;
  isPinned: boolean;
}

export interface Shoutout {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: number;
}

export interface StudyLog {
  id: string;
  studentId: string;
  duration: number; // minutes
  topic: string;
  timestamp: number;
}

const KEYS = {
  ASSIGNMENTS: "bec.dev.assignments.v1",
  QA: "bec.dev.qa.v1",
  SHOUTOUTS: "bec.dev.shoutouts.v1",
  STUDY_LOGS: "bec.dev.study_logs.v1",
  FEEDBACK: "bec.dev.feedback.v1"
};

const read = <T>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("bec:tools-updated"));
};

export function useToolsStore() {
  const [state, setState] = useState({
    assignments: read<Assignment>(KEYS.ASSIGNMENTS),
    qa: read<QAEntry>(KEYS.QA),
    shoutouts: read<Shoutout>(KEYS.SHOUTOUTS),
    studyLogs: read<StudyLog>(KEYS.STUDY_LOGS)
  });

  useEffect(() => {
    const sync = () => setState({
      assignments: read<Assignment>(KEYS.ASSIGNMENTS),
      qa: read<QAEntry>(KEYS.QA),
      shoutouts: read<Shoutout>(KEYS.SHOUTOUTS),
      studyLogs: read<StudyLog>(KEYS.STUDY_LOGS)
    });
    window.addEventListener("bec:tools-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("bec:tools-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addAssignment = useCallback((a: Omit<Assignment, 'id' | 'submittedAt'>) => {
    const entry: Assignment = { ...a, id: Math.random().toString(36).substr(2, 9), submittedAt: Date.now() };
    write(KEYS.ASSIGNMENTS, [entry, ...read<Assignment>(KEYS.ASSIGNMENTS)]);
  }, []);

  const addQA = useCallback((q: Omit<QAEntry, 'id' | 'timestamp' | 'isPinned'>) => {
    const entry: QAEntry = { ...q, id: Math.random().toString(36).substr(2, 9), timestamp: Date.now(), isPinned: false };
    write(KEYS.QA, [entry, ...read<QAEntry>(KEYS.QA)]);
  }, []);

  const addShoutout = useCallback((s: Omit<Shoutout, 'id' | 'timestamp'>) => {
    const entry: Shoutout = { ...s, id: Math.random().toString(36).substr(2, 9), timestamp: Date.now() };
    write(KEYS.SHOUTOUTS, [entry, ...read<Shoutout>(KEYS.SHOUTOUTS)]);
  }, []);

  const addStudyLog = useCallback((l: Omit<StudyLog, 'id' | 'timestamp'>) => {
    const entry: StudyLog = { ...l, id: Math.random().toString(36).substr(2, 9), timestamp: Date.now() };
    write(KEYS.STUDY_LOGS, [entry, ...read<StudyLog>(KEYS.STUDY_LOGS)]);
  }, []);

  return {
    ...state,
    addAssignment,
    addQA,
    addShoutout,
    addStudyLog
  };
}
