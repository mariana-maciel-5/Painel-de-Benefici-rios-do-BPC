import 'dotenv/config';
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

    // 3. Usuários Mockados (com hash de demonstração)
    const defaultPasswordHash = '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W65Wv5W96tH0jE4.';

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
         ON DUPLICATE KEY UPDATE nome = VALUES(nome), ativo = VALUES(ativo)`,
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

    console.log('✅ SEED concluído com sucesso!');
    return {
      success: true,
      message: 'Dados mockados inseridos com sucesso no MySQL!',
      totais: {
        papeis: papeisData.length,
        permissoes: permissoesData.length,
        usuarios: usuariosData.length,
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
