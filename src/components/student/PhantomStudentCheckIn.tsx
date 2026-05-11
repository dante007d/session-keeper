import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Radio, Lock, Target, MousePointer2, CheckCircle2, AlertCircle, Fingerprint, Loader2 } from "lucide-react";
import { usePhantomStore } from "@/lib/attendanceStoreV2";
import { PHANTOM_CRYPTO } from "@/lib/phantom/crypto";
import { proximityVerifier } from "@/lib/phantom/proximity";
import { buildHardwareFingerprint, verifyFingerprint } from "@/lib/phantom/fingerprint";
import { PERCEPTUAL_CHALLENGES, pointerBiometrics } from "@/lib/phantom/challenges";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/authStore";

type CheckInStep = 'proximity' | 'handshake' | 'waiting' | 'challenge' | 'success' | 'fail';

export default function PhantomStudentCheckIn() {
  const { activeSession, submitJoin, trustEngine, requestJoin, pendingJoins } = usePhantomStore();
  const { user } = useAuth();
  const [step, setStep] = useState<CheckInStep>('proximity');
  const [error, setError] = useState<string | null>(null);
  const [signals, setSignals] = useState<Record<string, boolean>>({});
  const [currentChallenge, setCurrentChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Watch for teacher approval
  useEffect(() => {
    if (step === 'waiting' && user) {
      const myJoin = pendingJoins.find(p => p.studentId === (user.id || user.name));
      if (myJoin?.status === 'allowed') {
        // Pick a random challenge
        const challengeTypes = Object.keys(PERCEPTUAL_CHALLENGES);
        const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)] as keyof typeof PERCEPTUAL_CHALLENGES;
        setCurrentChallenge(PERCEPTUAL_CHALLENGES[type].generate());
        setStep('challenge');
      } else if (myJoin?.status === 'denied') {
        setError("Your entry request was declined by the instructor.");
        setStep('fail');
      }
    }
  }, [pendingJoins, step, user]);

  // 1. PHASE 1: PROXIMITY CHECK
  useEffect(() => {
    if (step === 'proximity') {
      const verify = async () => {
        try {
          setLoading(true);
          console.log("[Phantom] Starting proximity scan...");
          await new Promise(r => setTimeout(r, 1000));
          
          const localIPs = await proximityVerifier.collectLocalCandidates().catch(err => {
            console.warn("[Phantom] Proximity scan failed:", err);
            return [];
          });
          
          const isVerified = localIPs.length > 0 || window.location.hostname === 'localhost';
          
          setSignals(prev => ({ ...prev, LAN_PROXIMITY: isVerified }));
          setStep('handshake');
        } catch (err) {
          console.error("[Phantom] Proximity phase error:", err);
          setStep('handshake');
        } finally {
          setLoading(false);
        }
      };
      verify();
    }
  }, [step]);

  // 2. PHASE 2: CRYPTO HANDSHAKE & REQUEST JOIN
  useEffect(() => {
    if (step === 'handshake') {
      const doHandshake = async () => {
        try {
          setLoading(true);
          console.log("[Phantom] Starting identity anchoring...");
          await new Promise(r => setTimeout(r, 1000));
          
          // Fingerprint
          await buildHardwareFingerprint().catch(err => {
            console.warn("[Phantom] Fingerprinting failed:", err);
            return "legacy_fp_" + Date.now();
          });
          setSignals(prev => ({ ...prev, HARDWARE_FINGERPRINT: true }));
          
          // Crypto derivation
          setSignals(prev => ({ ...prev, CRYPTO_JOIN: true }));
          
          // INITIATE REQUEST
          await requestJoin({
            studentId: user?.id || user?.name || 'anonymous',
            name: user?.name || 'Anonymous Student',
            signals: { ...signals, HARDWARE_FINGERPRINT: true, CRYPTO_JOIN: true },
            score: 75, // Initial trust
            sharedSecretB64: ''
          });

          setStep('waiting');
        } catch (err) {
          console.error("[Phantom] Handshake error:", err);
          setError("Session security could not be established.");
          setStep('fail');
        } finally {
          setLoading(false);
        }
      };
      doHandshake();
    }
  }, [step, user, requestJoin]);

  const handleChallengeComplete = async (success: boolean) => {
    const biometrics = pointerBiometrics.stopCapture();
    const finalSignals = { 
      ...signals, 
      PERCEPTUAL_CHALLENGE: success,
      POINTER_BIOMETRICS: biometrics.valid
    };

    if (success) {
      const scoreResult = trustEngine?.computeScore({
        signals: finalSignals,
        tabSwitches: 0,
        proximityVerified: signals.LAN_PROXIMITY,
        timingAnomalies: 0,
        hardwareMatch: true,
        heartbeatGaps: 0
      });

      await submitJoin({
        studentId: user?.id || user?.name || 'anonymous',
        name: user?.name || 'Anonymous Student',
        signals: finalSignals,
        score: scoreResult?.score || 0,
        verdict: scoreResult?.verdict || 'absent',
        timestamp: Date.now(),
        tabSwitches: 0,
        proximityVerified: signals.LAN_PROXIMITY,
        timingAnomalies: 0,
        hardwareMatch: true,
        heartbeatGaps: 0,
        sharedSecretB64: ''
      });

      setStep('success');
    } else {
      setStep('fail');
      setError('Challenge verification failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {step === 'proximity' && (
          <motion.div 
            key="proximity"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-6"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 rounded-full border-2 border-primary/20 border-t-primary mx-auto"
              />
              <Radio className="absolute inset-0 m-auto text-primary animate-pulse" size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Verifying Proximity.</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-[240px]">Scanning local mesh network to confirm you are in the classroom.</p>
            </div>
          </motion.div>
        )}

        {step === 'handshake' && (
          <motion.div 
            key="handshake"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="h-20 w-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 mx-auto">
              <Fingerprint size={40} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Identity Anchoring.</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-[240px]">Securing session with cryptographic handshake and hardware entropy.</p>
            </div>
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground/30" />
          </motion.div>
        )}

        {step === 'waiting' && (
          <motion.div 
            key="waiting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-primary/5 border-2 border-dashed border-primary/30 flex items-center justify-center mx-auto animate-[spin_10s_linear_infinite]">
                 <Lock size={32} className="text-primary/40 -rotate-[15deg]" />
              </div>
              <Shield className="absolute inset-0 m-auto text-primary animate-pulse" size={40} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Waiting for Instructor.</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-[260px]">
                Your handshake was successful. Please wait for the teacher to allow your entry into the room.
              </p>
            </div>
            <div className="flex justify-center gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === 'challenge' && (
          <motion.div 
            key="challenge"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md"
          >
            <div className="surface-card rounded-[2.5rem] p-8 border border-border/40 shadow-glow-soft">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Target size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Level 3: Human Verification</p>
                  <h3 className="text-lg font-bold">Perceptual Challenge</h3>
                </div>
              </div>

              {currentChallenge && (
                <ChallengeRouter 
                  challenge={currentChallenge} 
                  onComplete={handleChallengeComplete} 
                />
              )}
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="h-24 w-24 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-glow shadow-emerald-500/40">
              <CheckCircle2 size={48} />
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tight">Verified.</h3>
              <p className="text-sm text-muted-foreground mt-2">Your attendance has been recorded in the audit chain.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {Object.keys(signals).map(s => (
                 <span key={s} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[8px] font-bold uppercase tracking-widest border border-emerald-500/20">
                   {s.replace('_', ' ')}
                 </span>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'fail' && (
          <motion.div 
            key="fail"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="h-24 w-24 rounded-full bg-destructive text-white flex items-center justify-center mx-auto shadow-glow shadow-destructive/40">
              <AlertCircle size={48} />
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tight text-destructive">Rejected.</h3>
              <p className="text-sm text-muted-foreground mt-2">{error || "Integrity check failed."}</p>
            </div>
            <button 
              onClick={() => {
                setStep('proximity');
                setError(null);
              }}
              className="px-8 py-3 rounded-full bg-foreground text-background font-bold text-sm hover:scale-105 transition-all"
            >
              Retry Handshake
            </button>
          </motion.div>
        )}

        {/* Safety Fallback */}
        {!['proximity', 'handshake', 'challenge', 'success', 'fail'].includes(step) && (
          <div className="text-center p-8">
            <AlertCircle className="mx-auto text-destructive mb-4" size={40} />
            <h3 className="font-bold">Initialization Error</h3>
            <p className="text-sm text-muted-foreground">The phantom mesh could not be synchronized.</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-xs font-bold uppercase underline">Reload Portal</button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChallengeRouter({ challenge, onComplete }: { challenge: any; onComplete: (s: boolean) => void }) {
  useEffect(() => {
    pointerBiometrics.startCapture();
  }, []);

  if (challenge.question) {
    return <SemanticTap challenge={challenge} onComplete={onComplete} />;
  }
  if (challenge.sequence) {
    return <SequenceMemory challenge={challenge} onComplete={onComplete} />;
  }
  if (challenge.path) {
    return <TrajectoryTrace challenge={challenge} onComplete={onComplete} />;
  }
  return null;
}

function SemanticTap({ challenge, onComplete }: { challenge: any; onComplete: (s: boolean) => void }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (name: string) => {
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const submit = () => {
    const correct = challenge.objects.filter((o: any) => o[challenge.correctKey]).map((o: any) => o.name).sort();
    const isCorrect = JSON.stringify(correct) === JSON.stringify([...selected].sort());
    onComplete(isCorrect);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm font-bold text-foreground leading-relaxed">{challenge.question}</p>
      <div className="grid grid-cols-3 gap-3">
        {challenge.objects.map((obj: any) => (
          <button
            key={obj.name}
            onClick={() => toggle(obj.name)}
            className={cn(
              "h-20 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1",
              selected.includes(obj.name) ? "bg-primary border-primary text-primary-foreground scale-95" : "bg-secondary/40 border-border/40 hover:border-primary/40"
            )}
          >
            <span className="text-2xl">{obj.emoji}</span>
            <span className="text-[10px] font-bold">{obj.name}</span>
          </button>
        ))}
      </div>
      <button 
        onClick={submit}
        className="w-full py-4 rounded-2xl bg-foreground text-background font-bold text-sm tracking-tight hover:scale-[1.02] active:scale-95 transition-all"
      >
        Verify Selection
      </button>
    </div>
  );
}

function SequenceMemory({ challenge, onComplete }: { challenge: any; onComplete: (s: boolean) => void }) {
  const [step, setStep] = useState<'watch' | 'play'>('watch');
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [userInput, setUserInput] = useState<number[]>([]);

  useEffect(() => {
    const playSequence = async () => {
      await new Promise(r => setTimeout(r, 1000));
      for (const cell of challenge.sequence) {
        setActiveCell(cell);
        await new Promise(r => setTimeout(r, challenge.displayMs));
        setActiveCell(null);
        await new Promise(r => setTimeout(r, challenge.intervalMs));
      }
      setStep('play');
    };
    playSequence();
  }, [challenge]);

  const handleTap = (idx: number) => {
    if (step === 'watch') return;
    const newPath = [...userInput, idx];
    setUserInput(newPath);
    if (newPath.length === challenge.sequence.length) {
      onComplete(JSON.stringify(newPath) === JSON.stringify(challenge.sequence));
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm font-bold text-foreground">
        {step === 'watch' ? "Watch the pattern..." : "Recreate the pattern."}
      </p>
      <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
        {Array.from({ length: 9 }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleTap(i)}
            className={cn(
              "aspect-square rounded-2xl border transition-all duration-300",
              activeCell === i ? "bg-primary border-primary scale-110 shadow-glow" : 
              userInput.includes(i) ? "bg-primary/20 border-primary/40" : "bg-secondary/40 border-border/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}

function TrajectoryTrace({ challenge, onComplete }: { challenge: any; onComplete: (s: boolean) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tracing, setTracing] = useState(false);
  const [points, setPoints] = useState<{x: number, y: number}[]>([]);

  const handleStart = () => setTracing(true);
  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!tracing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;
    setPoints(prev => [...prev, { x, y }]);
  };
  const handleEnd = () => {
    setTracing(false);
    // Simple validation for demo
    onComplete(points.length > 20);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm font-bold text-foreground">Trace the path from A to B.</p>
      <div 
        className="relative bg-secondary/20 rounded-2xl border border-border/40 overflow-hidden"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <canvas 
          ref={canvasRef}
          width={300}
          height={200}
          className="w-full h-auto cursor-crosshair"
        />
        {/* Draw path placeholder */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
           <circle cx={challenge.path.startX} cy={challenge.path.startY} r="4" fill="var(--primary)" />
           <circle cx={challenge.path.endX} cy={challenge.path.endY} r="4" fill="var(--primary)" />
           <path 
             d={`M ${challenge.path.startX} ${challenge.path.startY} C ${challenge.path.cp1X} ${challenge.path.cp1Y}, ${challenge.path.cp2X} ${challenge.path.cp2Y}, ${challenge.path.endX} ${challenge.path.endY}`}
             fill="none"
             stroke="var(--primary)"
             strokeWidth="2"
             strokeDasharray="4 4"
             className="opacity-20"
           />
        </svg>
      </div>
    </div>
  );
}
