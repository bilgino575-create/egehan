"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export default function PageviewChart({ data }: { data: { date: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="pv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "currentColor" }}
          tickLine={false}
          axisLine={false}
          className="text-navy-900/50 dark:text-white/40"
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid rgba(20,28,63,0.1)",
            fontSize: 12,
          }}
          labelStyle={{ fontWeight: 700 }}
        />
        <Area
          type="monotone"
          dataKey="count"
          name="Ziyaretçi"
          stroke="#f97316"
          strokeWidth={2.5}
          fill="url(#pv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
