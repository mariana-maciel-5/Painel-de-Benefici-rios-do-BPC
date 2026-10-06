import { User as UserIcon, Key, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useLoginForm } from '../hooks/useLoginForm';
import { QuickLoginCards } from './QuickLoginCards';

export function LoginForm() {
  const {
    email,
    setEmail,
    senha,
    setSenha,
    loading,
    error,
    handleSubmit,
    handleQuickLogin,
  } = useLoginForm();

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            E-mail Institucional
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nome.sobrenome@recife.pe.gov.br"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <UserIcon className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Senha
          </label>
          <div className="relative">
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <Key className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Autenticando...
            </>
          ) : (
            <>
              Entrar no Sistema <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <QuickLoginCards onQuickLogin={handleQuickLogin} disabled={loading} />
    </div>
  );
}
