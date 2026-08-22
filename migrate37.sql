-- Migration 37: user reviews on businesses
-- Existing testimonial rows stay approved; user-submitted reviews start pending.
-- One review per user per business (user_id NULL = admin/legacy rows).
ALTER TABLE business_testimonials
  ADD COLUMN user_id INT NULL AFTER business_id,
  ADD COLUMN status VARCHAR(10) NOT NULL DEFAULT 'approved' AFTER review,
  ADD UNIQUE KEY uq_review_biz_user (business_id, user_id);
