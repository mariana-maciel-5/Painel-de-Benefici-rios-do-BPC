import { UserCheck, Accessibility, CheckCircle2, XCircle, MapPin, Calendar, Sparkles, RefreshCw } from 'lucide-react';
import type { IndicadorItem } from '../types/indicador.types';

interface IndicadoresDistributionPanelProps {
  indicador: IndicadorItem | null;
  onRecalcular: () => void;
  recalculando: boolean;
}

export function IndicadoresDistributionPanel({
  indicador,
  onRecalcular,
  recalculando,
}: IndicadoresDistributionPanelProps) {
  const total = indicador?.total_beneficiarios || 1;
  const idosos = indicador?.num_idosos || 0;
  const pcd = indicador?.num_pcd || 0;
  const ativos = indicador?.num_ativos || 0;
  const inativos = indicador?.num_inativos || 0;

  const pctIdosos = Math.round((idosos / total) * 100);
  const pctPcd = Math.round((pcd / total) * 100);
  const pctAtivos = Math.round((ativos / total) * 100);
  const pctInativos = Math.round((inativos / total) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Mês de Referência: {indicador?.mes_referencia || 'Outubro/2026'}
            </span>
            {indicador?.bairro_destaque && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Maior concentração: <strong>{indicador.bairro_destaque}</strong>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Cálculo e consolidação executados pela Assistência Social
          </p>
        </div>

        <button
          onClick={onRecalcular}
          disabled={recalculando}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${recalculando ? 'animate-spin' : ''}`} />
          {recalculando ? 'Recalculando da Base...' : 'Recalcular Indicadores da Base'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribuição por Modalidade: Idosos vs PCD */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Distribuição por Modalidade
            </h4>
            <span className="text-xs text-slate-500 font-medium">Total: {total.toLocaleString('pt-BR')}</span>
          </div>

          {/* Barra Visual */}
          <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${pctIdosos}%` }}
              className="bg-indigo-600 h-full transition-all duration-500"
              title={`Idosos: ${pctIdosos}%`}
            />
            <div
              style={{ width: `${pctPcd}%` }}
              className="bg-purple-500 h-full transition-all duration-500"
              title={`PCD: ${pctPcd}%`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Nº de Idosos</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-slate-800">{idosos.toLocaleString('pt-BR')}</span>
                  <span className="text-xs font-bold text-indigo-600">({pctIdosos}%)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Accessibility className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Nº de PCDs</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-slate-800">{pcd.toLocaleString('pt-BR')}</span>
                  <span className="text-xs font-bold text-purple-600">({pctPcd}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Distribuição por Situação: Ativos vs Inativos */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Situação Cadastral
            </h4>
            <span className="text-xs text-slate-500 font-medium">Concessões Regulares</span>
          </div>

          {/* Barra Visual */}
          <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${pctAtivos}%` }}
              className="bg-emerald-500 h-full transition-all duration-500"
              title={`Ativos: ${pctAtivos}%`}
            />
            <div
              style={{ width: `${pctInativos}%` }}
              className="bg-amber-400 h-full transition-all duration-500"
              title={`Inativos: ${pctInativos}%`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Ativos / Regulares</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-slate-800">{ativos.toLocaleString('pt-BR')}</span>
                  <span className="text-xs font-bold text-emerald-600">({pctAtivos}%)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Suspensos / Inativos</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-slate-800">{inativos.toLocaleString('pt-BR')}</span>
                  <span className="text-xs font-bold text-amber-600">({pctInativos}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
