import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'blue' | 'emerald' | 'amber' | 'slate' | 'purple';
}

export function Badge({ children, variant = 'blue' }: BadgeProps) {
  const styles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200/60',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/60',
    slate: 'bg-slate-100 text-slate-700 border-slate-200/60',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/60',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
