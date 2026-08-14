-- migrate26: category banners video support
ALTER TABLE category_banners
  ADD COLUMN video VARCHAR(500) NULL AFTER image;
