import { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  MapPin, 
  TrendingUp, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import type { IndicadorItem, PaletaCores } from '../types/indicador.types';

interface IndicadoresChartsProps {
  indicadores: IndicadorItem[];
  paleta?: PaletaCores;
}

const DADOS_EVOLUCAO = [
  { mes: 'Nov/25', beneficiarios: 1390, valor: 1962680, idosos: 870, pcd: 520 },
  { mes: 'Dez/25', beneficiarios: 1415, valor: 1997980, idosos: 885, pcd: 530 },
  { mes: 'Jan/26', beneficiarios: 1430, valor: 2019160, idosos: 895, pcd: 535 },
  { mes: 'Fev/26', beneficiarios: 1450, valor: 2047400, idosos: 910, pcd: 540 },
  { mes: 'Mar/26', beneficiarios: 1472, valor: 2078464, idosos: 920, pcd: 552 },
  { mes: 'Abr/26', beneficiarios: 1485, valor: 2096820, idosos: 930, pcd: 555 },
  { mes: 'Mai/26', beneficiarios: 1492, valor: 2106704, idosos: 935, pcd: 557 },
  { mes: 'Jun/26', beneficiarios: 1500, valor: 2118000, idosos: 940, pcd: 560 },
  { mes: 'Jul/26', beneficiarios: 1508, valor: 2129296, idosos: 944, pcd: 564 },
  { mes: 'Ago/26', beneficiarios: 1512, valor: 2134944, idosos: 946, pcd: 566 },
  { mes: 'Set/26', beneficiarios: 1515, valor: 2139180, idosos: 948, pcd: 567 },
  { mes: 'Out/26', beneficiarios: 1520, valor: 2146240, idosos: 950, pcd: 570 },
];

const TOP_BAIRROS = [
  { nome: 'Ibura', rpa: 'RPA 6', total: 142, pct: 9.3 },
  { nome: 'Santo Amaro', rpa: 'RPA 1', total: 128, pct: 8.4 },
  { nome: 'Casa Amarela', rpa: 'RPA 3', total: 115, pct: 7.6 },
  { nome: 'Várzea', rpa: 'RPA 4', total: 98, pct: 6.4 },
  { nome: 'Afogados', rpa: 'RPA 5', total: 84, pct: 5.5 },
  { nome: 'Nova Descoberta', rpa: 'RPA 3', total: 76, pct: 5.0 },
  { nome: 'Cohab', rpa: 'RPA 6', total: 72, pct: 4.7 },
  { nome: 'Boa Viagem', rpa: 'RPA 6', total: 64, pct: 4.2 },
];

export function IndicadoresCharts({ indicadores, paleta = 'civica' }: IndicadoresChartsProps) {
  const [metricType, setMetricType] = useState<'beneficiarios' | 'valor'>('beneficiarios');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const getValor = (busca: string, fallback: number) => {
    const item = indicadores.find((i) => i.nome.toLowerCase().includes(busca.toLowerCase()));
    if (!item || item.valor === undefined || item.valor === null) return fallback;
    const n = Number(item.valor);
    return isNaN(n) ? fallback : n;
  };

  const totalGeral = getValor('total', 1520);
  const totalIdosos = getValor('idosos', 950);
  const totalPcd = getValor('deficiência', 570);

  const maxVal = metricType === 'beneficiarios' ? 1600 : 2300000;
  const minVal = metricType === 'beneficiarios' ? 1200 : 1800000;

  // Definições visuais dependentes da paleta
  const configTema = {
    padrao: {
      barIdoso: 'bg-amber-500',
      barPcd: 'bg-purple-500',
      barFinanceiro: 'bg-gradient-to-t from-blue-700 to-teal-500',
      donutStrokeIdoso: '#F59E0B',
      donutStrokePcd: '#A855F7',
      dotIdoso: 'bg-amber-500',
      dotPcd: 'bg-purple-500',
      rpaCores: ['bg-blue-600', 'bg-emerald-600', 'bg-indigo-600', 'bg-amber-600', 'bg-teal-600', 'bg-purple-600'],
      primaryText: 'text-blue-600',
      primaryBg: 'bg-blue-50',
    },
    civica: {
      barIdoso: 'bg-amber-500',
      barPcd: 'bg-orange-600',
      barFinanceiro: 'bg-gradient-to-t from-blue-900 to-cyan-600',
      donutStrokeIdoso: '#D97706',
      donutStrokePcd: '#EA580C',
      dotIdoso: 'bg-amber-500',
      dotPcd: 'bg-orange-600',
      rpaCores: ['bg-blue-800', 'bg-amber-600', 'bg-orange-600', 'bg-emerald-600', 'bg-cyan-700', 'bg-indigo-700'],
      primaryText: 'text-blue-800',
      primaryBg: 'bg-blue-50',
    },
    esmeralda: {
      barIdoso: 'bg-amber-600',
      barPcd: 'bg-indigo-600',
      barFinanceiro: 'bg-gradient-to-t from-emerald-800 to-teal-500',
      donutStrokeIdoso: '#059669',
      donutStrokePcd: '#4F46E5',
      dotIdoso: 'bg-emerald-600',
      dotPcd: 'bg-indigo-600',
      rpaCores: ['bg-emerald-700', 'bg-teal-600', 'bg-indigo-600', 'bg-amber-600', 'bg-emerald-600', 'bg-cyan-600'],
      primaryText: 'text-emerald-700',
      primaryBg: 'bg-emerald-50',
    },
    executivo: {
      barIdoso: 'bg-yellow-500',
      barPcd: 'bg-fuchsia-600',
      barFinanceiro: 'bg-gradient-to-t from-indigo-800 to-violet-500',
      donutStrokeIdoso: '#EAB308',
      donutStrokePcd: '#C026D3',
      dotIdoso: 'bg-yellow-500',
      dotPcd: 'bg-fuchsia-600',
      rpaCores: ['bg-indigo-600', 'bg-fuchsia-600', 'bg-cyan-600', 'bg-violet-600', 'bg-rose-600', 'bg-blue-600'],
      primaryText: 'text-indigo-600',
      primaryBg: 'bg-indigo-50',
    },
  }[paleta] || {
    barIdoso: 'bg-amber-500',
    barPcd: 'bg-orange-600',
    barFinanceiro: 'bg-gradient-to-t from-blue-900 to-cyan-600',
    donutStrokeIdoso: '#D97706',
    donutStrokePcd: '#EA580C',
    dotIdoso: 'bg-amber-500',
    dotPcd: 'bg-orange-600',
    rpaCores: ['bg-blue-800', 'bg-amber-600', 'bg-orange-600', 'bg-emerald-600', 'bg-cyan-700', 'bg-indigo-700'],
    primaryText: 'text-blue-800',
    primaryBg: 'bg-blue-50',
  };

  const DADOS_RPA = [
    { rpa: 'RPA 3', nome: 'Noroeste (Casa Amarela, Nova Descoberta)', total: 340, pct: 22.4, cor: configTema.rpaCores[0] },
    { rpa: 'RPA 6', nome: 'Sul (Ibura, Boa Viagem, Jordão, Pina)', total: 295, pct: 19.4, cor: configTema.rpaCores[1] },
    { rpa: 'RPA 4', nome: 'Oeste (Várzea, Caxangá, Iputinga)', total: 275, pct: 18.1, cor: configTema.rpaCores[2] },
    { rpa: 'RPA 2', nome: 'Norte (Arruda, Encruzilhada, Campina)', total: 225, pct: 14.8, cor: configTema.rpaCores[3] },
    { rpa: 'RPA 5', nome: 'Sudoeste (Afogados, San Martin, Areias)', total: 205, pct: 13.5, cor: configTema.rpaCores[4] },
    { rpa: 'RPA 1', nome: 'Centro (Santo Amaro, Coelhos, Ilha do Leite)', total: 180, pct: 11.8, cor: configTema.rpaCores[5] },
  ];

  return (
    <div className="space-y-6">
      {/* SEÇÃO 1: EVOLUÇÃO TEMPORAL + PERFIL IDOSO VS PCD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRÁFICO 1: EVOLUÇÃO MENSAL */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 ${configTema.primaryBg} ${configTema.primaryText} rounded-lg`}>
                    <BarChart3 className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-bold text-slate-800">
                    Evolução Histórica do BPC Recife
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Acompanhamento mês a mês das concessões e repasses no município
                </p>
              </div>

              {/* Botões de alternância de métrica */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMetricType('beneficiarios')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    metricType === 'beneficiarios'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Beneficiários
                </button>
                <button
                  type="button"
                  onClick={() => setMetricType('valor')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    metricType === 'valor'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Repasse Financeiro (R$)
                </button>
              </div>
            </div>

            {/* Visualização em SVG Interativo do Gráfico de Barras */}
            <div className="pt-6 pb-2">
              <div className="h-60 w-full flex items-end justify-between gap-2 px-2 relative">
                {/* Linhas de grade de fundo */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                  <div className="border-b border-dashed border-slate-200 w-full" />
                  <div className="border-b border-dashed border-slate-200 w-full" />
                  <div className="border-b border-dashed border-slate-200 w-full" />
                  <div className="border-b border-dashed border-slate-200 w-full" />
                </div>

                {DADOS_EVOLUCAO.map((d, index) => {
                  const valorAtual = metricType === 'beneficiarios' ? d.beneficiarios : d.valor;
                  const pctHeight = Math.max(15, Math.min(100, ((valorAtual - minVal) / (maxVal - minVal)) * 100));
                  const isHovered = hoveredMonth === index;

                  return (
                    <div
                      key={d.mes}
                      className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                      onMouseEnter={() => setHoveredMonth(index)}
                      onMouseLeave={() => setHoveredMonth(null)}
                    >
                      {/* Tooltip flutuante */}
                      {isHovered && (
                        <div className="absolute -top-14 z-20 bg-slate-900 text-white text-[11px] py-1.5 px-2.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none transition-all">
                          <p className="font-bold text-amber-300">{d.mes}</p>
                          <p>
                            {metricType === 'beneficiarios'
                              ? `${d.beneficiarios.toLocaleString('pt-BR')} beneficiários`
                              : `R$ ${d.valor.toLocaleString('pt-BR')}`}
                          </p>
                          <div className="text-[10px] text-slate-300 flex gap-2 mt-0.5">
                            <span>Idosos: {d.idosos}</span>
                            <span>PCD: {d.pcd}</span>
                          </div>
                        </div>
                      )}

                      {/* Barra do Gráfico */}
                      <div
                        className="w-full max-w-[32px] rounded-t-lg transition-all duration-300 relative overflow-hidden flex flex-col justify-end"
                        style={{ height: `${pctHeight}%` }}
                      >
                        {metricType === 'beneficiarios' ? (
                          <>
                            <div 
                              className={`w-full ${configTema.barPcd} transition-opacity ${isHovered ? 'opacity-100' : 'opacity-85'}`} 
                              style={{ height: `${(d.pcd / d.beneficiarios) * 100}%` }}
                              title={`PCD: ${d.pcd}`}
                            />
                            <div 
                              className={`w-full ${configTema.barIdoso} transition-opacity ${isHovered ? 'opacity-100' : 'opacity-90'}`} 
                              style={{ height: `${(d.idosos / d.beneficiarios) * 100}%` }}
                              title={`Idosos: ${d.idosos}`}
                            />
                          </>
                        ) : (
                          <div 
                            className={`w-full h-full ${configTema.barFinanceiro} transition-all ${
                              isHovered ? 'brightness-110 shadow-md' : 'opacity-90'
                            }`}
                          />
                        )}
                      </div>

                      <span className="text-[10px] font-medium text-slate-500 mt-2 truncate w-full text-center">
                        {d.mes.split('/')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legenda e Métricas de Apoio */}
          <div className="pt-4 mt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              {metricType === 'beneficiarios' ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3 h-3 rounded-full ${configTema.dotIdoso} inline-block`} />
                    <span className="text-slate-600 font-medium">BPC Idoso</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3 h-3 rounded-full ${configTema.dotPcd} inline-block`} />
                    <span className="text-slate-600 font-medium">BPC Deficiência (PCD)</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-cyan-600 inline-block" />
                  <span className="text-slate-600 font-medium">Repasse Mensal FNAS (R$)</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Crescimento médio: <strong className="text-slate-800">+9.3% ao ano</strong></span>
            </div>
          </div>
        </div>

        {/* GRÁFICO 2: PERFIL DOS BENEFICIÁRIOS (DONUT CHART) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 ${configTema.primaryBg} ${configTema.primaryText} rounded-lg`}>
                  <PieChart className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-800">
                  Perfil de Concessão
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                100% Auditado
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Proporção de beneficiários idosos vs pessoas com deficiência
            </p>

            {/* Donut SVG Personalizado com Cores Dinâmicas */}
            <div className="relative py-6 flex items-center justify-center">
              <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-slate-100"
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Segmento Idoso */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke={configTema.donutStrokeIdoso}
                  strokeWidth="12"
                  strokeDasharray="149 239"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500"
                />
                {/* Segmento PCD */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke={configTema.donutStrokePcd}
                  strokeWidth="12"
                  strokeDasharray="89.5 239"
                  strokeDashoffset="-150"
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-800">
                  {totalGeral.toLocaleString('pt-BR')}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Beneficiários
                </span>
              </div>
            </div>

            {/* Detalhes de Composição */}
            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3.5 h-3.5 rounded-full ${configTema.dotIdoso}`} />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Idosos (≥ 65 anos)</p>
                    <p className="text-[11px] text-slate-500">Critério de idade e renda</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-800">{totalIdosos.toLocaleString('pt-BR')}</span>
                  <span className="block text-[11px] font-semibold text-slate-600">62.5%</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3.5 h-3.5 rounded-full ${configTema.dotPcd}`} />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Pessoas com Deficiência</p>
                    <p className="text-[11px] text-slate-500">Perícia médica e social</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-800">{totalPcd.toLocaleString('pt-BR')}</span>
                  <span className="block text-[11px] font-semibold text-slate-600">37.5%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-500 text-center">
            Critério: Renda familiar per capita ≤ 1/4 do salário mínimo
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: DISTRIBUIÇÃO POR RPAS DO RECIFE + RANKING DE BAIRROS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRÁFICO 3: DISTRIBUIÇÃO POR REGIÃO (RPAS DO RECIFE) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className={`p-1.5 ${configTema.primaryBg} ${configTema.primaryText} rounded-lg`}>
                <Building2 className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Distribuição por Regiões (RPAs de Recife)
                </h3>
                <p className="text-xs text-slate-500">
                  Descentralização do BPC nas 6 Regiões Político-Administrativas
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {DADOS_RPA.map((rpa) => (
              <div key={rpa.rpa} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {rpa.rpa}
                    </span>
                    <span className="text-slate-600 font-medium truncate max-w-[220px] sm:max-w-none">
                      {rpa.nome}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{rpa.total}</span>
                    <span className="text-[11px] text-slate-500 font-medium">({rpa.pct}%)</span>
                  </div>
                </div>

                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className={`${rpa.cor} rounded-full transition-all duration-500`}
                    style={{ width: `${rpa.pct * 3.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Cobertura presente em todas as 6 RPAs do Recife
            </span>
            <span className="font-semibold text-slate-700">100% mapeado</span>
          </div>
        </div>

        {/* GRÁFICO 4: BAIRROS COM MAIOR CONCENTRAÇÃO */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                <MapPin className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Concentração por Bairros de Recife
                </h3>
                <p className="text-xs text-slate-500">
                  Bairros com maior número de concessões ativas do BPC
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              Top 8 Bairros
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TOP_BAIRROS.map((bairro, idx) => (
              <div
                key={bairro.nome}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{bairro.nome}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{bairro.rpa}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">{bairro.total} ben.</p>
                  <p className="text-[10px] text-slate-500">{bairro.pct}% total</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Mais de 94 bairros cadastrados no sistema</span>
            <span className="text-slate-600 font-semibold">
              Recife • PE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
