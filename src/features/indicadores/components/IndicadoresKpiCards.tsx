import { Users, Heart, Award, CheckCircle2, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import type { IndicadorItem, PaletaCores } from '../types/indicador.types';

interface IndicadoresKpiCardsProps {
  indicadores: IndicadorItem[];
  paleta?: PaletaCores;
}

export function IndicadoresKpiCards({ indicadores, paleta = 'civica' }: IndicadoresKpiCardsProps) {
  // Obter valores vindos do banco de dados quando disponíveis, ou valores de referência
  const getValorIndicador = (termoBusca: string, fallback: number) => {
    const item = indicadores.find((ind) =>
      ind.nome.toLowerCase().includes(termoBusca.toLowerCase())
    );
    if (!item || item.valor === undefined || item.valor === null) return fallback;
    const n = Number(item.valor);
    return isNaN(n) ? fallback : n;
  };

  const totalBeneficiarios = getValorIndicador('total de beneficiários', 1520);
  const numIdosos = getValorIndicador('idosos', 950);
  const numPcd = getValorIndicador('deficiência', 570);
  const numAtivos = getValorIndicador('ativos', 1480);
  const numInativos = getValorIndicador('inativos', 40);
  const valorTotal = getValorIndicador('valor total', 2146240);

  const pctIdosos = totalBeneficiarios > 0 ? ((numIdosos / totalBeneficiarios) * 100).toFixed(1) : '62.5';
  const pctPcd = totalBeneficiarios > 0 ? ((numPcd / totalBeneficiarios) * 100).toFixed(1) : '37.5';
  const pctAtivos = totalBeneficiarios > 0 ? ((numAtivos / totalBeneficiarios) * 100).toFixed(1) : '97.4';

  const formatReais = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Cores personalizadas por paleta
  const temas = {
    padrao: {
      total: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-600', border: 'hover:border-blue-300' },
      idoso: { bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-500', badge: 'text-amber-700 bg-amber-50', border: 'hover:border-amber-300' },
      pcd: { bg: 'bg-purple-50', text: 'text-purple-600', bar: 'bg-purple-500', badge: 'text-purple-700 bg-purple-50', border: 'hover:border-purple-300' },
      ativo: { bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500', numText: 'text-emerald-700', badge: 'text-emerald-700 bg-emerald-50', border: 'hover:border-emerald-300' },
      inativo: { bg: 'bg-rose-50', text: 'text-rose-600', bar: 'bg-rose-500', numText: 'text-rose-600', badge: 'text-rose-700 bg-rose-50', border: 'hover:border-rose-300' },
      valor: { bg: 'bg-teal-50', text: 'text-teal-600', bar: 'bg-teal-500', badge: 'text-teal-700 bg-teal-50', border: 'hover:border-teal-300' },
    },
    civica: {
      total: { bg: 'bg-blue-100', text: 'text-blue-800', bar: 'bg-blue-800', border: 'hover:border-blue-400' },
      idoso: { bg: 'bg-amber-100', text: 'text-amber-700', bar: 'bg-amber-600', badge: 'text-amber-800 bg-amber-100', border: 'hover:border-amber-400' },
      pcd: { bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-600', badge: 'text-orange-800 bg-orange-100', border: 'hover:border-orange-400' },
      ativo: { bg: 'bg-emerald-100', text: 'text-emerald-800', bar: 'bg-emerald-700', numText: 'text-emerald-800', badge: 'text-emerald-800 bg-emerald-100', border: 'hover:border-emerald-400' },
      inativo: { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-600', numText: 'text-red-700', badge: 'text-red-800 bg-red-100', border: 'hover:border-red-400' },
      valor: { bg: 'bg-cyan-100', text: 'text-cyan-800', bar: 'bg-cyan-700', badge: 'text-cyan-800 bg-cyan-100', border: 'hover:border-cyan-400' },
    },
    esmeralda: {
      total: { bg: 'bg-emerald-100', text: 'text-emerald-800', bar: 'bg-emerald-700', border: 'hover:border-emerald-400' },
      idoso: { bg: 'bg-amber-100', text: 'text-amber-700', bar: 'bg-amber-600', badge: 'text-amber-800 bg-amber-100', border: 'hover:border-amber-400' },
      pcd: { bg: 'bg-indigo-100', text: 'text-indigo-700', bar: 'bg-indigo-600', badge: 'text-indigo-800 bg-indigo-100', border: 'hover:border-indigo-400' },
      ativo: { bg: 'bg-teal-100', text: 'text-teal-800', bar: 'bg-teal-600', numText: 'text-teal-800', badge: 'text-teal-800 bg-teal-100', border: 'hover:border-teal-400' },
      inativo: { bg: 'bg-rose-100', text: 'text-rose-700', bar: 'bg-rose-600', numText: 'text-rose-700', badge: 'text-rose-800 bg-rose-100', border: 'hover:border-rose-400' },
      valor: { bg: 'bg-green-100', text: 'text-green-800', bar: 'bg-green-700', badge: 'text-green-800 bg-green-100', border: 'hover:border-green-400' },
    },
    executivo: {
      total: { bg: 'bg-indigo-100', text: 'text-indigo-700', bar: 'bg-indigo-600', border: 'hover:border-indigo-400' },
      idoso: { bg: 'bg-yellow-100', text: 'text-yellow-700', bar: 'bg-yellow-500', badge: 'text-yellow-800 bg-yellow-100', border: 'hover:border-yellow-400' },
      pcd: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700', bar: 'bg-fuchsia-600', badge: 'text-fuchsia-800 bg-fuchsia-100', border: 'hover:border-fuchsia-400' },
      ativo: { bg: 'bg-cyan-100', text: 'text-cyan-700', bar: 'bg-cyan-600', numText: 'text-cyan-800', badge: 'text-cyan-800 bg-cyan-100', border: 'hover:border-cyan-400' },
      inativo: { bg: 'bg-red-100', text: 'text-red-600', bar: 'bg-red-500', numText: 'text-red-600', badge: 'text-red-800 bg-red-100', border: 'hover:border-red-400' },
      valor: { bg: 'bg-violet-100', text: 'text-violet-700', bar: 'bg-violet-600', badge: 'text-violet-800 bg-violet-100', border: 'hover:border-violet-400' },
    },
  };

  const t = temas[paleta] || temas.civica;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* 1. Total Geral */}
      <div className={`bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs relative overflow-hidden group ${t.total.border} transition-all`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total BPC
          </span>
          <span className={`p-2 rounded-xl ${t.total.bg} ${t.total.text} group-hover:scale-105 transition-transform`}>
            <Users className="w-4 h-4" />
          </span>
        </div>
        <div className="text-2xl font-black text-slate-800 tracking-tight">
          {totalBeneficiarios.toLocaleString('pt-BR')}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <span className="inline-flex items-center text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +4.2%
          </span>
          <span>vs trim. ant.</span>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${t.total.bar}`} />
      </div>

      {/* 2. Idosos */}
      <div className={`bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs relative overflow-hidden group ${t.idoso.border} transition-all`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            BPC Idosos
          </span>
          <span className={`p-2 rounded-xl ${t.idoso.bg} ${t.idoso.text} group-hover:scale-105 transition-transform`}>
            <Award className="w-4 h-4" />
          </span>
        </div>
        <div className="text-2xl font-black text-slate-800 tracking-tight">
          {numIdosos.toLocaleString('pt-BR')}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span className={`font-semibold px-1.5 py-0.5 rounded text-[11px] ${t.idoso.badge}`}>
            {pctIdosos}% total
          </span>
          <span className="text-[11px] text-slate-400">≥ 65 anos</span>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${t.idoso.bar}`} />
      </div>

      {/* 3. PCD */}
      <div className={`bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs relative overflow-hidden group ${t.pcd.border} transition-all`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            BPC PCD
          </span>
          <span className={`p-2 rounded-xl ${t.pcd.bg} ${t.pcd.text} group-hover:scale-105 transition-transform`}>
            <Heart className="w-4 h-4" />
          </span>
        </div>
        <div className="text-2xl font-black text-slate-800 tracking-tight">
          {numPcd.toLocaleString('pt-BR')}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span className={`font-semibold px-1.5 py-0.5 rounded text-[11px] ${t.pcd.badge}`}>
            {pctPcd}% total
          </span>
          <span className="text-[11px] text-slate-400">Laudo ativo</span>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${t.pcd.bar}`} />
      </div>

      {/* 4. Ativos */}
      <div className={`bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs relative overflow-hidden group ${t.ativo.border} transition-all`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Ativos
          </span>
          <span className={`p-2 rounded-xl ${t.ativo.bg} ${t.ativo.text} group-hover:scale-105 transition-transform`}>
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>
        <div className={`text-2xl font-black tracking-tight ${t.ativo.numText}`}>
          {numAtivos.toLocaleString('pt-BR')}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span className={`font-semibold px-1.5 py-0.5 rounded text-[11px] ${t.ativo.badge}`}>
            {pctAtivos}% conform.
          </span>
          <span className="text-[11px] text-slate-400">Regular</span>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${t.ativo.bar}`} />
      </div>

      {/* 5. Inativos / Revisão */}
      <div className={`bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs relative overflow-hidden group ${t.inativo.border} transition-all`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Em Revisão
          </span>
          <span className={`p-2 rounded-xl ${t.inativo.bg} ${t.inativo.text} group-hover:scale-105 transition-transform`}>
            <AlertTriangle className="w-4 h-4" />
          </span>
        </div>
        <div className={`text-2xl font-black tracking-tight ${t.inativo.numText}`}>
          {numInativos.toLocaleString('pt-BR')}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span className={`font-semibold px-1.5 py-0.5 rounded text-[11px] ${t.inativo.badge}`}>
            {(100 - Number(pctAtivos)).toFixed(1)}% susp.
          </span>
          <span className="text-[11px] text-slate-400">CadÚnico</span>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${t.inativo.bar}`} />
      </div>

      {/* 6. Repasse Mensal */}
      <div className={`bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs relative overflow-hidden group ${t.valor.border} transition-all`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Repasse Mensal
          </span>
          <span className={`p-2 rounded-xl ${t.valor.bg} ${t.valor.text} group-hover:scale-105 transition-transform`}>
            <DollarSign className="w-4 h-4" />
          </span>
        </div>
        <div className="text-xl font-black text-slate-800 tracking-tight truncate">
          {formatReais(valorTotal)}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span className={`font-semibold px-1.5 py-0.5 rounded text-[11px] ${t.valor.badge}`}>
            FNAS / MDS
          </span>
          <span className="text-[11px] text-slate-400">R$ 1.412/mês</span>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${t.valor.bar}`} />
      </div>
    </div>
  );
}
