import { RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
}

export function LoadingSpinner({ text = 'Carregando dados...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 text-slate-500">
      <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
      <span className="text-xs font-medium">{text}</span>
    </div>
  );
}
