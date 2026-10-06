import { Database, RefreshCw, Sparkles } from 'lucide-react';
import type { DatabaseStatus } from '../types/database.types';

interface DatabaseStatusCardProps {
  healthMessage: string;
  dbStatus: DatabaseStatus | null;
  syncing: boolean;
  seeding: boolean;
  onSync: () => void;
  onSeed: () => void;
}

export function DatabaseStatusCard({
  healthMessage,
  dbStatus,
  syncing,
  seeding,
  onSync,
  onSeed,
}: DatabaseStatusCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" /> Status da Infraestrutura & Banco MySQL
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Conexão com <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded font-mono">bpc_recife_d</code> &bull; Autenticação JWT ativa em todas as requisições privadas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSync}
            disabled={syncing}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sincronizando...' : 'Sincronizar Banco'}
          </button>
          <button
            onClick={onSeed}
            disabled={seeding}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {seeding ? 'Populando...' : '🌱 Popular Seed Inicial'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Servidor Fastify</p>
            <p className="font-semibold text-sm mt-0.5 text-slate-800">{healthMessage}</p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
        </div>

        <div
          className={`px-4 py-3 rounded-xl border flex items-center justify-between ${
            dbStatus?.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="pr-2">
            <p className="text-xs uppercase tracking-wider font-bold">Banco de Dados MySQL</p>
            <p className="font-medium text-xs mt-0.5 truncate max-w-sm" title={dbStatus?.message}>
              {dbStatus ? dbStatus.message : 'Verificando conexão...'}
            </p>
          </div>
          <span
            className={`w-2.5 h-2.5 rounded-full ring-4 ${
              dbStatus?.success
                ? 'bg-emerald-500 ring-emerald-100'
                : 'bg-amber-500 ring-amber-100'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
