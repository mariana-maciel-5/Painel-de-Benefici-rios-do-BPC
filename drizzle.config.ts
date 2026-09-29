import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const connectionUrl = process.env.DATABASE_URL || (
  process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME
    ? `mysql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD || '')}@${process.env.DB_HOST}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME}`
    : 'mysql://root:root@localhost:3306/bpc_recife'
);

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: connectionUrl,
  },
});
