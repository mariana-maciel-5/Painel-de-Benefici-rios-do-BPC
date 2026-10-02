import 'dotenv/config';
import Fastify from 'fastify';
import middie from '@fastify/middie';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initDatabase } from './src/db/init';
import { runSeed } from './src/db/seed';
import { poolConnection } from './src/db';

async function startServer() {
  const fastify = Fastify({ logger: true });
  const PORT = 3000;

  // Registrar middie para middlewares no estilo Express (necessário para o Vite)
  await fastify.register(middie);

  // Inicializa as tabelas no MySQL se a conexão estiver disponível
  let dbStatus = await initDatabase();

  // Rotas de API devem vir ANTES do middleware do Vite
  fastify.get('/api/health', async (request, reply) => {
    return {
      status: 'ok',
      message: 'API rodando perfeitamente!',
      banco_de_dados: dbStatus,
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

  fastify.get('/api/usuarios', async (request, reply) => {
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

  fastify.get('/api/papeis', async (request, reply) => {
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

  fastify.get('/api/permissoes', async (request, reply) => {
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
