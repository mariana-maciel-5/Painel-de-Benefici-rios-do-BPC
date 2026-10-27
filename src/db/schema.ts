import { mysqlTable, varchar, timestamp, int, boolean, primaryKey, decimal, date } from 'drizzle-orm/mysql-core';

export const usuarios = mysqlTable('usuarios', {
  id: int('id').primaryKey().autoincrement(),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  senha: varchar('senha', { length: 255 }).notNull(),
  ativo: boolean('ativo').default(true).notNull(),
  data_criacao: timestamp('data_criacao').defaultNow().notNull(),
  data_atualizacao: timestamp('data_atualizacao').defaultNow().onUpdateNow().notNull(),
});

export const papeis = mysqlTable('papeis', {
  id: int('id').primaryKey().autoincrement(),
  nome: varchar('nome', { length: 255 }).notNull(),
  descricao: varchar('descricao', { length: 255 }),
  data_criacao: timestamp('data_criacao').defaultNow().notNull(),
  data_atualizacao: timestamp('data_atualizacao').defaultNow().onUpdateNow().notNull(),
});

export const permissoes = mysqlTable('permissoes', {
  id: int('id').primaryKey().autoincrement(),
  nome: varchar('nome', { length: 255 }).notNull(),
  descricao: varchar('descricao', { length: 255 }),
  data_criacao: timestamp('data_criacao').defaultNow().notNull(),
  data_atualizacao: timestamp('data_atualizacao').defaultNow().onUpdateNow().notNull(),
});

export const usuario_papel = mysqlTable('usuario_papel', {
  usuario_id: int('usuario_id').notNull().references(() => usuarios.id),
  papel_id: int('papel_id').notNull().references(() => papeis.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.usuario_id, t.papel_id] }),
}));

export const papel_permissao = mysqlTable('papel_permissao', {
  papel_id: int('papel_id').notNull().references(() => papeis.id),
  permissao_id: int('permissao_id').notNull().references(() => permissoes.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.papel_id, t.permissao_id] }),
}));

export const beneficiarios = mysqlTable('beneficiarios', {
  id: int('id').primaryKey().autoincrement(),
  nome: varchar('nome', { length: 255 }).notNull(),
  cpf: varchar('cpf', { length: 14 }),
  nis: varchar('nis', { length: 11 }),
  valor_beneficio: decimal('valor_beneficio', { precision: 10, scale: 2 }).notNull(),
  data_concessao: date('data_concessao').notNull(),
  ativo: boolean('ativo').default(true).notNull(),
  tipo_beneficio: varchar('tipo_beneficio', { length: 50 }).default('Idoso').notNull(),
  bairro: varchar('bairro', { length: 100 }),
  data_criacao: timestamp('data_criacao').defaultNow().notNull(),
  data_atualizacao: timestamp('data_atualizacao').defaultNow().onUpdateNow().notNull(),
});
