import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV === 'production') {
  console.warn('DATABASE_URL is not set. Database connection will fail.');
}

// Em ambiente de preview sem banco de dados, nÃ£o queremos estourar erro imediatamente.
export const poolConnection = connectionString ? mysql.createPool(connectionString) : null;
export const db = poolConnection ? drizzle(poolConnection, { schema, mode: 'default' }) : null;
