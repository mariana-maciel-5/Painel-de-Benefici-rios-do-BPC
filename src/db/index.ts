import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;
const hasIndividualConfig = process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME;

const poolConfig = connectionString || (hasIndividualConfig ? {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
} : null);

if (!poolConfig && process.env.NODE_ENV === 'production') {
  console.warn('Variáveis de conexão com o banco MySQL não foram informadas. Configure DATABASE_URL ou DB_HOST, DB_USER, DB_NAME.');
}

// Em ambiente de preview sem banco de dados configurado, não queremos estourar erro imediatamente.
export const poolConnection = poolConfig ? mysql.createPool(poolConfig as any) : null;
export const db = poolConnection ? drizzle(poolConnection, { schema, mode: 'default' }) : null;
