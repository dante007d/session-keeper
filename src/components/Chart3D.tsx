import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface Chart3DProps {
  data: any[];
}

export const AttendanceChart3D: React.FC<Chart3DProps> = ({ data }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          />
          <YAxis hide />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="glass px-3 py-2 rounded-xl border border-primary/20 shadow-glow-soft">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                      {payload[0].payload.name}
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {payload[0].value} Sessions
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`hsl(var(--primary) / ${0.4 + (index / data.length) * 0.6})`} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart3D;
