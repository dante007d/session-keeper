import { motion } from "framer-motion";
import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// 1. Attendance Heatmap (12-week grid)
export function AttendanceHeatmap({ sessions, attendanceRecords }: { sessions: any[], attendanceRecords: any[] }) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (12 * 7 - 1)); // 12 weeks ago

  const dayMap: Record<string, string> = {};
  attendanceRecords.forEach(r => {
    const dateKey = new Date(r.checkedInAt).toDateString();
    dayMap[dateKey] = r.status;
  });

  const weeks = [];
  let current = new Date(startDate);
  for (let w = 0; w < 12; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateKey = current.toDateString();
      week.push({ date: new Date(current), status: dayMap[dateKey] || null });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  const getColor = (status: string | null) => {
    if (!status) return 'bg-secondary/40';
    if (status === 'present') return 'bg-emerald-500';
    if (status === 'late') return 'bg-amber-500';
    if (status === 'absent') return 'bg-destructive';
    return 'bg-secondary/40';
  };

  return (
    <div className="surface-card rounded-[2rem] p-6 shadow-sm border border-border/40">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Attendance Matrix — 12 Weeks</p>
        <div className="flex gap-2 text-[8px] font-bold uppercase text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500" /> Present</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-500" /> Late</span>
        </div>
      </div>
      <div className="flex gap-[4px] justify-center overflow-x-auto no-scrollbar">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[4px]">
            {week.map((day, di) => (
              <motion.div
                key={di}
                whileHover={{ scale: 1.2 }}
                className={`w-[12px] h-[12px] rounded-sm transition-colors ${getColor(day.status)}`}
                title={day.date.toLocaleDateString()}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Attendance Donut Ring
export function AttendanceDonut({ rate, size = 120 }: { rate: number, size?: number }) {
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (rate / 100) * circumference;
  const color = rate >= 85 ? 'var(--primary)' : rate >= 70 ? '#E8A020' : '#D95B5B';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary/40" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-mono font-black text-2xl text-foreground leading-none">{rate}%</p>
        <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Consistency</p>
      </div>
    </div>
  );
}

// 3. Skill Growth Timeline
export function SkillGrowthChart() {
  const data = [
    { name: "Week 1", skill: 20 },
    { name: "Week 2", skill: 25 },
    { name: "Week 3", skill: 45 },
    { name: "Week 4", skill: 40 },
    { name: "Week 5", skill: 65 },
    { name: "Week 6", skill: 70 },
    { name: "Week 7", skill: 85 },
  ];

  return (
    <div className="surface-card rounded-[2rem] p-6 shadow-sm border border-border/40 h-[240px]">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6">Skill Growth Timeline</p>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
          <XAxis dataKey="name" hide />
          <YAxis hide domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '1rem', border: '1px solid var(--border)', fontSize: '10px', fontWeight: 'bold' }}
            itemStyle={{ color: 'var(--primary)' }}
          />
          <Line 
            type="monotone" 
            dataKey="skill" 
            stroke="var(--primary)" 
            strokeWidth={3} 
            dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--card)' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// 4. Achievement Badges
export const ALL_BADGES = [
  { id: 'first', icon: '🌱', label: 'First Step', desc: 'Attended 1st session' },
  { id: 'streak_3', icon: '⚡', label: 'On a Roll', desc: '3-session streak' },
  { id: 'streak_5', icon: '🔥', label: 'Unstoppable', desc: '5-session streak' },
  { id: 'top3', icon: '🏆', label: 'Elite', desc: 'Top 3 on Leaderboard' },
  { id: 'perfect', icon: '💎', label: 'Perfect Month', desc: '100% attendance' },
  { id: 'helper', icon: '🤝', label: 'Community', desc: 'Helped 5 peers' },
];

export function BadgesGrid({ earnedIds }: { earnedIds: string[] }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {ALL_BADGES.map(badge => {
        const isEarned = earnedIds.includes(badge.id);
        return (
          <motion.div
            key={badge.id}
            whileHover={{ scale: 1.05, y: -2 }}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all cursor-default
                       ${isEarned ? 'bg-primary/5 border-primary/20' : 'bg-secondary/20 border-border/20 grayscale opacity-40'}`}
          >
            <span className="text-2xl">{badge.icon}</span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-center leading-tight">
              {badge.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
