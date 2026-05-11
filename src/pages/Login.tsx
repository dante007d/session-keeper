import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/authStore";

export default function Login() {
  const [studentName, setStudentName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [teacherError, setTeacherError] = useState(false);
  const [activePanel, setActivePanel] = useState<"student" | "teacher" | null>(null);
  const { loginAsTeacher, loginAsStudent } = useAuth();
  const navigate = useNavigate();

  const handleStudentLogin = () => {
    if (studentName.trim().length < 2) return;
    loginAsStudent(studentName.trim());
    navigate("/student/home");
  };

  const handleTeacherLogin = () => {
    const success = loginAsTeacher(passcode);
    if (success) {
      navigate("/teacher/dashboard");
    } else {
      setTeacherError(true);
      setTimeout(() => setTeacherError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-background">
      {/* === STUDENT PANEL === */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center px-10 py-16
                   bg-background relative overflow-hidden cursor-pointer"
        animate={{ flex: activePanel === "teacher" ? 0.3 : 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setActivePanel("student")}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px]
                         rounded-full bg-primary opacity-[0.06] blur-[80px]" />
        </div>

        <motion.div
          className="relative z-10 w-full max-w-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center
                         justify-center text-3xl mb-6 shadow-inner">
            🎓
          </div>

          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em]
                       text-primary mb-2">
            Student Access
          </p>

          <h2 className="font-accent italic text-4xl text-foreground mb-2">
            Learn. Grow.
          </h2>
          <h2 className="font-bold text-4xl text-foreground mb-6 tracking-tight">
            Belong.
          </h2>

          <div className="mb-4" onClick={(e) => e.stopPropagation()}>
            <label className="text-[10px] font-bold uppercase tracking-widest
                             text-muted-foreground mb-1.5 block">
              Your Name
            </label>
            <input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStudentLogin()}
              placeholder="e.g. Dante Reyes"
              className="w-full px-5 py-4 rounded-2xl bg-secondary/30 border border-border
                        text-sm text-foreground placeholder:text-muted-foreground
                        focus:outline-none focus:border-primary
                        focus:ring-4 focus:ring-primary/5
                        transition-all duration-200"
            />
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => { e.stopPropagation(); handleStudentLogin(); }}
            disabled={studentName.trim().length < 2}
            className="w-full py-4 rounded-2xl bg-primary text-white
                      font-bold text-sm tracking-tight
                      shadow-glow disabled:opacity-40
                      disabled:cursor-not-allowed transition-all duration-200"
          >
            Enter Student Portal →
          </motion.button>
        </motion.div>
      </motion.div>

      {/* === DIVIDER === */}
      <div className="hidden md:flex flex-col items-center justify-center
                     w-px bg-border/40 relative">
        <span className="absolute text-[9px] font-bold uppercase tracking-[0.3em]
                        text-muted-foreground/40 rotate-90 whitespace-nowrap">
          BEC DEV CLUB
        </span>
      </div>

      {/* === TEACHER PANEL === */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center px-10 py-16
                   bg-secondary/20 relative overflow-hidden cursor-pointer"
        animate={{ flex: activePanel === "student" ? 0.3 : 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setActivePanel("teacher")}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px]
                         rounded-full bg-primary opacity-[0.06] blur-[80px]" />
        </div>

        <motion.div
          className="relative z-10 w-full max-w-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center
                         justify-center text-3xl mb-6 shadow-inner">
            📋
          </div>

          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em]
                       text-primary mb-2">
            Teacher Access
          </p>

          <h2 className="font-accent italic text-4xl text-foreground mb-2">
            Lead. Record.
          </h2>
          <h2 className="font-bold text-4xl text-foreground mb-6 tracking-tight">
            Archive.
          </h2>

          <div className="mb-4" onClick={(e) => e.stopPropagation()}>
            <label className="text-[10px] font-bold uppercase tracking-widest
                             text-muted-foreground mb-1.5 block">
              Passcode
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTeacherLogin()}
              placeholder="••••"
              className={`w-full px-5 py-4 rounded-2xl bg-white text-sm
                         placeholder:text-muted-foreground
                         focus:outline-none focus:ring-4 transition-all duration-200
                         ${teacherError
                           ? "border-2 border-destructive focus:ring-destructive/5 animate-shake"
                           : "border border-border focus:border-primary focus:ring-primary/5"
                         }`}
            />
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => { e.stopPropagation(); handleTeacherLogin(); }}
            className="w-full py-4 rounded-2xl bg-foreground text-background
                      font-bold text-sm tracking-tight
                      shadow-elevated hover:bg-foreground/90 transition-all duration-200"
          >
            Open Teacher Dashboard →
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
