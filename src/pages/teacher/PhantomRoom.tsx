import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, Radio, Hash, Download } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { usePhantomStore } from "@/lib/attendanceStoreV2";
import { useSessions } from "@/lib/sessionsStore";
import PhantomTeacherControl from "@/components/teacher/PhantomTeacherControl";

export default function PhantomRoom() {
  const { activeSession, openRoom } = usePhantomStore();
  const { sessions } = useSessions();
  const [selectedSession, setSelectedSession] = useState("");
  const [roomAlias, setRoomAlias] = useState("");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/teacher/dashboard"
            className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mb-8"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>

          {!activeSession.isOpen ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto text-center"
            >
              <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-8 border border-primary/20 shadow-glow shadow-primary/10">
                <Shield size={40} />
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">Open Phantom Room.</h1>
              <p className="text-muted-foreground mb-10">Initialize a secure, proximity-verified attendance session with cryptographic handshakes.</p>

              <div className="space-y-4 text-left">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4 mb-2 block">Link to Session</label>
                  <select 
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-secondary/40 border border-border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select an upcoming session...</option>
                    {sessions.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4 mb-2 block">Room Alias (e.g. ALPHA-9)</label>
                  <input 
                    type="text"
                    value={roomAlias}
                    onChange={(e) => setRoomAlias(e.target.value.toUpperCase())}
                    placeholder="ENTER ROOM CODE..."
                    className="w-full p-4 rounded-2xl bg-secondary/40 border border-border text-sm font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <button
                  onClick={() => selectedSession && roomAlias && openRoom(selectedSession, roomAlias)}
                  disabled={!selectedSession || !roomAlias}
                  className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-black text-lg tracking-wide shadow-glow shadow-primary/20 disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all mt-6"
                >
                  Initialize Phantom Mesh
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-12">
              <header>
                <h1 className="text-5xl font-black tracking-tighter mb-2">Phantom Center.</h1>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Enterprise Attendance Mesh Active</p>
              </header>
              
              <PhantomTeacherControl />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
