import { ShieldCheck, Lock } from 'lucide-react';
import { LoginForm } from '../features/auth/components/LoginForm';
import { APP_CONFIG } from '../config/constants';

export function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Fundo decorativo com gradientes */}
      <div className="absolute inset-0 bg-radial from-blue-900/20 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Cabeçalho de Boas-vindas */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-2">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Portal {APP_CONFIG.TITLE}</h1>
          <p className="text-sm text-slate-400">
            Sistema Integrado de {APP_CONFIG.SUBTITLE}
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/50 text-blue-300 text-xs font-medium mt-1">
            <Lock className="w-3.5 h-3.5 text-blue-400" /> Autenticação Segura via JWT (Bearer)
          </div>
        </div>

        {/* Card do Formulário de Login */}
        <LoginForm />

        <p className="text-center text-[11px] text-slate-500">
          {APP_CONFIG.FOOTER_TEXT}
        </p>
      </div>
    </div>
  );
}
