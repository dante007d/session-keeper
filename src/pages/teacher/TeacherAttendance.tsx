import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAttendanceStore } from "@/lib/attendanceStore";
import { QRCodeSVG } from "qrcode.react";
import { useSessions } from "@/lib/sessionsStore";
import { Timer, Users, QrCode, Lock, XCircle, PlayCircle, MapPin, RefreshCw, Shield, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function TeacherAttendance() {
  const { activeSession, startAttendance, stopAttendance, rotatePIN, submissions } = useAttendanceStore();
  const { sessions } = useSessions();
  const [selectedSession, setSelectedSession] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!activeSession.isOpen) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, activeSession.pinExpiresAt - Date.now());
      const seconds = Math.floor(remaining / 1000);
      setTimeLeft(`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession.isOpen, activeSession.pinExpiresAt]);

  const buildAttendanceURL = (token: string) => {
    return `${window.location.origin}/student/checkin?token=${token}`;
  };

  return (
    <div className="min-h-screen bg-[#F9F6F1] pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-[#151512] tracking-tight mb-2">Attendance Control.</h1>
          <p className="text-sm font-medium text-[#151512]/60 uppercase tracking-widest">Advanced Anti-Proxy System</p>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-4 p-4 rounded-2xl bg-[#151512] text-white flex items-center justify-between group cursor-pointer"
            onClick={() => window.location.href = "/teacher/phantom"}
          >
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-[#E8A020]" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8A020]">Recommended Upgrade</p>
                <p className="text-sm font-bold">Switch to Phantom Mesh v2.0</p>
              </div>
            </div>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.div>
        </header>

        {!activeSession.isOpen ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border border-[#151512]/10 shadow-sm"
          >
            <div className="flex flex-col items-center text-center max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-[#E8A020]/10 flex items-center justify-center text-[#E8A020] mb-6">
                <PlayCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-[#151512] mb-4">Ready to start?</h2>
              <p className="text-[#151512]/60 mb-8">Select an upcoming session to open the attendance window for students.</p>
              
              <select 
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full p-4 rounded-2xl bg-[#F9F6F1] border border-[#151512]/10 text-sm font-bold mb-6 focus:outline-none focus:ring-2 focus:ring-[#E8A020]/20"
              >
                <option value="">Select a session...</option>
                {sessions.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>

              <button
                onClick={() => selectedSession && startAttendance(selectedSession)}
                disabled={!selectedSession}
                className="w-full py-5 rounded-2xl bg-[#151512] text-white font-black text-lg tracking-wide shadow-xl disabled:opacity-50 hover:bg-[#151512]/90 transition-all active:scale-95"
              >
                Open Attendance Window
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              {/* QR Code Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-8 border border-[#151512]/10 shadow-sm text-center"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#151512]/40 mb-6 flex items-center justify-center gap-2">
                  <QrCode size={14} /> Scan to Mark Present
                </p>
                <div className="bg-white p-6 rounded-3xl border border-[#151512]/5 inline-block mb-6 shadow-inner">
                  <QRCodeSVG
                    value={buildAttendanceURL(activeSession.qrCode)}
                    size={240}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <p className="text-xs font-mono text-[#151512]/60 mb-4">
                  Token: {activeSession.qrCode.split('-')[1]}
                </p>
                <button 
                  onClick={rotatePIN}
                  className="flex items-center gap-2 mx-auto px-6 py-3 rounded-2xl border border-[#151512]/10 text-[11px] font-bold uppercase tracking-widest text-[#151512]/60 hover:border-[#E8A020] hover:text-[#E8A020] transition-all"
                >
                  <RefreshCw size={14} /> Regenerate QR
                </button>
              </motion.div>

              {/* PIN Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-8 border border-[#151512]/10 shadow-sm"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#151512]/40 mb-6 text-center flex items-center justify-center gap-2">
                  <Lock size={14} /> Backup PIN — Projector Display
                </p>
                <div className="flex justify-center gap-4 mb-8">
                  {activeSession.pin.split('').map((digit, i) => (
                    <motion.div 
                      key={`${activeSession.pin}-${i}`}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="w-14 h-20 rounded-2xl bg-[#F9F6F1] border border-[#151512]/10 flex items-center justify-center font-mono font-black text-4xl text-[#151512]"
                    >
                      {digit}
                    </motion.div>
                  ))}
                </div>
                
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold inline-block py-1 px-2 uppercase rounded-full text-[#E8A020] bg-[#E8A020]/10">
                        PIN Rotation
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold inline-block text-[#E8A020]">
                        {timeLeft}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded-full bg-[#E8A020]/10">
                    <motion.div 
                      animate={{ width: `${(Math.max(0, activeSession.pinExpiresAt - Date.now()) / (3 * 60 * 1000)) * 100}%` }}
                      transition={{ duration: 1, ease: "linear" }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#E8A020]"
                    />
                  </div>
                </div>
              </motion.div>
              
              <button 
                onClick={stopAttendance}
                className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold text-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <XCircle size={18} /> Stop Attendance Window
              </button>
            </div>

            <div className="space-y-6">
              {/* Live Submissions */}
              <div className="bg-white rounded-3xl border border-[#151512]/10 shadow-sm overflow-hidden flex flex-col h-[600px]">
                <div className="p-6 border-b border-[#151512]/10 flex items-center justify-between bg-white sticky top-0 z-10">
                  <div>
                    <h3 className="text-lg font-black text-[#151512]">Live Feed.</h3>
                    <p className="text-[10px] font-bold text-[#151512]/40 uppercase tracking-widest">Real-time submissions</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#E8A020]/10 border border-[#E8A020]/20">
                    <Users size={16} className="text-[#E8A020]" />
                    <span className="font-mono font-bold text-sm text-[#E8A020]">{submissions.length}</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  <AnimatePresence initial={false}>
                    {submissions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                        <Users size={40} className="mb-4" />
                        <p className="text-sm font-bold">Waiting for students to join...</p>
                      </div>
                    ) : (
                      submissions.map((s, i) => (
                        <motion.div
                          key={s.studentId}
                          initial={{ opacity: 0, x: -20, backgroundColor: "rgba(232, 160, 32, 0.1)" }}
                          animate={{ opacity: 1, x: 0, backgroundColor: "rgba(255, 255, 255, 1)" }}
                          transition={{ duration: 0.5 }}
                          className="flex items-center gap-4 p-4 rounded-2xl border border-[#151512]/5 group hover:border-[#E8A020]/30 transition-all"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[#F9F6F1] flex items-center justify-center text-[#151512]/40 group-hover:bg-[#E8A020]/10 group-hover:text-[#E8A020] transition-all">
                            <Users size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-[#151512] truncate">{s.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-[#151512]/40 flex items-center gap-1">
                                {s.method === 'qr' ? <QrCode size={10} /> : <Lock size={10} />} {s.method}
                              </span>
                              {s.locationVerified && (
                                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-1">
                                  <MapPin size={10} /> Verified
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-mono font-bold text-[#151512]/40">
                              {format(s.checkedInAt, "HH:mm:ss")}
                            </p>
                          </div>
                        </motion.div>
                      )).reverse()
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
