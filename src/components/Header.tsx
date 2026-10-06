import { CheckCircle2, LogOut } from 'lucide-react';
import { useAuthContext } from '../hooks/useAuthContext';

export function Header() {
  const { logout } = useAuthContext();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-slate-800">Painel de Acesso Seguro</h1>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Autenticado via JWT
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={logout}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> Sair
        </button>
      </div>
    </header>
  );
}
