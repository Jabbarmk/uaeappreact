-- migrate21.sql — Per-doctor booking schedule (working days + time slots).
-- Run once. work_days: comma weekday numbers 0=Sun..6=Sat. slots: comma "HH:MM" (24h).
SET NAMES utf8mb4;

ALTER TABLE `doctors` ADD COLUMN `work_days` VARCHAR(20) NOT NULL DEFAULT '1,2,3,4,5';
ALTER TABLE `doctors` ADD COLUMN `slots` VARCHAR(600) NOT NULL DEFAULT '10:00,10:30,11:00,11:30,12:00,14:00,14:30,15:00';

-- A little demo variety.
UPDATE `doctors` SET `work_days`='0,1,2,3,4,6', `slots`='09:00,09:30,10:00,10:30,16:00,16:30,17:00' WHERE id % 3 = 0;
UPDATE `doctors` SET `work_days`='1,2,3,4,5,6', `slots`='11:00,11:30,12:00,12:30,18:00,18:30,19:00' WHERE id % 3 = 1;
