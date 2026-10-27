import { useState, type FormEvent } from 'react';
import { X, Plus, Calendar, DollarSign, User, MapPin } from 'lucide-react';
import type { NovoBeneficiarioPayload } from '../types/beneficiario.types';
import { BAIRROS_RECIFE_PADRAO } from '../hooks/useBeneficiarios';

interface BeneficiarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: NovoBeneficiarioPayload) => Promise<any>;
}

const RPA_MAP: Record<string, string> = {
  'Santo Amaro': 'RPA 1',
  'Boa Vista': 'RPA 1',
  'Arruda': 'RPA 2',
  'Casa Amarela': 'RPA 3',
  'Madalena': 'RPA 4',
  'Torre': 'RPA 4',
  'Cordeiro': 'RPA 4',
  'Várzea': 'RPA 4',
  'Afogados': 'RPA 5',
  'San Martin': 'RPA 5',
  'Tejipió': 'RPA 5',
  'Boa Viagem': 'RPA 6',
  'Pina': 'RPA 6',
  'Ibura': 'RPA 6',
};

export function BeneficiarioModal({ isOpen, onClose, onSubmit }: BeneficiarioModalProps) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [nis, setNis] = useState('');
  const [valorBeneficio, setValorBeneficio] = useState('1412.00');
  const [dataConcessao, setDataConcessao] = useState(new Date().toISOString().split('T')[0]);
  const [dataSolicitacao, setDataSolicitacao] = useState('');
  const [tipoBeneficio, setTipoBeneficio] = useState('Idoso (65+ anos)');
  const [bairro, setBairro] = useState('Casa Amarela');
  const [ativo, setAtivo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setError('O nome do beneficiário é obrigatório.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        nome: nome.trim(),
        cpf: cpf.trim() || undefined,
        nis: nis.trim() || undefined,
        valor_beneficio: parseFloat(valorBeneficio) || 1412.0,
        data_concessao: dataConcessao,
        data_solicitacao: dataSolicitacao || undefined,
        ativo,
        tipo_beneficio: tipoBeneficio,
        bairro: bairro.trim(),
        rpa: RPA_MAP[bairro] || 'RPA Recife',
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar beneficiário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Novo Beneficiário BPC</h3>
            <p className="text-xs text-slate-500">Cadastre a concessão com dados de localização e período</p>
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
              Nome do Usuário Beneficiário *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Severino Ramos da Silva"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <User className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                CPF (opcional)
              </label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                NIS / CadÚnico
              </label>
              <input
                type="text"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                placeholder="00000000000"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Bairro do Recife *
              </label>
              <div className="relative">
                <select
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  {BAIRROS_RECIFE_PADRAO.map((b) => (
                    <option key={b} value={b}>
                      {b} ({RPA_MAP[b] || 'Recife'})
                    </option>
                  ))}
                </select>
                <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Tipo de Benefício
              </label>
              <select
                value={tipoBeneficio}
                onChange={(e) => setTipoBeneficio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                <option value="Idoso (65+ anos)">Idoso (65+ anos)</option>
                <option value="Pessoa com Deficiência (PCD)">Pessoa com Deficiência (PCD)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Data de Concessão *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={dataConcessao}
                  onChange={(e) => setDataConcessao(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Data de Requerimento
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dataSolicitacao}
                  onChange={(e) => setDataSolicitacao(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Valor Mensal do Benefício (R$) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                required
                value={valorBeneficio}
                onChange={(e) => setValorBeneficio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <DollarSign className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ativo}
                onChange={(e) => setAtivo(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-700">Benefício Ativo e Regular</span>
            </label>
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
              {loading ? 'Salvando...' : 'Salvar Beneficiário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
