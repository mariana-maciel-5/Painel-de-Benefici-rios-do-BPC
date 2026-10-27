import type { SchemaEntity } from '../types/database.types';

const SCHEMA_ENTITIES: SchemaEntity[] = [
  {
    tabela: 'indicadores',
    colunas: 'id, mes_referencia, total_beneficiarios, num_idosos, num_pcd, num_ativos, num_inativos, valor_total_repassado, taxa_idosos, taxa_pcd, bairro_destaque, data_calculo, data_criacao, data_atualizacao',
    chave: 'PRIMARY KEY (id)',
  },
  {
    tabela: 'beneficiarios',
    colunas: 'id, nome, cpf, nis, valor_beneficio, data_concessao, data_solicitacao, data_revisao, ativo, tipo_beneficio, bairro, rpa, data_criacao, data_atualizacao',
    chave: 'PRIMARY KEY (id) + INDEX(bairro, data_concessao)',
  },
  {
    tabela: 'usuarios',
    colunas: 'id, nome, email, senha, ativo, data_criacao, data_atualizacao',
    chave: 'PRIMARY KEY (id)',
  },
  {
    tabela: 'papeis',
    colunas: 'id, nome, descricao, data_criacao, data_atualizacao',
    chave: 'PRIMARY KEY (id)',
  },
  {
    tabela: 'permissoes',
    colunas: 'id, nome, descricao, data_criacao, data_atualizacao',
    chave: 'PRIMARY KEY (id)',
  },
  {
    tabela: 'usuario_papel',
    colunas: 'usuario_id, papel_id',
    chave: 'COMPOSITE PK (usuario_id, papel_id) + FKs',
  },
  {
    tabela: 'papel_permissao',
    colunas: 'papel_id, permissao_id',
    chave: 'COMPOSITE PK (papel_id, permissao_id) + FKs',
  },
];

export function SchemaEntitiesTable() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        7 entidades relacionais configuradas em{' '}
        <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-blue-700">
          src/db/schema.ts
        </code>{' '}
        no padrão Drizzle ORM:
      </p>
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Tabela</th>
              <th className="px-6 py-3">Esquema das Colunas</th>
              <th className="px-6 py-3">Tipo de Chave</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
            {SCHEMA_ENTITIES.map((entity) => (
              <tr key={entity.tabela}>
                <td className="px-6 py-3.5 font-bold text-slate-800">{entity.tabela}</td>
                <td className="px-6 py-3.5 font-mono text-xs text-slate-500">{entity.colunas}</td>
                <td className="px-6 py-3.5 text-xs font-semibold text-blue-600">
                  {entity.chave}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
