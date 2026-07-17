"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = query;
exports.queryOne = queryOne;
const promise_1 = __importDefault(require("mysql2/promise"));
const pool = promise_1.default.createPool({
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
exports.default = pool;
async function query(sql, params) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}
async function queryOne(sql, params) {
    const rows = await query(sql, params);
    return rows[0] ?? null;
}
