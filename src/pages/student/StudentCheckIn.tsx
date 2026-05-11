import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/authStore";
import { useAttendanceStore, haversineDistance, getDeviceFingerprint } from "@/lib/attendanceStore";
import { Lock, CheckCircle2, XCircle, MapPin, Search, Smartphone, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { usePhantomStore } from "@/lib/attendanceStoreV2";
import PhantomStudentCheckIn from "@/components/student/PhantomStudentCheckIn";

type Step = 'detecting' | 'pin' | 'verifying' | 'success' | 'error';

export default function StudentCheckIn() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activeSession, submitAttendance } = useAttendanceStore();
  const { activeSession: phantomSession } = usePhantomStore();
  
  if (phantomSession.isOpen) {
    return <PhantomStudentCheckIn />;
  }
  
  const [step, setStep] = useState<Step>('detecting');
  const [pin, setPin] = useState("");
  const [locationStatus, setLocationStatus] = useState<'pending' | 'verified' | 'outside' | 'denied'>('pending');
  const [error, setError] = useState("");

  const hasSubmitted = useRef(false);

  useEffect(() => {
    // Initial setup
    const token = searchParams.get('token');
    
    // Silent geolocation check
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!activeSession.classroomLat) {
            setLocationStatus('pending');
            return;
          }
          const dist = haversineDistance(
            pos.coords.latitude, pos.coords.longitude,
            activeSession.classroomLat, activeSession.classroomLng
          );
          setLocationStatus(dist <= activeSession.radiusMeters ? 'verified' : 'outside');
        },
        () => setLocationStatus('denied'),
        { enableHighAccuracy: true }
      );
    } else {
      setLocationStatus('denied');
    }

    // Determine starting step
    if (token) {
      handleQRToken(token);
    } else {
      setStep('pin');
    }
  }, [searchParams, activeSession.classroomLat, activeSession.classroomLng, activeSession.radiusMeters]);

  const handleQRToken = async (token: string) => {
    if (hasSubmitted.current) return;
    setStep('detecting');
    
    // Simulate verification delay
    await new Promise(r => setTimeout(r, 1500));

    if (token === activeSession.qrCode && activeSession.isOpen) {
      await performCheckIn('qr');
    } else {
      setError("QR Token is invalid or has expired.");
      setStep('error');
    }
  };

  const handlePINSubmit = async () => {
    if (pin.length !== 6 || hasSubmitted.current) return;
    setStep('verifying');
    
    await new Promise(r => setTimeout(r, 1000));

    if (pin === activeSession.pin && activeSession.isOpen && Date.now() < activeSession.pinExpiresAt) {
      await performCheckIn('pin');
    } else {
      setError("Invalid PIN or it has expired. Please check the screen.");
      setStep('error');
    }
  };

  const performCheckIn = async (method: 'qr' | 'pin') => {
    if (!user || hasSubmitted.current) return;
    hasSubmitted.current = true;

    const now = Date.now();
    const isLate = (now - activeSession.openedAt) > activeSession.lateThreshold * 60000;

    const record = {
      studentId: user.name, // Using name as ID for simplicity in this mockup
      name: user.name,
      method,
      checkedInAt: now,
      status: isLate ? 'late' as const : 'present' as const,
      locationVerified: locationStatus === 'verified',
      deviceFingerprint: getDeviceFingerprint(),
    };

    submitAttendance(record);
    setStep('success');
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          {step === 'detecting' && (
            <motion.div 
              key="detecting"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 bg-primary/20 rounded-[2rem] animate-ping" />
                <div className="relative w-full h-full rounded-[2rem] bg-white border border-border/50 shadow-xl flex items-center justify-center text-primary">
                  <Search size={40} className="animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-foreground mb-2">Verifying Check-in</h2>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Securing your spot...</p>
            </motion.div>
          )}

          {step === 'pin' && (
            <motion.div 
              key="pin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface-card rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20" />
              <header className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <Lock size={32} />
                </div>
                <h2 className="text-2xl font-black text-foreground mb-1">Enter PIN.</h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Displaying on projector</p>
              </header>

              <div className="flex gap-2 justify-center mb-8">
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} className={`w-10 h-14 rounded-xl border-2 flex items-center justify-center font-mono font-black text-2xl transition-all
                                         ${pin[i] ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-secondary/30 text-muted-foreground'}`}>
                    {pin[i] || ""}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (k === "⌫") setPin(p => p.slice(0, -1));
                      else if (k && pin.length < 6) setPin(p => p + k);
                    }}
                    disabled={!k}
                    className={`h-14 rounded-2xl font-mono font-black text-xl transition-all active:scale-95
                               ${k ? 'bg-secondary/40 border border-border/50 text-foreground hover:bg-primary/10 hover:border-primary/30' : 'opacity-0 pointer-events-none'}`}
                  >
                    {k}
                  </button>
                ))}
              </div>

              <button
                onClick={handlePINSubmit}
                disabled={pin.length < 6}
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black text-sm tracking-widest uppercase shadow-lg disabled:opacity-40 hover:bg-primary/90 transition-all active:scale-95"
              >
                Confirm Arrival →
              </button>

              <div className="mt-6 pt-6 border-t border-border/50 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${locationStatus === 'verified' ? 'bg-emerald-500' : locationStatus === 'outside' ? 'bg-red-500' : 'bg-muted-foreground/30'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {locationStatus === 'verified' ? 'Location Confirmed' : locationStatus === 'outside' ? 'Outside Range' : 'Checking Location...'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone size={12} className="text-muted-foreground" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Device Linked</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'verifying' && (
            <motion.div key="verifying" className="text-center">
              <RefreshCw size={48} className="text-primary animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-black text-foreground mb-2">Syncing...</h2>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="surface-card rounded-[2.5rem] p-10 shadow-2xl text-center border-emerald-500/20"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-black text-foreground mb-2">You're In!</h2>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-8">Presence Logged Successfully</p>
              
              <div className="bg-secondary/40 rounded-2xl p-4 mb-8 text-left space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</span>
                  <span className="text-xs font-bold text-emerald-500">PRESENT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Time</span>
                  <span className="text-xs font-bold text-foreground">{format(Date.now(), "HH:mm")}</span>
                </div>
                {locationStatus === 'verified' && (
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Security</span>
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><MapPin size={10} /> LOC_VERIFIED</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate("/student/home")}
                className="w-full py-4 rounded-2xl bg-foreground text-background font-black text-sm tracking-widest uppercase hover:bg-foreground/90 transition-all active:scale-95"
              >
                Back to Home
              </button>
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="surface-card rounded-[2.5rem] p-10 shadow-2xl text-center border-red-500/20"
            >
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6">
                <AlertCircle size={48} />
              </div>
              <h2 className="text-2xl font-black text-foreground mb-2">Verification Failed</h2>
              <p className="text-sm font-medium text-muted-foreground mb-8">{error}</p>
              
              <button
                onClick={() => { setPin(""); setStep('pin'); hasSubmitted.current = false; }}
                className="w-full py-4 rounded-2xl bg-red-500 text-white font-black text-sm tracking-widest uppercase hover:bg-red-600 transition-all active:scale-95"
              >
                Try PIN Fallback
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { RefreshCw } from "lucide-react";
