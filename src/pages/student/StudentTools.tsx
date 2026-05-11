import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/authStore";
import { StudentNav } from "@/components/student/StudentNav";
import { useToolsStore, Assignment, QAEntry, Shoutout } from "@/lib/toolsStore";
import { 
  Timer, Send, MessageSquare, Heart, GraduationCap, 
  ExternalLink, Lightbulb, Target, Trophy, Clock, 
  Check, Play, Pause, RotateCcw, Github, Globe, 
  Figma, FileText, ImageIcon, User, ShieldAlert 
} from "lucide-react";

// Tool 1: Pomodoro Timer
function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setMode(m => m === 'work' ? 'break' : 'work');
      setTimeLeft(mode === 'work' ? 5 * 60 : 25 * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const format = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="surface-card rounded-[2rem] p-6 shadow-sm border border-border/40 text-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center justify-center gap-2">
        <Timer size={12} className="text-primary" /> Focus Session
      </p>
      <div className="mb-6">
        <h2 className="font-mono font-black text-5xl text-foreground tracking-tighter">
          {format(timeLeft)}
        </h2>
        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-2">
          {mode === 'work' ? 'Deep Work Mode' : 'Refuel Break'}
        </p>
      </div>
      <div className="flex gap-2 justify-center">
        <button onClick={() => setIsActive(!isActive)} className="p-4 rounded-2xl bg-primary text-primary-foreground shadow-glow hover:scale-105 active:scale-95 transition-all">
          {isActive ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button onClick={() => { setIsActive(false); setTimeLeft(25 * 60); }} className="p-4 rounded-2xl bg-secondary/40 border border-border/40 text-muted-foreground hover:bg-secondary/60 transition-all">
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
}

// Tool 2: Assignment Submission Hub
function AssignmentHub() {
  const { addAssignment } = useToolsStore();
  const [type, setType] = useState<Assignment['type']>('github');
  const [url, setUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    addAssignment({ studentId: 'me', sessionId: 'active', type, url, notes: '' });
    setUrl("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const icons = { github: <Github size={18}/>, demo: <Globe size={18}/>, figma: <Figma size={18}/>, doc: <FileText size={18}/>, image: <ImageIcon size={18}/> };

  return (
    <div className="surface-card rounded-[2rem] p-6 shadow-sm border border-border/40">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
        <Send size={12} className="text-primary" /> Project Submission
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-5 gap-2">
          {(Object.keys(icons) as Assignment['type'][]).map(t => (
            <button key={t} type="button" onClick={() => setType(t)}
                    className={`p-3 rounded-xl border flex items-center justify-center transition-all
                               ${type === t ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'bg-secondary/20 border-border/40 text-muted-foreground hover:border-primary/30'}`}>
              {icons[t]}
            </button>
          ))}
        </div>
        <div className="relative">
          <input value={url} onChange={e => setUrl(e.target.value)}
                 placeholder={`Paste your ${type} link here...`}
                 className="w-full px-5 py-4 rounded-2xl bg-secondary/30 border border-border/40 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all" />
          <button type="submit" className="absolute right-2 top-2 p-2 rounded-xl bg-primary text-primary-foreground shadow-glow hover:scale-105 active:scale-95 transition-all">
            {submitted ? <Check size={20} /> : <Send size={20} />}
          </button>
        </div>
      </form>
    </div>
  );
}

// Tool 3: Q&A Board
function QABoard() {
  const { qa, addQA } = useToolsStore();
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [isAnon, setIsAnon] = useState(false);

  const handleSubmit = () => {
    if (!question.trim()) return;
    addQA({ sessionId: 'active', question, isAnonymous: isAnon, author: user?.name || 'Guest' });
    setQuestion("");
  };

  return (
    <div className="surface-card rounded-[2rem] p-6 shadow-sm border border-border/40">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
        <MessageSquare size={12} className="text-primary" /> Session Q&A
      </p>
      <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 custom-scrollbar pr-2">
        {qa.length === 0 ? (
          <p className="text-center text-xs font-medium text-muted-foreground opacity-40 py-8 italic">No questions yet. Be the first!</p>
        ) : (
          qa.map(q => (
            <motion.div key={q.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        className="p-4 rounded-2xl bg-secondary/30 border border-border/30 relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {q.isAnonymous ? <ShieldAlert size={10} /> : <User size={10} />}
                </div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  {q.isAnonymous ? 'Anonymous' : q.author}
                </span>
              </div>
              <p className="text-xs font-bold text-foreground leading-relaxed">{q.question}</p>
              {q.answer && (
                <div className="mt-3 p-3 rounded-xl bg-primary/5 border-l-2 border-primary text-[11px] font-medium text-foreground">
                   <span className="font-black text-primary mr-1">A:</span> {q.answer}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
      <div className="relative">
        <textarea value={question} onChange={e => setQuestion(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full px-5 py-4 rounded-2xl bg-secondary/30 border border-border/40 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none h-24" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <button onClick={() => setIsAnon(!isAnon)} 
                  className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border transition-all
                             ${isAnon ? 'bg-primary text-primary-foreground border-primary' : 'bg-white/50 text-muted-foreground border-border/40'}`}>
            {isAnon ? 'Anonymous' : 'Public'}
          </button>
        </div>
        <button onClick={handleSubmit} className="absolute bottom-3 right-3 p-2 rounded-xl bg-primary text-primary-foreground shadow-glow hover:scale-105 active:scale-95 transition-all">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

// Tool 4: Shoutouts
function ShoutoutFeed() {
  const { shoutouts, addShoutout } = useToolsStore();
  const { user } = useAuth();
  const [msg, setMsg] = useState("");
  const [to, setTo] = useState("");

  const handleSubmit = () => {
    if (!msg.trim() || !to.trim()) return;
    addShoutout({ from: user?.name || 'Guest', to, message: msg });
    setMsg(""); setTo("");
  };

  return (
    <div className="surface-card rounded-[2.5rem] p-8 shadow-sm border border-border/40 bg-gradient-to-br from-primary/[0.02] to-transparent">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
        <Heart size={12} className="text-primary" /> Peer Shoutouts
      </p>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 mb-6">
        {shoutouts.length === 0 ? (
          <div className="w-full py-12 text-center opacity-30">
             <Heart size={40} className="mx-auto mb-2" />
             <p className="text-xs font-bold uppercase tracking-widest">Spread some love</p>
          </div>
        ) : (
          shoutouts.map(s => (
            <motion.div key={s.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="min-w-[200px] p-5 rounded-[2rem] bg-white border border-primary/10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 text-primary/10 group-hover:text-primary/20 transition-all">
                <Heart size={40} fill="currentColor" />
              </div>
              <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-3">To: {s.to}</p>
              <p className="text-xs font-medium text-foreground italic leading-relaxed">"{s.message}"</p>
              <p className="text-[8px] font-bold text-muted-foreground mt-4 uppercase tracking-[0.2em]">— {s.from}</p>
            </motion.div>
          ))
        )}
      </div>
      <div className="space-y-3">
        <input value={to} onChange={e => setTo(e.target.value)} placeholder="Member name..." className="w-full px-4 py-3 rounded-xl bg-white border border-border/40 text-xs font-bold" />
        <div className="relative">
          <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Write something nice..." className="w-full px-4 py-3 pr-12 rounded-xl bg-white border border-border/40 text-xs font-medium" />
          <button onClick={handleSubmit} className="absolute right-1 top-1 p-2 rounded-lg bg-primary text-primary-foreground">
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Tool 5: Study Log
function StudyLogTracker() {
  const { studyLogs, addStudyLog } = useToolsStore();
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState(30);

  const handleSubmit = () => {
    if (!topic.trim()) return;
    addStudyLog({ studentId: 'me', topic, duration });
    setTopic("");
  };

  const totalHrs = Math.round(studyLogs.reduce((acc, l) => acc + l.duration, 0) / 60);

  return (
    <div className="surface-card rounded-[2rem] p-6 shadow-sm border border-border/40">
      <div className="flex justify-between items-center mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <GraduationCap size={12} className="text-primary" /> Study Log
        </p>
        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary">
          {totalHrs}h TOTAL
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic..." className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/30 border border-border/40 text-xs font-bold" />
        <select value={duration} onChange={e => setDuration(Number(e.target.value))} className="px-3 py-2.5 rounded-xl bg-secondary/30 border border-border/40 text-xs font-bold">
          <option value={30}>30m</option>
          <option value={60}>1h</option>
          <option value={120}>2h</option>
        </select>
        <button onClick={handleSubmit} className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest shadow-glow">Log</button>
      </div>
      <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar">
        {studyLogs.slice(0, 3).map(l => (
          <div key={l.id} className="flex justify-between items-center p-3 rounded-xl bg-secondary/20 border border-border/20">
            <span className="text-[10px] font-bold text-foreground truncate">{l.topic}</span>
            <span className="text-[10px] font-mono text-muted-foreground">{l.duration}m</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentTools() {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pt-20">
      <StudentNav />
      <div className="max-w-4xl mx-auto px-5 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center md:text-left">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2">STUDENT TOOLKIT</p>
          <h1 className="font-bold text-5xl text-foreground tracking-tighter">Forge Ahead.</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <PomodoroTimer />
            <StudyLogTracker />
            <div className="bg-primary rounded-[2rem] p-6 text-primary-foreground shadow-glow relative overflow-hidden group">
              <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary-foreground/60 mb-3 flex items-center gap-2">
                <Lightbulb size={12} /> Daily Wisdom
              </p>
              <p className="text-base font-bold leading-relaxed mb-4">"Git commit often, push early."</p>
              <span className="inline-block px-3 py-1 rounded-xl bg-white/20 text-[9px] font-bold uppercase tracking-[0.1em]">VERSION_CONTROL</span>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <AssignmentHub />
            <ShoutoutFeed />
            <QABoard />
          </div>
        </div>
      </div>
    </div>
  );
}
