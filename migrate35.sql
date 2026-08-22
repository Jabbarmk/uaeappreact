-- Migration 35: featured flag on products (featured list first in the storefront)
ALTER TABLE business_products ADD COLUMN featured TINYINT(1) NOT NULL DEFAULT 0 AFTER status;
