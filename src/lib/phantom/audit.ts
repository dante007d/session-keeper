/**
 * PHANTOM AUDIT CHAIN v2.0
 * A tamper-evident ledger where every verdict is hash-chained.
 */

import { PHANTOM_CRYPTO } from "./crypto";

export interface AuditEntry {
  type: 'verdict_set' | 'override' | 'room_open' | 'room_close';
  studentId?: string;
  verdict?: string;
  score?: number;
  signals?: string[];
  actor: 'system' | 'teacher' | 'student';
  timestamp: number;
  prevHash: string;
  thisHash?: string;
}

const DB_NAME = 'bec_phantom_db';
const AUDIT_STORE = 'audit';

export class AuditChain {
  private entries: AuditEntry[] = [];
  private lastHash: string = '0'.repeat(64);

  constructor() {
    this.init();
  }

  private async init() {
    const db = await this.openDB();
    const tx = db.transaction(AUDIT_STORE, 'readonly');
    const store = tx.objectStore(AUDIT_STORE);
    const request = store.getAll();
    
    request.onsuccess = () => {
      this.entries = request.result;
      if (this.entries.length > 0) {
        this.lastHash = this.entries[this.entries.length - 1].thisHash!;
      }
    };
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(AUDIT_STORE)) {
          db.createObjectStore(AUDIT_STORE, { autoIncrement: true });
        }
      };
      request.onsuccess = (e: any) => resolve(e.target.result);
      request.onerror = (e: any) => reject(e.target.error);
    });
  }

  async addEntry(params: Omit<AuditEntry, 'prevHash' | 'thisHash' | 'timestamp'>) {
    const entry: AuditEntry = {
      ...params,
      timestamp: Date.now(),
      prevHash: this.lastHash,
    };

    const { ...hashData } = entry;
    const hash = await PHANTOM_CRYPTO.hash(hashData);
    entry.thisHash = hash;
    this.lastHash = hash;
    
    this.entries.push(entry);
    await this.persist(entry);
    return entry;
  }

  private async persist(entry: AuditEntry) {
    const db = await this.openDB();
    const tx = db.transaction(AUDIT_STORE, 'readwrite');
    tx.objectStore(AUDIT_STORE).add(entry);
  }

  async verifyChain(): Promise<{ valid: boolean; brokenAt?: number }> {
    let currentPrevHash = '0'.repeat(64);
    
    for (const entry of this.entries) {
      const { thisHash, ...rest } = entry;
      const computed = await PHANTOM_CRYPTO.hash(rest);
      
      if (computed !== thisHash) return { valid: false, brokenAt: entry.timestamp };
      if (entry.prevHash !== currentPrevHash) return { valid: false, brokenAt: entry.timestamp };
      
      currentPrevHash = thisHash!;
    }
    
    return { valid: true };
  }

  exportJSON() {
    return JSON.stringify({
      exportedAt: Date.now(),
      chainLength: this.entries.length,
      finalHash: this.lastHash,
      entries: this.entries,
    }, null, 2);
  }

  getEntries() {
    return [...this.entries];
  }
}

export const auditChain = new AuditChain();
