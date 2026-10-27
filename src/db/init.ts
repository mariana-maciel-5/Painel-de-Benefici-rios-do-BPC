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

      // 6. Tabela beneficiarios (com suporte a filtros de bairro e período)
      await connection.query(`
        CREATE TABLE IF NOT EXISTS beneficiarios (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          cpf VARCHAR(14),
          nis VARCHAR(11),
          valor_beneficio DECIMAL(10, 2) NOT NULL,
          data_concessao DATE NOT NULL,
          data_solicitacao DATE,
          data_revisao DATE,
          ativo BOOLEAN NOT NULL DEFAULT TRUE,
          tipo_beneficio VARCHAR(50) NOT NULL DEFAULT 'Idoso',
          bairro VARCHAR(100) NOT NULL DEFAULT 'Recife',
          rpa VARCHAR(20),
          data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_bairro (bairro),
          INDEX idx_data_concessao (data_concessao)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // Migração suave de colunas para tabelas beneficiarios criadas anteriormente
      try {
        await connection.query(`ALTER TABLE beneficiarios ADD COLUMN IF NOT EXISTS rpa VARCHAR(20) AFTER bairro;`);
        await connection.query(`ALTER TABLE beneficiarios ADD COLUMN IF NOT EXISTS data_solicitacao DATE AFTER data_concessao;`);
        await connection.query(`ALTER TABLE beneficiarios ADD COLUMN IF NOT EXISTS data_revisao DATE AFTER data_solicitacao;`);
      } catch (alterErr) {
        // Se a versão do MySQL não suportar IF NOT EXISTS em ALTER, tenta comandos individuais protegidos
        try { await connection.query(`ALTER TABLE beneficiarios ADD COLUMN rpa VARCHAR(20);`); } catch {}
        try { await connection.query(`ALTER TABLE beneficiarios ADD COLUMN data_solicitacao DATE;`); } catch {}
        try { await connection.query(`ALTER TABLE beneficiarios ADD COLUMN data_revisao DATE;`); } catch {}
      }

      // 7. Tabela indicadores
      await connection.query(`
        CREATE TABLE IF NOT EXISTS indicadores (
          id INT AUTO_INCREMENT PRIMARY KEY,
          mes_referencia VARCHAR(20) NOT NULL,
          total_beneficiarios INT NOT NULL,
          num_idosos INT NOT NULL,
          num_pcd INT NOT NULL,
          num_ativos INT NOT NULL DEFAULT 0,
          num_inativos INT NOT NULL DEFAULT 0,
          valor_total_repassado DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
          taxa_idosos DECIMAL(5, 2) DEFAULT 0.00,
          taxa_pcd DECIMAL(5, 2) DEFAULT 0.00,
          bairro_destaque VARCHAR(100),
          data_calculo TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
