import { useState, type FormEvent } from 'react';
import { X, Plus, Hash, Tag, FileText, Link, Layers } from 'lucide-react';
import type { NovoIndicadorPayload, PainelItem } from '../types/indicador.types';

interface NovoIndicadorModalProps {
  isOpen: boolean;
  paineis: PainelItem[];
  onClose: () => void;
  onSubmit: (payload: NovoIndicadorPayload) => Promise<any>;
}

export function NovoIndicadorModal({
  isOpen,
  paineis,
  onClose,
  onSubmit,
}: NovoIndicadorModalProps) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [unidade, setUnidade] = useState('beneficiários');
  const [fonte, setFonte] = useState('Secretaria de Assistência Social do Recife - SAS');
  const [painelId, setPainelId] = useState(paineis[0]?.id || 1);
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !unidade.trim() || !fonte.trim()) {
      setError('Preencha os campos obrigatórios: Nome, Unidade e Fonte.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
        unidade: unidade.trim(),
        fonte: fonte.trim(),
        painelId: Number(painelId),
        valor: valor ? parseFloat(valor) : undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar indicador.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Novo Registro de Indicador</h3>
            <p className="text-xs text-slate-500">Cadastre um indicador genérico na tabela do banco de dados</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Nome do Indicador (até 160 caracteres) *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                maxLength={160}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Total de beneficiários do BPC"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <Tag className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Descrição (até 255 caracteres, opcional)
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={255}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Quantidade total de beneficiários atendidos no Recife"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <FileText className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Unidade de Medida (até 60) *
              </label>
              <input
                type="text"
                required
                maxLength={60}
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                placeholder="Ex: beneficiários, idosos, PCDs"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Painel Vinculado (FK: painelId) *
              </label>
              <div className="relative">
                <select
                  value={painelId}
                  onChange={(e) => setPainelId(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  {paineis.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.nome}
                    </option>
                  ))}
                  {paineis.length === 0 && <option value={1}>1 - Painel Geral BPC</option>}
                </select>
                <Layers className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Fonte do Indicador (até 255) *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                maxLength={255}
                value={fonte}
                onChange={(e) => setFonte(e.target.value)}
                placeholder="Ex: Ministério do Desenvolvimento Social - https://..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <Link className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Valor Atual Apurado (opcional)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ex: 1520"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <Hash className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {loading ? 'Salvando...' : 'Salvar Indicador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
