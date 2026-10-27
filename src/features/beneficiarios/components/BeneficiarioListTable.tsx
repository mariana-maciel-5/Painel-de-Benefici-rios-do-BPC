import { 
  Search, 
  Plus, 
  RefreshCw, 
  HeartHandshake, 
  Calendar, 
  ToggleLeft, 
  ToggleRight,
  MapPin,
  Filter,
  X
} from 'lucide-react';
import type { BeneficiarioItem } from '../types/beneficiario.types';
import { formatDate } from '../../../utils/formatters';

interface BeneficiarioListTableProps {
  beneficiarios: BeneficiarioItem[];
  allCount: number;
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  bairroFilter: string;
  setBairroFilter: (bairro: string) => void;
  dataInicioFilter: string;
  setDataInicioFilter: (date: string) => void;
  dataFimFilter: string;
  setDataFimFilter: (date: string) => void;
  statusFilter: 'todos' | 'ativos' | 'inativos';
  setStatusFilter: (filter: 'todos' | 'ativos' | 'inativos') => void;
  bairrosDisponiveis: string[];
  temFiltrosAtivos: boolean;
  onLimparFiltros: () => void;
  onRefresh: () => void;
  onToggleStatus: (id: number) => void;
  onOpenNovoModal: () => void;
}

export function BeneficiarioListTable({
  beneficiarios,
  allCount,
  loading,
  searchTerm,
  setSearchTerm,
  bairroFilter,
  setBairroFilter,
  dataInicioFilter,
  setDataInicioFilter,
  dataFimFilter,
  setDataFimFilter,
  statusFilter,
  setStatusFilter,
  bairrosDisponiveis,
  temFiltrosAtivos,
  onLimparFiltros,
  onRefresh,
  onToggleStatus,
  onOpenNovoModal,
}: BeneficiarioListTableProps) {
  return (
    <div className="space-y-4">
      {/* Bloco Superior: Busca Geral e Ações Rápidas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, CPF, NIS ou RPA..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {temFiltrosAtivos && (
            <button
              onClick={onLimparFiltros}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-red-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Limpar Filtros
            </button>
          )}

          <button
            onClick={onRefresh}
            disabled={loading}
            title="Atualizar lista"
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onOpenNovoModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Novo Beneficiário
          </button>
        </div>
      </div>

      {/* Painel de Filtros Específicos: Bairro, Período e Situação */}
      <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span>Filtros por Bairro e Período de Concessão:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Filtro de Bairro */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-600" /> Bairro do Recife
            </label>
            <select
              value={bairroFilter}
              onChange={(e) => setBairroFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos os Bairros ({bairrosDisponiveis.length})</option>
              {bairrosDisponiveis.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Filtro de Período - Data Inicial */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-indigo-600" /> Concessão De:
            </label>
            <input
              type="date"
              value={dataInicioFilter}
              onChange={(e) => setDataInicioFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 3. Filtro de Período - Data Final */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-indigo-600" /> Concessão Até:
            </label>
            <input
              type="date"
              value={dataFimFilter}
              onChange={(e) => setDataFimFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 4. Filtro de Situação */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Situação Cadastral
            </label>
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 text-xs h-[34px]">
              <button
                onClick={() => setStatusFilter('todos')}
                className={`flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                  statusFilter === 'todos' ? 'bg-blue-600 text-white font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setStatusFilter('ativos')}
                className={`flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                  statusFilter === 'ativos' ? 'bg-blue-600 text-white font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ativos
              </button>
              <button
                onClick={() => setStatusFilter('inativos')}
                className={`flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                  statusFilter === 'inativos' ? 'bg-blue-600 text-white font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Inativos
              </button>
            </div>
          </div>
        </div>

        {/* Resumo de Registros Encontrados */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
          <span>
            Exibindo <strong>{beneficiarios.length}</strong> de <strong>{allCount}</strong> beneficiários cadastrados
            {bairroFilter !== 'todos' && ` • Bairro: ${bairroFilter}`}
            {(dataInicioFilter || dataFimFilter) &&
              ` • Período: ${dataInicioFilter ? formatDate(dataInicioFilter) : 'Início'} até ${dataFimFilter ? formatDate(dataFimFilter) : 'Hoje'}`}
          </span>
          {temFiltrosAtivos && (
            <span className="text-blue-700 font-semibold">Filtros aplicados</span>
          )}
        </div>
      </div>

      {/* Tabela de Beneficiários com Bairro e Períodos */}
      {beneficiarios.length > 0 ? (
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Nome do Usuário</th>
                <th className="px-5 py-3.5">Bairro / Região (RPA)</th>
                <th className="px-5 py-3.5">Data de Concessão</th>
                <th className="px-5 py-3.5">Valor do Benefício</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Modalidade</th>
                <th className="px-5 py-3.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              {beneficiarios.map((b) => {
                const isAtivo = Boolean(b.ativo);
                return (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Nome do Usuário */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {b.nome ? b.nome.split(' ').map((n) => n[0]).slice(0, 2).join('') : 'BP'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{b.nome}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            {b.cpf && <span>CPF: {b.cpf}</span>}
                            {b.nis && <span>• NIS: {b.nis}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Bairro e RPA */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-800 text-xs">{b.bairro || 'Recife'}</p>
                          {b.rpa && (
                            <span className="text-[10px] text-slate-400 font-medium">{b.rpa}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Data de Concessão e Período */}
                    <td className="px-5 py-3.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{formatDate(b.data_concessao)}</span>
                        </div>
                        {b.data_solicitacao && (
                          <p className="text-[10px] text-slate-400">
                            Req: {formatDate(b.data_solicitacao)}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Valor do Benefício */}
                    <td className="px-5 py-3.5">
                      <div className="inline-flex items-center gap-1 font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                        <span className="text-emerald-600 font-extrabold text-xs">R$</span>
                        <span>{Number(b.valor_beneficio || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </td>

                    {/* Status do Benefício */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          isAtivo
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isAtivo ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        {isAtivo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    {/* Modalidade */}
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                        {b.tipo_beneficio || 'Idoso'}
                      </span>
                    </td>

                    {/* Alternar Status */}
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onToggleStatus(b.id)}
                        title={isAtivo ? 'Suspender/Inativar' : 'Reativar'}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          isAtivo
                            ? 'text-amber-700 border-amber-200 bg-amber-50/50 hover:bg-amber-100'
                            : 'text-emerald-700 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100'
                        }`}
                      >
                        {isAtivo ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-emerald-600" /> Inativar
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-amber-600" /> Reativar
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <HeartHandshake className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Nenhum beneficiário encontrado para este filtro.</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Não há registros que correspondam ao bairro e período selecionados.
          </p>
          {temFiltrosAtivos && (
            <button
              onClick={onLimparFiltros}
              className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Limpar Filtros Aplicados
            </button>
          )}
        </div>
      )}
    </div>
  );
}
