import Fastify from 'fastify';
import middie from '@fastify/middie';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const fastify = Fastify({ logger: true });
  const PORT = 3000;

  // Registrar middie para middlewares no estilo Express (necessÃ¡rio para o Vite)
  await fastify.register(middie);

  // Rotas de API devem vir ANTES do middleware do Vite
  fastify.get('/api/health', async (request, reply) => {
    return { status: 'ok', message: 'API rodando perfeitamente!' };
  });

  // IntegraÃ§Ã£o com o Vite (Modo Dev) ou Static (Modo Prod)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // Middleware do Vite para desenvolvimento
    fastify.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    await fastify.register(fastifyStatic, {
      root: distPath,
      wildcard: false,
    });
    
    // Fallback para SPA em produÃ§Ã£o
    fastify.get('*', async (request, reply) => {
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
