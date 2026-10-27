import { Users, Accessibility, UserCheck, DollarSign } from 'lucide-react';
import { StatCard } from '../../../components/StatCard';
import type { IndicadorItem } from '../types/indicador.types';

interface IndicadoresSummaryCardsProps {
  indicador: IndicadorItem | null;
}

export function IndicadoresSummaryCards({ indicador }: IndicadoresSummaryCardsProps) {
  const total = indicador?.total_beneficiarios ?? 0;
  const idosos = indicador?.num_idosos ?? 0;
  const pcd = indicador?.num_pcd ?? 0;
  const valor = Number(indicador?.valor_total_repassado || 0);

  const formattedValor = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);

  const taxaIdosos = total > 0 ? ((idosos / total) * 100).toFixed(1) : '0';
  const taxaPcd = total > 0 ? ((pcd / total) * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        title="Total de Beneficiários"
        value={total.toLocaleString('pt-BR')}
        subtitle="Concessões BPC no Recife"
        subtitleColor="text-blue-600"
        icon={<Users className="w-4 h-4 text-blue-500" />}
      />

      <StatCard
        title="Nº de Idosos (65+ anos)"
        value={idosos.toLocaleString('pt-BR')}
        subtitle={`${taxaIdosos}% da base total`}
        subtitleColor="text-indigo-600"
        icon={<UserCheck className="w-4 h-4 text-indigo-500" />}
      />

      <StatCard
        title="Nº de PCDs (Deficiência)"
        value={pcd.toLocaleString('pt-BR')}
        subtitle={`${taxaPcd}% da base total`}
        subtitleColor="text-purple-600"
        icon={<Accessibility className="w-4 h-4 text-purple-500" />}
      />

      <StatCard
        title="Repasse Mensal Estimado"
        value={formattedValor}
        subtitle="Injeção na Economia Local"
        subtitleColor="text-emerald-600"
        icon={<DollarSign className="w-4 h-4 text-emerald-500" />}
      />
    </div>
  );
}
