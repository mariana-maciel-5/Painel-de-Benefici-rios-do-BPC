import { useState, useEffect, useCallback, useMemo } from 'react';
import type { BeneficiarioItem, NovoBeneficiarioPayload } from '../types/beneficiario.types';
import { beneficiarioService } from '../services/beneficiarioService';

export function useBeneficiarios(enabled: boolean = true) {
  const [beneficiarios, setBeneficiarios] = useState<BeneficiarioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativos' | 'inativos'>('todos');

  const fetchBeneficiarios = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const res = await beneficiarioService.getBeneficiarios();
      if (res.success && Array.isArray(res.data)) {
        setBeneficiarios(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar beneficiários BPC.');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

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

  const filteredBeneficiarios = useMemo(() => {
    return beneficiarios.filter((item) => {
      const isAtivo = Boolean(item.ativo);
      if (statusFilter === 'ativos' && !isAtivo) return false;
      if (statusFilter === 'inativos' && isAtivo) return false;

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = item.nome?.toLowerCase().includes(term);
        const matchesCpf = item.cpf?.toLowerCase().includes(term);
        const matchesNis = item.nis?.toLowerCase().includes(term);
        const matchesBairro = item.bairro?.toLowerCase().includes(term);
        return matchesName || matchesCpf || matchesNis || matchesBairro;
      }
      return true;
    });
  }, [beneficiarios, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = beneficiarios.length;
    const ativos = beneficiarios.filter((b) => Boolean(b.ativo)).length;
    const inativos = total - ativos;
    const valorTotalMensal = beneficiarios
      .filter((b) => Boolean(b.ativo))
      .reduce((acc, curr) => acc + Number(curr.valor_beneficio || 0), 0);

    return {
      total,
      ativos,
      inativos,
      valorTotalMensal,
    };
  }, [beneficiarios]);

  return {
    beneficiarios: filteredBeneficiarios,
    allCount: beneficiarios.length,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    refetch: fetchBeneficiarios,
    toggleStatus,
    cadastrar,
    stats,
  };
}
