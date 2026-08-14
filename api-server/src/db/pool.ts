import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  ...(process.env.DB_SOCKET
    ? { socketPath: process.env.DB_SOCKET }
    : { host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT) || 3306 }),
  database: process.env.DB_NAME || 'smartuae',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
});

export default pool;

export async function query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]> {
  // pool.query (client-side escaping) instead of pool.execute: MySQL 8 rejects
  // numeric LIMIT/OFFSET placeholders in prepared statements
  // ("Incorrect arguments to mysqld_stmt_execute"); MariaDB accepts them.
  const [rows] = await pool.query(sql, params as import('mysql2').ExecuteValues);
  return rows as T[];
}

export async function queryOne<T = unknown>(sql: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}
