import { useState, useEffect, useCallback, useMemo } from 'react';
import type { BeneficiarioItem, NovoBeneficiarioPayload } from '../types/beneficiario.types';
import { beneficiarioService } from '../services/beneficiarioService';

export const BAIRROS_RECIFE_PADRAO = [
  'Afogados',
  'Boa Viagem',
  'Boa Vista',
  'Casa Amarela',
  'Cordeiro',
  'Ibura',
  'Madalena',
  'Pina',
  'Santo Amaro',
  'San Martin',
  'Tejipió',
  'Torre',
  'Várzea',
];

export function useBeneficiarios(enabled: boolean = true) {
  const [beneficiarios, setBeneficiarios] = useState<BeneficiarioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [bairroFilter, setBairroFilter] = useState<string>('todos');
  const [dataInicioFilter, setDataInicioFilter] = useState<string>('');
  const [dataFimFilter, setDataFimFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativos' | 'inativos'>('todos');

  const fetchBeneficiarios = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const res = await beneficiarioService.getBeneficiarios({
        bairro: bairroFilter !== 'todos' ? bairroFilter : undefined,
        data_inicio: dataInicioFilter || undefined,
        data_fim: dataFimFilter || undefined,
        ativo: statusFilter !== 'todos' ? (statusFilter === 'ativos' ? 'true' : 'false') : undefined,
      });
      if (res.success && Array.isArray(res.data)) {
        setBeneficiarios(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar beneficiários BPC.');
    } finally {
      setLoading(false);
    }
  }, [enabled, bairroFilter, dataInicioFilter, dataFimFilter, statusFilter]);

  useEffect(() => {
    fetchBeneficiarios();
  }, [fetchBeneficiarios]);

  const toggleStatus = async (id: number) => {
    try {
      await beneficiarioService.toggleStatus(id);
      setBeneficiarios((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ativo: !b.ativo } : b))
      );
    } catch (err: any) {
      alert(`Erro ao alterar status: ${err.message}`);
    }
  };

  const cadastrar = async (payload: NovoBeneficiarioPayload) => {
    const res = await beneficiarioService.cadastrarBeneficiario(payload);
    await fetchBeneficiarios();
    return res;
  };

  // Extrair lista dinâmica de bairros a partir dos dados recebidos
  const bairrosDisponiveis = useMemo(() => {
    const set = new Set<string>(BAIRROS_RECIFE_PADRAO);
    beneficiarios.forEach((b) => {
      if (b.bairro && b.bairro.trim()) {
        set.add(b.bairro.trim());
      }
    });
    return Array.from(set).sort();
  }, [beneficiarios]);

  // Filtro refinado no cliente
  const filteredBeneficiarios = useMemo(() => {
    return beneficiarios.filter((item) => {
      // 1. Filtro por Bairro
      if (bairroFilter !== 'todos' && item.bairro?.toLowerCase() !== bairroFilter.toLowerCase()) {
        return false;
      }

      // 2. Filtro por Período de Concessão
      if (dataInicioFilter && item.data_concessao < dataInicioFilter) {
        return false;
      }
      if (dataFimFilter && item.data_concessao > dataFimFilter) {
        return false;
      }

      // 3. Filtro por Situação Ativo/Inativo
      const isAtivo = Boolean(item.ativo);
      if (statusFilter === 'ativos' && !isAtivo) return false;
      if (statusFilter === 'inativos' && isAtivo) return false;

      // 4. Busca por Texto (Nome, CPF, NIS, RPA)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = item.nome?.toLowerCase().includes(term);
        const matchesCpf = item.cpf?.toLowerCase().includes(term);
        const matchesNis = item.nis?.toLowerCase().includes(term);
        const matchesBairro = item.bairro?.toLowerCase().includes(term);
        const matchesRpa = item.rpa?.toLowerCase().includes(term);
        return matchesName || matchesCpf || matchesNis || matchesBairro || matchesRpa;
      }
      return true;
    });
  }, [beneficiarios, searchTerm, bairroFilter, dataInicioFilter, dataFimFilter, statusFilter]);

  const temFiltrosAtivos = useMemo(() => {
    return (
      bairroFilter !== 'todos' ||
      Boolean(dataInicioFilter) ||
      Boolean(dataFimFilter) ||
      statusFilter !== 'todos' ||
      Boolean(searchTerm.trim())
    );
  }, [bairroFilter, dataInicioFilter, dataFimFilter, statusFilter, searchTerm]);

  const limparFiltros = () => {
    setSearchTerm('');
    setBairroFilter('todos');
    setDataInicioFilter('');
    setDataFimFilter('');
    setStatusFilter('todos');
  };

  const stats = useMemo(() => {
    const total = filteredBeneficiarios.length;
    const ativos = filteredBeneficiarios.filter((b) => Boolean(b.ativo)).length;
    const inativos = total - ativos;
    const valorTotalMensal = filteredBeneficiarios
      .filter((b) => Boolean(b.ativo))
      .reduce((acc, curr) => acc + Number(curr.valor_beneficio || 0), 0);

    return {
      total,
      ativos,
      inativos,
      valorTotalMensal,
    };
  }, [filteredBeneficiarios]);

  return {
    beneficiarios: filteredBeneficiarios,
    allCount: beneficiarios.length,
    loading,
    error,
    // Filtros
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
    limparFiltros,
    // Ações
    refetch: fetchBeneficiarios,
    toggleStatus,
    cadastrar,
    stats,
  };
}
