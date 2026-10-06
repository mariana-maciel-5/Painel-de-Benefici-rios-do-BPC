import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  subtitleColor?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  subtitleColor = 'text-slate-500',
}: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <div>{icon}</div>
      </div>
      <h3 className="text-3xl font-bold mt-2 text-slate-800">{value}</h3>
      <p className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${subtitleColor}`}>
        {subtitle}
      </p>
    </div>
  );
}
