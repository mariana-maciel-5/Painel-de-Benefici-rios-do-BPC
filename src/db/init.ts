import mysql from 'mysql2/promise';
import { poolConnection } from './index';

export async function initDatabase() {
  if (!poolConnection) {
    return { success: false, message: 'Pool de conexão com o MySQL não está configurado.' };
  }

  const dbName = process.env.DB_NAME || 'bpc_recife_d';

  // Garante que o banco de dados exista antes de criar as tabelas
  try {
    const rawConn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
    });
    await rawConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await rawConn.end();
  } catch (err: any) {
    // Caso use DATABASE_URL remota ou restrita, prossegue para tentar conectar via pool
  }

  try {
    const connection = await poolConnection.getConnection();
    try {
      // 1. Tabela usuarios
      await connection.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          senha VARCHAR(255) NOT NULL,
          ativo BOOLEAN NOT NULL DEFAULT TRUE,
          data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 2. Tabela papeis
      await connection.query(`
        CREATE TABLE IF NOT EXISTS papeis (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          descricao VARCHAR(255),
          data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 3. Tabela permissoes
      await connection.query(`
        CREATE TABLE IF NOT EXISTS permissoes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          descricao VARCHAR(255),
          data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 4. Tabela usuario_papel
      await connection.query(`
        CREATE TABLE IF NOT EXISTS usuario_papel (
          usuario_id INT NOT NULL,
          papel_id INT NOT NULL,
          PRIMARY KEY (usuario_id, papel_id),
          CONSTRAINT fk_usuario_papel_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
          CONSTRAINT fk_usuario_papel_papel FOREIGN KEY (papel_id) REFERENCES papeis (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 5. Tabela papel_permissao
      await connection.query(`
        CREATE TABLE IF NOT EXISTS papel_permissao (
          papel_id INT NOT NULL,
          permissao_id INT NOT NULL,
          PRIMARY KEY (papel_id, permissao_id),
          CONSTRAINT fk_papel_permissao_papel FOREIGN KEY (papel_id) REFERENCES papeis (id) ON DELETE CASCADE,
          CONSTRAINT fk_papel_permissao_permissao FOREIGN KEY (permissao_id) REFERENCES permissoes (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      console.log('✅ Tabelas do banco de dados (MySQL) sincronizadas com sucesso!');
      return { success: true, message: 'Tabelas sincronizadas com sucesso no MySQL.' };
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('❌ Erro ao conectar ou inicializar tabelas no banco MySQL:', error.message);
    return { success: false, message: error.message };
  }
}
