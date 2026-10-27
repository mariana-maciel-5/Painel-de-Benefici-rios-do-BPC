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
        ativo: true,
        tipo_beneficio: 'Idoso (65+ anos)',
        bairro: 'Casa Amarela',
      },
      {
        id: 2,
        nome: 'Maria das Dores de Souza',
        cpf: '234.567.890-12',
        nis: '20987654322',
        valor_beneficio: 1412.00,
        data_concessao: '2020-08-10',
        ativo: true,
        tipo_beneficio: 'Pessoa com Deficiência (PCD)',
        bairro: 'Santo Amaro',
      },
      {
        id: 3,
        nome: 'José Carlos Cavalcanti',
        cpf: '345.678.901-23',
        nis: '30987654323',
        valor_beneficio: 1412.00,
        data_concessao: '2019-11-20',
        ativo: true,
        tipo_beneficio: 'Idoso (65+ anos)',
        bairro: 'Várzea',
      },
      {
        id: 4,
        nome: 'Francisca Alves de Lima',
        cpf: '456.789.012-34',
        nis: '40987654324',
        valor_beneficio: 1412.00,
        data_concessao: '2022-01-05',
        ativo: true,
        tipo_beneficio: 'Pessoa com Deficiência (PCD)',
        bairro: 'Ibura',
      },
      {
        id: 5,
        nome: 'Manoel Ferreira dos Santos',
        cpf: '567.890.123-45',
        nis: '50987654325',
        valor_beneficio: 1412.00,
        data_concessao: '2018-05-18',
        ativo: false,
        tipo_beneficio: 'Idoso (65+ anos)',
        bairro: 'Boa Viagem',
      },
      {
        id: 6,
        nome: 'Tereza Cristina Medeiros',
        cpf: '678.901.234-56',
        nis: '60987654326',
        valor_beneficio: 1412.00,
        data_concessao: '2023-06-22',
        ativo: true,
        tipo_beneficio: 'Pessoa com Deficiência (PCD)',
        bairro: 'Afogados',
      },
      {
        id: 7,
        nome: 'Antônio Bezerra de Araújo',
        cpf: '789.012.345-67',
        nis: '70987654327',
        valor_beneficio: 1412.00,
        data_concessao: '2021-09-30',
        ativo: true,
        tipo_beneficio: 'Idoso (65+ anos)',
        bairro: 'Pina',
      },
      {
        id: 8,
        nome: 'Raimunda Nonata Duarte',
        cpf: '890.123.456-78',
        nis: '80987654328',
        valor_beneficio: 1412.00,
        data_concessao: '2022-12-14',
        ativo: true,
        tipo_beneficio: 'Idoso (65+ anos)',
        bairro: 'Tejipió',
      },
    ];

    for (const b of beneficiariosData) {
      await connection.query(
        `INSERT INTO beneficiarios (id, nome, cpf, nis, valor_beneficio, data_concessao, ativo, tipo_beneficio, bairro)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           nome = VALUES(nome),
           cpf = VALUES(cpf),
           nis = VALUES(nis),
           valor_beneficio = VALUES(valor_beneficio),
           data_concessao = VALUES(data_concessao),
           ativo = VALUES(ativo),
           tipo_beneficio = VALUES(tipo_beneficio),
           bairro = VALUES(bairro)`,
        [b.id, b.nome, b.cpf, b.nis, b.valor_beneficio, b.data_concessao, b.ativo, b.tipo_beneficio, b.bairro]
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
