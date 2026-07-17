-- migrate4.sql — OTP-only auth: allow accounts with no password.
-- The password_hash column is KEPT (not dropped) but made nullable so users
-- can sign up / exist without a password. Run once.

ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL;
