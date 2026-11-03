import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { poolConnection } from './index';
import { initDatabase } from './init';

export async function runSeed() {
  console.log('🌱 Iniciando processo de SEED...');

  // Garante que o banco e as tabelas estejam criadas antes do seed
  const initResult = await initDatabase();
  if (!initResult.success) {
    return {
      success: false,
      message: `Falha na inicialização do banco: ${initResult.message}`,
    };
  }

  const connection = await poolConnection.getConnection();
  try {
    // 1. Papéis
    const papeisData = [
      { id: 1, nome: 'Administrador Geral', descricao: 'Acesso total a todas as funcionalidades e configurações do BPC Recife' },
      { id: 2, nome: 'Coordenador CRAS', descricao: 'Supervisão técnica de atendimentos e aprovação de relatórios das unidades' },
      { id: 3, nome: 'Assistente Social', descricao: 'Triagem, avaliação socioeconômica e acompanhamento direto dos beneficiários' },
      { id: 4, nome: 'Auditor Municipal', descricao: 'Fiscalização e auditoria de conformidade de benefícios e laudos' },
      { id: 5, nome: 'Atendente / Recepção', descricao: 'Recepção, triagem inicial e agendamento de atendimentos nos postos' },
    ];

    for (const p of papeisData) {
      await connection.query(
        `INSERT INTO papeis (id, nome, descricao) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE nome = VALUES(nome), descricao = VALUES(descricao)`,
        [p.id, p.nome, p.descricao]
      );
    }

    // 2. Permissões
    const permissoesData = [
      { id: 1, nome: 'beneficiarios:visualizar', descricao: 'Visualizar listagem e prontuário de beneficiários BPC' },
      { id: 2, nome: 'beneficiarios:cadastrar', descricao: 'Cadastrar novos beneficiários e requerentes' },
      { id: 3, nome: 'beneficiarios:editar', descricao: 'Editar dados cadastrais, renda e laudos' },
      { id: 4, nome: 'beneficiarios:excluir', descricao: 'Inativar ou remover cadastro de beneficiários' },
      { id: 5, nome: 'pareceres:emitir', descricao: 'Emitir e assinar pareceres sociais e laudos técnicos' },
      { id: 6, nome: 'relatorios:gerar', descricao: 'Exportar relatórios estatísticos e operacionais' },
      { id: 7, nome: 'usuarios:gerenciar', descricao: 'Criar, editar e definir permissões de operadores' },
      { id: 8, nome: 'auditoria:consultar', descricao: 'Consultar logs de auditoria e trilha de auditoria' },
    ];

    for (const perm of permissoesData) {
      await connection.query(
        `INSERT INTO permissoes (id, nome, descricao) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE nome = VALUES(nome), descricao = VALUES(descricao)`,
        [perm.id, perm.nome, perm.descricao]
      );
    }

    // 3. Usuários Mockados (senha padrão: 123456)
    const defaultPasswordHash = bcrypt.hashSync('123456', 10);

    const usuariosData = [
      { id: 1, nome: 'Mariana Maciel', email: 'mariana.maciel@recife.pe.gov.br', senha: defaultPasswordHash, ativo: true },
      { id: 2, nome: 'Carlos Eduardo Bezerra', email: 'carlos.bezerra@recife.pe.gov.br', senha: defaultPasswordHash, ativo: true },
      { id: 3, nome: 'Juliana Costa Albuquerque', email: 'juliana.albuquerque@recife.pe.gov.br', senha: defaultPasswordHash, ativo: true },
      { id: 4, nome: 'Ricardo Ferreira Lima', email: 'ricardo.lima@recife.pe.gov.br', senha: defaultPasswordHash, ativo: true },
      { id: 5, nome: 'Amanda Barros Santos', email: 'amanda.barros@recife.pe.gov.br', senha: defaultPasswordHash, ativo: true },
      { id: 6, nome: 'Lucas Guimarães Melo', email: 'lucas.melo@recife.pe.gov.br', senha: defaultPasswordHash, ativo: false },
    ];

    for (const u of usuariosData) {
      await connection.query(
        `INSERT INTO usuarios (id, nome, email, senha, ativo) VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE nome = VALUES(nome), senha = VALUES(senha), ativo = VALUES(ativo)`,
        [u.id, u.nome, u.email, u.senha, u.ativo]
      );
    }

    // 4. Associação Papel - Permissão (papel_permissao)
    const papelPermissoes = [
      // Administrador Geral (1): Todas as permissões
      { papel_id: 1, permissao_id: 1 },
      { papel_id: 1, permissao_id: 2 },
      { papel_id: 1, permissao_id: 3 },
      { papel_id: 1, permissao_id: 4 },
      { papel_id: 1, permissao_id: 5 },
      { papel_id: 1, permissao_id: 6 },
      { papel_id: 1, permissao_id: 7 },
      { papel_id: 1, permissao_id: 8 },

      // Coordenador CRAS (2): Visualizar, cadastrar, editar, emitir parecer e relatórios
      { papel_id: 2, permissao_id: 1 },
      { papel_id: 2, permissao_id: 2 },
      { papel_id: 2, permissao_id: 3 },
      { papel_id: 2, permissao_id: 5 },
      { papel_id: 2, permissao_id: 6 },

      // Assistente Social (3): Visualizar, cadastrar, editar e emitir parecer
      { papel_id: 3, permissao_id: 1 },
      { papel_id: 3, permissao_id: 2 },
      { papel_id: 3, permissao_id: 3 },
      { papel_id: 3, permissao_id: 5 },

      // Auditor Municipal (4): Visualizar, relatórios e auditoria
      { papel_id: 4, permissao_id: 1 },
      { papel_id: 4, permissao_id: 6 },
      { papel_id: 4, permissao_id: 8 },

      // Atendente / Recepção (5): Visualizar e cadastrar
      { papel_id: 5, permissao_id: 1 },
      { papel_id: 5, permissao_id: 2 },
    ];

    for (const pp of papelPermissoes) {
      await connection.query(
        `INSERT IGNORE INTO papel_permissao (papel_id, permissao_id) VALUES (?, ?)`,
        [pp.papel_id, pp.permissao_id]
      );
    }

    // 5. Associação Usuário - Papel (usuario_papel)
    const usuarioPapeis = [
      { usuario_id: 1, papel_id: 1 }, // Mariana -> Administrador Geral
      { usuario_id: 2, papel_id: 3 }, // Carlos -> Assistente Social
      { usuario_id: 3, papel_id: 2 }, // Juliana -> Coordenadora CRAS
      { usuario_id: 4, papel_id: 4 }, // Ricardo -> Auditor Municipal
      { usuario_id: 5, papel_id: 5 }, // Amanda -> Atendente
      { usuario_id: 6, papel_id: 3 }, // Lucas -> Assistente Social (inativo)
    ];

    for (const up of usuarioPapeis) {
      await connection.query(
        `INSERT IGNORE INTO usuario_papel (usuario_id, papel_id) VALUES (?, ?)`,
        [up.usuario_id, up.papel_id]
      );
    }

    // 6. Beneficiários BPC Recife Mockados
    const beneficiariosData = [
      {
        id: 1,
        nome: 'Severino Ramos da Silva',
        cpf: '123.456.789-01',
        nis: '10987654321',
        valor_beneficio: 1412.00,
        data_concessao: '2021-03-15',
        data_solicitacao: '2021-01-10',
        data_revisao: '2023-03-15',
        ativo: true,
        tipo_beneficio: 'Idoso (65+ anos)',
        bairro: 'Casa Amarela',
        rpa: 'RPA 3',
      },
      {
        id: 2,
        nome: 'Maria das Dores de Souza',
        cpf: '234.567.890-12',
        nis: '20987654322',
        valor_beneficio: 1412.00,
        data_concessao: '2020-08-10',
        data_solicitacao: '2020-05-12',
        data_revisao: '2022-08-10',
        ativo: true,
        tipo_beneficio: 'Pessoa com Deficiência (PCD)',
        bairro: 'Santo Amaro',
        rpa: 'RPA 1',
      },
      {
        id: 3,
        nome: 'José Carlos Cavalcanti',
        cpf: '345.678.901-23',
        nis: '30987654323',
        valor_beneficio: 1412.00,
        data_concessao: '2019-11-20',
        data_solicitacao: '2019-09-01',
        data_revisao: '2021-11-20',
        ativo: true,
        tipo_beneficio: 'Idoso (65+ anos)',
        bairro: 'Várzea',
        rpa: 'RPA 4',
      },
      {
        id: 4,
        nome: 'Francisca Alves de Lima',
        cpf: '456.789.012-34',
        nis: '40987654324',
        valor_beneficio: 1412.00,
        data_concessao: '2022-01-05',
        data_solicitacao: '2021-10-15',
        data_revisao: '2024-01-05',
        ativo: true,
        tipo_beneficio: 'Pessoa com Deficiência (PCD)',
        bairro: 'Ibura',
        rpa: 'RPA 6',
      },
      {
        id: 5,
        nome: 'Manoel Ferreira dos Santos',
        cpf: '567.890.123-45',
        nis: '50987654325',
        valor_beneficio: 1412.00,
        data_concessao: '2018-05-18',
        data_solicitacao: '2018-02-14',
        data_revisao: '2020-05-18',
        ativo: false,
        tipo_beneficio: 'Idoso (65+ anos)',
        bairro: 'Boa Viagem',
        rpa: 'RPA 6',
      },
      {
        id: 6,
        nome: 'Tereza Cristina Medeiros',
        cpf: '678.901.234-56',
        nis: '60987654326',
        valor_beneficio: 1412.00,
        data_concessao: '2023-06-22',
        data_solicitacao: '2023-03-10',
        data_revisao: '2025-06-22',
        ativo: true,
        tipo_beneficio: 'Pessoa com Deficiência (PCD)',
        bairro: 'Afogados',
        rpa: 'RPA 5',
      },
      {
        id: 7,
        nome: 'Antônio Bezerra de Araújo',
        cpf: '789.012.345-67',
        nis: '70987654327',
        valor_beneficio: 1412.00,
        data_concessao: '2021-09-30',
        data_solicitacao: '2021-06-20',
        data_revisao: '2023-09-30',
        ativo: true,
        tipo_beneficio: 'Idoso (65+ anos)',
        bairro: 'Pina',
        rpa: 'RPA 6',
      },
      {
        id: 8,
        nome: 'Raimunda Nonata Duarte',
        cpf: '890.123.456-78',
        nis: '80987654328',
        valor_beneficio: 1412.00,
        data_concessao: '2022-12-14',
        data_solicitacao: '2022-09-05',
        data_revisao: '2024-12-14',
        ativo: true,
        tipo_beneficio: 'Idoso (65+ anos)',
        bairro: 'Tejipió',
        rpa: 'RPA 5',
      },
    ];

    for (const b of beneficiariosData) {
      await connection.query(
        `INSERT INTO beneficiarios (id, nome, cpf, nis, valor_beneficio, data_concessao, data_solicitacao, data_revisao, ativo, tipo_beneficio, bairro, rpa)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           nome = VALUES(nome),
           cpf = VALUES(cpf),
           nis = VALUES(nis),
           valor_beneficio = VALUES(valor_beneficio),
           data_concessao = VALUES(data_concessao),
           data_solicitacao = VALUES(data_solicitacao),
           data_revisao = VALUES(data_revisao),
           ativo = VALUES(ativo),
           tipo_beneficio = VALUES(tipo_beneficio),
           bairro = VALUES(bairro),
           rpa = VALUES(rpa)`,
        [b.id, b.nome, b.cpf, b.nis, b.valor_beneficio, b.data_concessao, b.data_solicitacao, b.data_revisao, b.ativo, b.tipo_beneficio, b.bairro, b.rpa]
      );
    }

    // 7. Entidade Painéis (Painéis Temáticos do Município)
    const paineisData = [
      { id: 1, nome: 'Painel Geral do BPC Recife', descricao: 'Monitoramento Central da Assistência Social e Concessões BPC' },
      { id: 2, nome: 'Painel de Proteção à Pessoa Idosa', descricao: 'Acompanhamento de idosos (65+ anos) e concessões BPC' },
      { id: 3, nome: 'Painel de Acessibilidade e Pessoa com Deficiência (PCD)', descricao: 'Indicadores de inclusão, perícia médica e laudos biopsicossociais' },
      { id: 4, nome: 'Painel Territorial e CRAS por RPA', descricao: 'Distribuição descentralizada nas 6 Regiões Político-Administrativas do Recife' },
      { id: 5, nome: 'Painel Orçamentário e Repasses FNAS', descricao: 'Fluxo financeiro municipal e impacto dos recursos federais' },
    ];

    for (const p of paineisData) {
      await connection.query(
        `INSERT INTO paineis (id, nome, descricao) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE nome = VALUES(nome), descricao = VALUES(descricao)`,
        [p.id, p.nome, p.descricao]
      );
    }

    // 8. Entidade Genérica Indicadores (Linhas da Tabela conforme especificação oficial)
    const indicadoresData = [
      {
        id: 1,
        nome: 'Total de beneficiários',
        descricao: 'Quantidade total consolidada de beneficiários do BPC no município do Recife',
        unidade: 'beneficiários',
        fonte: 'Ministério do Desenvolvimento Social - MDS',
        painelId: 1,
        valor: 1520.00,
      },
      {
        id: 2,
        nome: 'Beneficiários idosos',
        descricao: 'Beneficiários do BPC com idade igual ou superior a 65 anos',
        unidade: 'idosos',
        fonte: 'Secretaria de Assistência Social do Recife - SAS',
        painelId: 2,
        valor: 950.00,
      },
      {
        id: 3,
        nome: 'Beneficiários com deficiência',
        descricao: 'Beneficiários do BPC com impedimento de longo prazo e laudo pericial (PCD)',
        unidade: 'pessoas com deficiência',
        fonte: 'Secretaria de Assistência Social do Recife - SAS',
        painelId: 3,
        valor: 570.00,
      },
      {
        id: 4,
        nome: 'Beneficiários ativos em folha',
        descricao: 'Benefícios regulares com pagamento mensal liberado pelo MDS',
        unidade: 'benefícios',
        fonte: 'Base Municipal do CadÚnico / Recife',
        painelId: 1,
        valor: 1480.00,
      },
      {
        id: 5,
        nome: 'Beneficiários em revisão cadastral',
        descricao: 'Benefícios temporariamente suspensos para averiguação cadastral no CadÚnico',
        unidade: 'benefícios',
        fonte: 'Coordenação Municipal do BPC Recife',
        painelId: 1,
        valor: 40.00,
      },
      {
        id: 6,
        nome: 'Valor total mensal repassado',
        descricao: 'Montante mensal transferido aos beneficiários do município',
        unidade: 'reais / mês',
        fonte: 'Fundo Nacional de Assistência Social - FNAS',
        painelId: 5,
        valor: 2146240.00,
      },
      {
        id: 7,
        nome: 'Taxa de concessão BPC Idoso',
        descricao: 'Proporção percentual de idosos sobre o total de beneficiários',
        unidade: '%',
        fonte: 'DATAPREV / INSS / SAS Recife',
        painelId: 2,
        valor: 62.50,
      },
      {
        id: 8,
        nome: 'Taxa de concessão BPC Deficiência',
        descricao: 'Proporção percentual de pessoas com deficiência sobre o total de beneficiários',
        unidade: '%',
        fonte: 'DATAPREV / INSS / SAS Recife',
        painelId: 3,
        valor: 37.50,
      },
      {
        id: 9,
        nome: 'Beneficiários atendidos na rede CRAS',
        descricao: 'Famílias com beneficiários ativamente acompanhadas pelos CRAS do Recife',
        unidade: 'famílias',
        fonte: 'Rede SUAS Recife / CRAS',
        painelId: 4,
        valor: 1240.00,
      },
      {
        id: 10,
        nome: 'Novos requerimentos em análise',
        descricao: 'Requerimentos sob análise administrativa e perícia técnica',
        unidade: 'pedidos',
        fonte: 'INSS Agência Recife',
        painelId: 1,
        valor: 185.00,
      },
      {
        id: 11,
        nome: 'Tempo médio de concessão',
        descricao: 'Prazo médio entre a solicitação inicial e a homologação do benefício',
        unidade: 'dias',
        fonte: 'Ouvidoria da Assistência Social',
        painelId: 1,
        valor: 42.00,
      },
      {
        id: 12,
        nome: 'Cobertura em áreas de vulnerabilidade',
        descricao: 'Percentual de beneficiários residentes nas ZEIS e comunidades periféricas',
        unidade: '%',
        fonte: 'Instituto da Cidade Pelópidas Silveira - ICPS',
        painelId: 4,
        valor: 78.40,
      },
    ];

    for (const ind of indicadoresData) {
      await connection.query(
        `INSERT INTO indicadores (id, nome, descricao, unidade, fonte, painelId, valor)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           nome = VALUES(nome),
           descricao = VALUES(descricao),
           unidade = VALUES(unidade),
           fonte = VALUES(fonte),
           painelId = VALUES(painelId),
           valor = VALUES(valor)`,
        [
          ind.id,
          ind.nome,
          ind.descricao,
          ind.unidade,
          ind.fonte,
          ind.painelId,
          ind.valor,
        ]
      );
    }

    console.log('✅ SEED concluído com sucesso!');
    return {
      success: true,
      message: 'Dados mockados inseridos com sucesso no MySQL!',
      totais: {
        papeis: papeisData.length,
        permissoes: permissoesData.length,
        usuarios: usuariosData.length,
        beneficiarios: beneficiariosData.length,
        indicadores: indicadoresData.length,
        vinculos_papel_permissao: papelPermissoes.length,
        vinculos_usuario_papel: usuarioPapeis.length,
      },
    };
  } catch (error: any) {
    console.error('❌ Erro durante o SEED:', error.message);
    return {
      success: false,
      message: `Erro durante o SEED: ${error.message}`,
    };
  } finally {
    connection.release();
  }
}

// Execução direta via CLI (npm run db:seed)
if (process.argv[1]?.includes('seed.ts')) {
  runSeed()
    .then((res) => {
      console.log(res);
      process.exit(res.success ? 0 : 1);
    })
    .catch((err) => {
      console.error('❌ Erro no seed:', err);
      process.exit(1);
    });
}
