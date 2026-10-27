import { useState } from 'react';
import { 
  Search, 
  Plus, 
  RefreshCw, 
  HeartHandshake, 
  Calendar, 
  DollarSign, 
  ToggleLeft, 
  ToggleRight,
  Filter
} from 'lucide-react';
import type { BeneficiarioItem } from '../types/beneficiario.types';
import { formatDate } from '../../../utils/formatters';

interface BeneficiarioListTableProps {
  beneficiarios: BeneficiarioItem[];
  allCount: number;
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: 'todos' | 'ativos' | 'inativos';
  setStatusFilter: (filter: 'todos' | 'ativos' | 'inativos') => void;
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
  statusFilter,
  setStatusFilter,
  onRefresh,
  onToggleStatus,
  onOpenNovoModal,
}: BeneficiarioListTableProps) {
  const formatCurrency = (val: number | string) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  return (
    <div className="space-y-4">
      {/* Barra de Ações e Filtros */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, CPF ou bairro..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setStatusFilter('todos')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'todos' ? 'bg-blue-600 text-white shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({allCount})
            </button>
            <button
              onClick={() => setStatusFilter('ativos')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'ativos' ? 'bg-blue-600 text-white shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ativos
            </button>
            <button
              onClick={() => setStatusFilter('inativos')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'inativos' ? 'bg-blue-600 text-white shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inativos
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Atualizar lista"
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onOpenNovoModal}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Novo Beneficiário
          </button>
        </div>
      </div>

      {/* Tabela de Beneficiários */}
      {beneficiarios.length > 0 ? (
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Nome do Usuário</th>
                <th className="px-5 py-3.5">Valor do Benefício</th>
                <th className="px-5 py-3.5">Data de Concessão</th>
                <th className="px-5 py-3.5">Status do Benefício</th>
                <th className="px-5 py-3.5">Tipo / Modalidade</th>
                <th className="px-5 py-3.5">Bairro / Localidade</th>
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

                    {/* Valor do Benefício */}
                    <td className="px-5 py-3.5">
                      <div className="inline-flex items-center gap-1 font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                        <span className="text-emerald-600 font-extrabold text-xs">R$</span>
                        <span>{Number(b.valor_beneficio || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </td>

                    {/* Data de Concessão */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(b.data_concessao)}</span>
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
                        {isAtivo ? 'Ativo / Regular' : 'Inativo / Suspenso'}
                      </span>
                    </td>

                    {/* Tipo / Modalidade */}
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                        {b.tipo_beneficio || 'Idoso'}
                      </span>
                    </td>

                    {/* Bairro */}
                    <td className="px-5 py-3.5 text-xs text-slate-500">
                      {b.bairro || 'Recife - PE'}
                    </td>

                    {/* Ação: Alternar Status */}
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onToggleStatus(b.id)}
                        title={isAtivo ? 'Suspender/Inativar Benefício' : 'Reativar Benefício'}
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
          <p className="text-sm font-semibold text-slate-700">Nenhum beneficiário encontrado.</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? 'Tente ajustar os termos de pesquisa ou remover os filtros aplicados.'
              : 'Clique em "Novo Beneficiário" para cadastrar o primeiro registro na base de dados.'}
          </p>
          <button
            onClick={onOpenNovoModal}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Cadastrar Beneficiário
          </button>
        </div>
      )}
    </div>
  );
}
