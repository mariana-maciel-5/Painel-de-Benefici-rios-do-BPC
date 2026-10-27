import { RefreshCw, TrendingUp } from 'lucide-react';
import type { IndicadorItem } from '../types/indicador.types';

interface IndicadoresHistoryTableProps {
  indicadores: IndicadorItem[];
  loading: boolean;
  onRefresh: () => void;
}

export function IndicadoresHistoryTable({
  indicadores,
  loading,
  onRefresh,
}: IndicadoresHistoryTableProps) {
  const formatCurrency = (val: number | string) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" /> Série Histórica da Entidade Indicadores
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Registros consolidados salvos na tabela <code className="bg-slate-100 text-blue-700 px-1 py-0.5 rounded font-mono">indicadores</code>
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Atualizar
        </button>
      </div>

      {indicadores.length > 0 ? (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Mês de Referência</th>
                <th className="px-5 py-3.5">Total de Beneficiários</th>
                <th className="px-5 py-3.5">Nº de Idosos</th>
                <th className="px-5 py-3.5">Nº de PCDs</th>
                <th className="px-5 py-3.5">Ativos / Inativos</th>
                <th className="px-5 py-3.5">Total Repassado</th>
                <th className="px-5 py-3.5">Bairro Destaque</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              {indicadores.map((ind) => (
                <tr key={ind.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-800">
                    <span className="bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-1 rounded-lg text-xs font-semibold">
                      {ind.mes_referencia}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {ind.total_beneficiarios.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-indigo-700">{ind.num_idosos.toLocaleString('pt-BR')}</span>
                      {ind.taxa_idosos && (
                        <span className="text-[11px] text-slate-400">({ind.taxa_idosos}%)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-purple-700">{ind.num_pcd.toLocaleString('pt-BR')}</span>
                      {ind.taxa_pcd && (
                        <span className="text-[11px] text-slate-400">({ind.taxa_pcd}%)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium text-emerald-700">{ind.num_ativos} ativos</span>
                    <span className="text-xs text-slate-400"> / </span>
                    <span className="text-xs font-medium text-amber-700">{ind.num_inativos} inativos</span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">
                    {formatCurrency(ind.valor_total_repassado)}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">
                    {ind.bairro_destaque || 'Recife'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-xs text-slate-500">Nenhum registro histórico na entidade indicadores.</p>
        </div>
      )}
    </div>
  );
}
