import { Users, CheckCircle2, XCircle, DollarSign } from 'lucide-react';
import { StatCard } from '../../../components/StatCard';

interface BeneficiarioStatsCardsProps {
  total: number;
  ativos: number;
  inativos: number;
  valorTotalMensal: number;
}

export function BeneficiarioStatsCards({
  total,
  ativos,
  inativos,
  valorTotalMensal,
}: BeneficiarioStatsCardsProps) {
  const formattedValor = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valorTotalMensal);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        title="Total de Beneficiários"
        value={total}
        subtitle="Cadastros no Município"
        subtitleColor="text-blue-600"
        icon={<Users className="w-4 h-4 text-blue-500" />}
      />
      <StatCard
        title="Benefícios Ativos"
        value={ativos}
        subtitle="Concessões Regulares"
        subtitleColor="text-emerald-600"
        icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
      />
      <StatCard
        title="Benefícios Inativos"
        value={inativos}
        subtitle="Suspensos ou Cancelados"
        subtitleColor="text-amber-600"
        icon={<XCircle className="w-4 h-4 text-amber-500" />}
      />
      <StatCard
        title="Repasse Mensal Estimado"
        value={formattedValor}
        subtitle="Injeção na Economia Local"
        subtitleColor="text-indigo-600"
        icon={<DollarSign className="w-4 h-4 text-indigo-500" />}
      />
    </div>
  );
}
