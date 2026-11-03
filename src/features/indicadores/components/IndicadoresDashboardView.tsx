import { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Table2, 
  RefreshCw, 
  Calendar, 
  Layers,
  Plus,
  ShieldCheck,
  Building2,
  Filter
} from 'lucide-react';
import type { IndicadorItem, PainelItem, NovoIndicadorPayload } from '../types/indicador.types';
import { IndicadoresKpiCards } from './IndicadoresKpiCards';
import { IndicadoresCharts } from './IndicadoresCharts';
import { IndicadoresTable } from './IndicadoresTable';
import { NovoIndicadorModal } from './NovoIndicadorModal';

interface IndicadoresDashboardViewProps {
  indicadores: IndicadorItem[];
  totalCount: number;
  paineis: PainelItem[];
  loading: boolean;
  sincronizando: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onRefresh: () => void;
  onSincronizar: () => void;
  onCadastrar: (payload: NovoIndicadorPayload) => Promise<any>;
  onExcluir: (id: number) => void;
}

export function IndicadoresDashboardView({
  indicadores,
  totalCount,
  paineis,
  loading,
  sincronizando,
  searchTerm,
  setSearchTerm,
  onRefresh,
  onSincronizar,
  onCadastrar,
  onExcluir,
}: IndicadoresDashboardViewProps) {
  const [viewMode, setViewMode] = useState<'dashboard' | 'tabela'>('dashboard');
  const [periodo, setPeriodo] = useState<string>('2026');
  const [painelSelecionado, setPainelSelecionado] = useState<string>('todos');
  const [isNovoModalOpen, setIsNovoModalOpen] = useState<boolean>(false);

  // Identidade definitiva fixada: Cívica Recife
  const paletaDefinitiva = 'civica' as const;

  // Filtragem por painel caso o usuário selecione um painel específico
  const indicadoresExibidos = painelSelecionado === 'todos'
    ? indicadores
    : indicadores.filter((ind) => ind.painelId === Number(painelSelecionado));

  const painelAtivoObj = paineis.find((p) => p.id === Number(painelSelecionado));

  return (
    <div className="space-y-6">
      {/* HEADER DA TELA DE INDICADORES BPC COM A IDENTIDADE DEFINITIVA CÍVICA RECIFE */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-blue-900 text-amber-400 rounded-xl shadow-xs border border-blue-800">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">
                  Painel de Indicadores do BPC Recife
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Identidade Cívica Recife
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {painelAtivoObj ? (
                  <span>
                    Filtro ativo: <strong className="text-blue-900 font-semibold">{painelAtivoObj.nome}</strong> — {painelAtivoObj.descricao}
                  </span>
                ) : (
                  'Monitoramento Central da Assistência Social • 5 Painéis Temáticos Ativos'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* CONTROLES E BOTÕES */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Seletor de Painéis Temáticos Fictícios */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <select
              value={painelSelecionado}
              onChange={(e) => setPainelSelecionado(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-blue-900 focus:outline-hidden cursor-pointer"
            >
              <option value="todos">Todos os Painéis ({paineis.length})</option>
              {paineis.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.id} • {p.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Seletor de Período */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="2026">Exercício 2026 (Atual)</option>
              <option value="2025">Exercício 2025</option>
              <option value="12meses">Últimos 12 meses</option>
              <option value="todos">Série Histórica Completa</option>
            </select>
          </div>

          {/* Alternador de Modo de Visualização */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'dashboard'
                  ? 'bg-blue-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Cards & Gráficos
            </button>
            <button
              type="button"
              onClick={() => setViewMode('tabela')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'tabela'
                  ? 'bg-blue-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              Tabela do Banco ({indicadoresExibidos.length})
            </button>
          </div>

          {/* Botão de Sincronizar com Beneficiários */}
          <button
            type="button"
            onClick={onSincronizar}
            disabled={sincronizando}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all shadow-xs disabled:opacity-60 cursor-pointer"
            title="Recalcula e sincroniza indicadores a partir dos dados do banco"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-800 ${sincronizando ? 'animate-spin' : ''}`} />
            {sincronizando ? 'Sincronizando...' : 'Sincronizar'}
          </button>

          {/* Botão para Novo Indicador */}
          {viewMode === 'tabela' && (
            <button
              type="button"
              onClick={() => setIsNovoModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Novo Indicador
            </button>
          )}
        </div>
      </div>

      {/* TABS RÁPIDAS DOS PAINÉIS POVOADOS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setPainelSelecionado('todos')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
            painelSelecionado === 'todos'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
          }`}
        >
          Visão Geral Consolidada ({indicadores.length} indicadores)
        </button>
        {paineis.map((p) => {
          const isSelected = painelSelecionado === String(p.id);
          const totalPainel = indicadores.filter((i) => i.painelId === p.id).length;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPainelSelecionado(String(p.id))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
              }`}
            >
              <span>{p.nome}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-amber-400 text-blue-950 font-bold' : 'bg-slate-100 text-slate-500'}`}>
                {totalPainel}
              </span>
            </button>
          );
        })}
      </div>

      {/* CONTEÚDO PRINCIPAL: CARDS E GRÁFICOS (COM A PALETA DEFINITIVA CÍVICA RECIFE) */}
      {viewMode === 'dashboard' && (
        <div className="space-y-6">
          <IndicadoresKpiCards indicadores={indicadoresExibidos} paleta={paletaDefinitiva} />
          <IndicadoresCharts indicadores={indicadoresExibidos} paleta={paletaDefinitiva} />
        </div>
      )}

      {/* CONTEÚDO ALTERNATIVO: TABELA DO BANCO COM NOMES DOS PAINÉIS */}
      {viewMode === 'tabela' && (
        <div className="space-y-6">
          <IndicadoresTable
            indicadores={indicadoresExibidos}
            totalCount={indicadoresExibidos.length}
            paineis={paineis}
            loading={loading}
            sincronizando={sincronizando}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onRefresh={onRefresh}
            onOpenNovoModal={() => setIsNovoModalOpen(true)}
            onSincronizar={onSincronizar}
            onExcluir={onExcluir}
          />
        </div>
      )}

      {/* MODAL DE NOVO INDICADOR */}
      <NovoIndicadorModal
        isOpen={isNovoModalOpen}
        paineis={paineis}
        onClose={() => setIsNovoModalOpen(false)}
        onSubmit={onCadastrar}
      />
    </div>
  );
}
