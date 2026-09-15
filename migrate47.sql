-- Migration 47: Jobs AI usage logging (additive only; no existing table altered).
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(60) NOT NULL,
    provider VARCHAR(30) NOT NULL,
    ok TINYINT(1) NOT NULL DEFAULT 1,
    meta TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
