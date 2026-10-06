import { RefreshCw, Shield } from 'lucide-react';
import type { PapelItem } from '../types/papel.types';

interface PapelListTableProps {
  papeis: PapelItem[];
  loading: boolean;
  onRefresh: () => void;
}

export function PapelListTable({ papeis, loading, onRefresh }: PapelListTableProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-500">
          Papéis (cargos) e total de permissões do sistema BPC Recife.
        </p>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Atualizar
        </button>
      </div>

      {papeis.length > 0 ? (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Nome do Papel</th>
                <th className="px-6 py-3">Descrição Funcional</th>
                <th className="px-6 py-3">Permissões Atribuídas</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
              {papeis.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-3.5 font-mono text-xs">{p.id}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-800">{p.nome}</td>
                  <td className="px-6 py-3.5 text-xs text-slate-500">{p.descricao || '-'}</td>
                  <td className="px-6 py-3.5">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md text-xs font-bold">
                      {p.total_permissoes} permissões
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <Shield className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Nenhum papel listado.</p>
          <p className="text-xs text-slate-500 mt-1">Execute o Seed para popular os papéis municipais.</p>
        </div>
      )}
    </div>
  );
}
