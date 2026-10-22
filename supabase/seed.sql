-- ============================================================
-- LocalWork — Development Seed Data
-- FOR LOCAL DEVELOPMENT ONLY — Not for production
-- ============================================================

-- Service Categories
INSERT INTO public.service_categories (id, name, slug, description, icon, is_active, sort_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Plumbing', 'plumbing', 'Pipe repairs, installations, and water system maintenance', 'Wrench', true, 1),
  ('a1000000-0000-0000-0000-000000000002', 'Electrical', 'electrical', 'Wiring, installations, and electrical repairs', 'Zap', true, 2),
  ('a1000000-0000-0000-0000-000000000003', 'Carpentry', 'carpentry', 'Custom woodwork, furniture repair, and installations', 'Hammer', true, 3),
  ('a1000000-0000-0000-0000-000000000004', 'Painting', 'painting', 'Interior and exterior painting services', 'Paintbrush', true, 4),
  ('a1000000-0000-0000-0000-000000000005', 'Cleaning', 'cleaning', 'Home and office cleaning services', 'Sparkles', true, 5),
  ('a1000000-0000-0000-0000-000000000006', 'Landscaping', 'landscaping', 'Garden design, lawn care, and outdoor maintenance', 'Trees', true, 6),
  ('a1000000-0000-0000-0000-000000000007', 'HVAC', 'hvac', 'Heating, ventilation, and air conditioning services', 'Thermometer', true, 7),
  ('a1000000-0000-0000-0000-000000000008', 'Roofing', 'roofing', 'Roof repair, replacement, and maintenance', 'Home', true, 8),
  ('a1000000-0000-0000-0000-000000000009', 'Moving', 'moving', 'Packing, moving, and relocation services', 'Truck', true, 9),
  ('a1000000-0000-0000-0000-000000000010', 'Photography', 'photography', 'Professional photography for events and portraits', 'Camera', true, 10),
  ('a1000000-0000-0000-0000-000000000011', 'Tutoring', 'tutoring', 'Academic tutoring and skill development', 'GraduationCap', true, 11),
  ('a1000000-0000-0000-0000-000000000012', 'Pet Care', 'pet-care', 'Pet sitting, grooming, and walking services', 'PawPrint', true, 12);

-- NOTE: Do not seed fake users, reviews, or verification records.
-- Users should register through the application.
-- An admin account should be created manually via Supabase dashboard
-- by setting a user's role to 'admin' in the profiles table.
