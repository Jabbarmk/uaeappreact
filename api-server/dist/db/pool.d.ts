import mysql from 'mysql2/promise';
declare const pool: mysql.Pool;
export default pool;
export declare function query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;
export declare function queryOne<T = unknown>(sql: string, params?: unknown[]): Promise<T | null>;
