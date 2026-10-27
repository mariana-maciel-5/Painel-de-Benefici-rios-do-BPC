import { 
  Search, 
  Plus, 
  RefreshCw, 
  TrendingUp, 
  Layers, 
  Trash2, 
  Sparkles,
  Info
} from 'lucide-react';
import type { IndicadorItem } from '../types/indicador.types';

interface IndicadoresTableProps {
  indicadores: IndicadorItem[];
  totalCount: number;
  loading: boolean;
  sincronizando: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onRefresh: () => void;
  onOpenNovoModal: () => void;
  onSincronizar: () => void;
  onExcluir: (id: number) => void;
}

export function IndicadoresTable({
  indicadores,
  totalCount,
  loading,
  sincronizando,
  searchTerm,
  setSearchTerm,
  onRefresh,
  onOpenNovoModal,
  onSincronizar,
  onExcluir,
}: IndicadoresTableProps) {
  const formatNumber = (val?: number | string) => {
    if (val === undefined || val === null || val === '') return '-';
    const num = Number(val);
    if (isNaN(num)) return String(val);
    return num.toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-5">
      {/* Box de Notificação da Estrutura Genérica */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-700">
          <p className="font-bold text-blue-900">
            Estrutura Oficial da Entidade Indicadores (Tabela Genérica)
          </p>
          <p className="text-slate-600">
            Cada linha desta tabela é um indicador específico (ex: <em>Total de beneficiários do BPC</em>, <em>Número de idosos</em>, <em>Número de pessoas com deficiência</em>).
            As colunas do banco seguem o modelo formal: <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-blue-800">id</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-blue-800">nome</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-blue-800">descricao</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-blue-800">unidade</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-blue-800">fonte</code> e <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-blue-800">painelId</code>.
          </p>
        </div>
      </div>

      {/* Barra de Ações: Busca, Sincronização e Cadastro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, unidade ou fonte do indicador..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSincronizar}
            disabled={sincronizando}
            className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Atualiza os valores dos indicadores a partir das concessões reais da base de beneficiários"
          >
            <Sparkles className={`w-3.5 h-3.5 ${sincronizando ? 'animate-spin' : ''}`} />
            {sincronizando ? 'Sincronizando...' : 'Sincronizar da Base'}
          </button>

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
            <Plus className="w-4 h-4" /> Novo Indicador
          </button>
        </div>
      </div>

      {/* Tabela de Indicadores Genéricos */}
      {indicadores.length > 0 ? (
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">Nome do Indicador</th>
                <th className="px-5 py-3.5">Descrição</th>
                <th className="px-5 py-3.5">Unidade</th>
                <th className="px-5 py-3.5">Fonte dos Dados</th>
                <th className="px-5 py-3.5">Painel (FK)</th>
                <th className="px-5 py-3.5 text-right">Valor Atual</th>
                <th className="px-5 py-3.5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              {indicadores.map((ind) => (
                <tr key={ind.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* ID */}
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500">
                    #{ind.id}
                  </td>

                  {/* Nome do Indicador */}
                  <td className="px-5 py-3.5 font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      <span>{ind.nome}</span>
                    </div>
                  </td>

                  {/* Descrição */}
                  <td className="px-5 py-3.5 text-xs text-slate-500 max-w-xs">
                    {ind.descricao || '—'}
                  </td>

                  {/* Unidade */}
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {ind.unidade}
                    </span>
                  </td>

                  {/* Fonte */}
                  <td className="px-5 py-3.5 text-xs text-slate-600 max-w-sm truncate" title={ind.fonte}>
                    {ind.fonte}
                  </td>

                  {/* PainelId */}
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                      <Layers className="w-3 h-3" /> painelId: {ind.painelId}
                    </span>
                  </td>

                  {/* Valor Atual */}
                  <td className="px-5 py-3.5 text-right">
                    <span className="font-mono font-extrabold text-sm text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      {formatNumber(ind.valor)}
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => {
                        if (confirm(`Deseja excluir o indicador "${ind.nome}"?`)) {
                          onExcluir(ind.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Excluir Indicador"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <TrendingUp className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Nenhum indicador encontrado.</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Cadastre novos registros na tabela de indicadores genéricos da Assistência Social.
          </p>
          <button
            onClick={onOpenNovoModal}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Cadastrar Primeiro Indicador
          </button>
        </div>
      )}
    </div>
  );
}
