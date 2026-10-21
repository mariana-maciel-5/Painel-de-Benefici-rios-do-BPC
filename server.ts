import 'dotenv/config';
import Fastify from 'fastify';
import middie from '@fastify/middie';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initDatabase } from './src/db/init';
import { runSeed } from './src/db/seed';
import { poolConnection } from './src/db';
import { generateToken, verifyToken, comparePassword, hashPassword } from './src/utils/auth';

async function startServer() {
  const fastify = Fastify({ logger: true });
  const PORT = 3000;

  // Registrar middie para middlewares no estilo Express (necessário para o Vite)
  await fastify.register(middie);

  // Middleware / Hook de Autenticação JWT
  async function authenticate(request: any, reply: any) {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({
        success: false,
        message: 'Acesso não autorizado. Cabeçalho Authorization com formato Bearer <token> é obrigatório.',
      });
    }

    const token = authHeader.slice(7).trim();
    try {
      const decoded = verifyToken(token);
      request.user = decoded;
    } catch (err: any) {
      return reply.status(401).send({
        success: false,
        message: 'Token JWT inválido ou expirado.',
      });
    }
  }

  // Inicializa as tabelas no MySQL se a conexão estiver disponível
  let dbStatus = await initDatabase();

  // Rotas de API públicas
  fastify.get('/api/health', async (request, reply) => {
    return {
      status: 'ok',
      message: 'API rodando perfeitamente!',
      banco_de_dados: dbStatus,
    };
  });

  // Autenticação: Login (Gera JWT)
  fastify.post('/api/auth/login', async (request: any, reply: any) => {
    const { email, senha } = request.body || {};

    if (!email || !senha) {
      return reply.status(400).send({
        success: false,
        message: 'Email e senha são obrigatórios.',
      });
    }

    try {
      const [users]: any = await poolConnection.query(
        `SELECT id, nome, email, senha, ativo FROM usuarios WHERE email = ? LIMIT 1`,
        [email]
      );

      if (!users || users.length === 0) {
        return reply.status(401).send({
          success: false,
          message: 'Credenciais inválidas. Usuário não encontrado.',
        });
      }

      const user = users[0];

      if (!user.ativo) {
        return reply.status(403).send({
          success: false,
          message: 'Usuário inativo. Entre em contato com o administrador.',
        });
      }

      let passwordMatch = false;
      try {
        passwordMatch = await comparePassword(senha, user.senha);
      } catch (e) {
        passwordMatch = false;
      }

      // Compatibilidade 1: Senha em texto puro no banco (ex: "123456")
      if (!passwordMatch && user.senha === senha) {
        passwordMatch = true;
        try {
          const newHash = await hashPassword(senha);
          await poolConnection.query(`UPDATE usuarios SET senha = ? WHERE id = ?`, [newHash, user.id]);
        } catch {}
      }

      // Compatibilidade 2: Hash dummy gerado no primeiro seed ($2b$10$EixZaYVK1fsbw1ZfbX3OXe...)
      if (!passwordMatch && (senha === '123456' || senha === 'BpcRecife@2026') && typeof user.senha === 'string' && user.senha.startsWith('$2b$10$EixZaYVK1fsbw1ZfbX3OXe')) {
        passwordMatch = true;
        try {
          const newHash = await hashPassword('123456');
          await poolConnection.query(`UPDATE usuarios SET senha = ? WHERE id = ?`, [newHash, user.id]);
        } catch {}
      }

      if (!passwordMatch) {
        return reply.status(401).send({
          success: false,
          message: 'Credenciais inválidas. Senha incorreta.',
        });
      }

      // Buscar papéis do usuário
      const [roles]: any = await poolConnection.query(
        `SELECT p.nome FROM papeis p
         INNER JOIN usuario_papel up ON p.id = up.papel_id
         WHERE up.usuario_id = ?`,
        [user.id]
      );
      const papeis = roles.map((r: any) => r.nome);

      // Buscar permissões do usuário
      const [perms]: any = await poolConnection.query(
        `SELECT DISTINCT pm.nome FROM permissoes pm
         INNER JOIN papel_permissao pp ON pm.id = pp.permissao_id
         INNER JOIN usuario_papel up ON pp.papel_id = up.papel_id
         WHERE up.usuario_id = ?`,
        [user.id]
      );
      const permissoes = perms.map((p: any) => p.nome);

      const tokenPayload = {
        id: user.id,
        email: user.email,
        nome: user.nome,
        papeis,
        permissoes,
      };

      const token = generateToken(tokenPayload);

      return {
        success: true,
        message: 'Autenticação realizada com sucesso!',
        token,
        usuario: tokenPayload,
      };
    } catch (err: any) {
      // Fallback para ambiente de desenvolvimento quando MySQL não estiver conectado localmente
      if (
        err.message?.includes('ECONNREFUSED') ||
        err.message?.includes('ETIMEDOUT') ||
        err.code === 'ECONNREFUSED'
      ) {
        if (
          email === 'mariana.maciel@recife.pe.gov.br' ||
          email === 'carlos.bezerra@recife.pe.gov.br'
        ) {
          const isMariana = email === 'mariana.maciel@recife.pe.gov.br';
          const tokenPayload = {
            id: isMariana ? 1 : 2,
            email,
            nome: isMariana ? 'Mariana Maciel' : 'Carlos Eduardo Bezerra',
            papeis: isMariana ? ['Administrador Geral'] : ['Assistente Social'],
            permissoes: isMariana
              ? ['beneficiarios:visualizar', 'beneficiarios:cadastrar', 'usuarios:gerenciar']
              : ['beneficiarios:visualizar', 'beneficiarios:cadastrar'],
          };
          const token = generateToken(tokenPayload);
          return {
            success: true,
            message: 'Autenticação efetuada (Modo Preview/Mock).',
            token,
            usuario: tokenPayload,
          };
        }
      }

      return reply.status(500).send({
        success: false,
        message: `Erro ao autenticar: ${err.message}`,
      });
    }
  });

  // Perfil do Usuário Autenticado
  fastify.get('/api/auth/me', { preHandler: authenticate }, async (request: any, reply) => {
    return {
      success: true,
      usuario: request.user,
    };
  });

  fastify.all('/api/db/init', async (request, reply) => {
    dbStatus = await initDatabase();
    return dbStatus;
  });

  fastify.all('/api/db/seed', async (request, reply) => {
    const result = await runSeed();
    return result;
  });

  // Rotas Protegidas por JWT
  fastify.get('/api/usuarios', { preHandler: authenticate }, async (request, reply) => {
    try {
      const [rows] = await poolConnection.query(`
        SELECT u.id, u.nome, u.email, u.ativo, u.data_criacao,
               COALESCE(GROUP_CONCAT(p.nome SEPARATOR ', '), 'Sem papel') as papel
        FROM usuarios u
        LEFT JOIN usuario_papel up ON u.id = up.usuario_id
        LEFT JOIN papeis p ON up.papel_id = p.id
        GROUP BY u.id
        ORDER BY u.id ASC
      `);
      return { success: true, data: rows };
    } catch (err: any) {
      return reply.status(500).send({ success: false, message: err.message, data: [] });
    }
  });

  fastify.get('/api/papeis', { preHandler: authenticate }, async (request, reply) => {
    try {
      const [rows] = await poolConnection.query(`
        SELECT p.id, p.nome, p.descricao, p.data_criacao,
               COUNT(pp.permissao_id) as total_permissoes
        FROM papeis p
        LEFT JOIN papel_permissao pp ON p.id = pp.papel_id
        GROUP BY p.id
        ORDER BY p.id ASC
      `);
      return { success: true, data: rows };
    } catch (err: any) {
      return reply.status(500).send({ success: false, message: err.message, data: [] });
    }
  });

  fastify.get('/api/permissoes', { preHandler: authenticate }, async (request, reply) => {
    try {
      const [rows] = await poolConnection.query(`SELECT * FROM permissoes ORDER BY id ASC`);
      return { success: true, data: rows };
    } catch (err: any) {
      return reply.status(500).send({ success: false, message: err.message, data: [] });
    }
  });

  // IntegraÃ§Ã£o com o Vite (Modo Dev) ou Static (Modo Prod)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // Middleware do Vite para desenvolvimento (bypassa /api para as rotas do Fastify)
    fastify.use((req, res, next) => {
      const url = req.originalUrl || req.url || '';
      if (url.startsWith('/api/') || url === '/api') {
        return next();
      }
      vite.middlewares(req, res, next);
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    await fastify.register(fastifyStatic, {
      root: distPath,
      wildcard: false,
    });
    
    // Fallback para SPA em produÃ§Ã£o
    fastify.get('*', async (request, reply) => {
      if (request.url.startsWith('/api/') || request.url === '/api') {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: `Rota ${request.method}:${request.url} não encontrada`,
        });
      }
      return reply.sendFile('index.html');
    });
  }

  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();
