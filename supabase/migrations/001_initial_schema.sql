-- ============================================================
-- LocalWork Database Migration
-- Complete schema with RLS policies
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES (linked to Supabase Auth)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'professional', 'admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- ============================================================
-- 2. SERVICE CATEGORIES
-- ============================================================
CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_slug ON public.service_categories(slug);
CREATE INDEX idx_categories_active ON public.service_categories(is_active);

-- ============================================================
-- 3. PROFESSIONAL PROFILES
-- ============================================================
CREATE TABLE public.professional_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  headline TEXT NOT NULL,
  bio TEXT,
  years_experience INT NOT NULL DEFAULT 0 CHECK (years_experience >= 0),
  hourly_rate DECIMAL(10,2) CHECK (hourly_rate >= 0),
  city TEXT NOT NULL,
  service_area TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  verification_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id),
  rejection_reason TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_prof_user_id ON public.professional_profiles(user_id);
CREATE INDEX idx_prof_status ON public.professional_profiles(verification_status);
CREATE INDEX idx_prof_city ON public.professional_profiles(city);
CREATE INDEX idx_prof_available ON public.professional_profiles(is_available);

-- ============================================================
-- 4. PROFESSIONAL ↔ CATEGORY JUNCTION
-- ============================================================
CREATE TABLE public.professional_categories (
  professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (professional_id, category_id)
);

-- ============================================================
-- 5. PORTFOLIO IMAGES
-- ============================================================
CREATE TABLE public.portfolio_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_portfolio_prof ON public.portfolio_images(professional_id);

-- ============================================================
-- 6. SERVICE REQUESTS
-- ============================================================
CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.service_categories(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  preferred_date DATE,
  budget DECIMAL(10,2) CHECK (budget >= 0),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled')),
  status_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_requests_customer ON public.service_requests(customer_id);
CREATE INDEX idx_requests_professional ON public.service_requests(professional_id);
CREATE INDEX idx_requests_status ON public.service_requests(status);

-- ============================================================
-- 7. REVIEWS
-- ============================================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL UNIQUE REFERENCES public.service_requests(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_professional ON public.reviews(professional_id);
CREATE INDEX idx_reviews_customer ON public.reviews(customer_id);
-- UNIQUE on request_id already enforced in table definition

-- ============================================================
-- 8. FAVORITES
-- ============================================================
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (customer_id, professional_id)
);

CREATE INDEX idx_favorites_customer ON public.favorites(customer_id);

-- ============================================================
-- 9. NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(user_id, is_read);

-- ============================================================
-- 10. REPORTS
-- ============================================================
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('profile', 'review')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  resolved_by UUID REFERENCES public.profiles(id),
  resolution_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_status ON public.reports(status);

-- ============================================================
-- 11. AUDIT LOG
-- ============================================================
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_actor ON public.audit_log(actor_id);
CREATE INDEX idx_audit_action ON public.audit_log(action);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_professional_profiles
  BEFORE UPDATE ON public.professional_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_service_requests
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_reviews
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_reports
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create profile on signup (triggered by Supabase Auth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper: check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin' AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: get professional avg rating
CREATE OR REPLACE FUNCTION public.get_professional_rating(prof_user_id UUID)
RETURNS TABLE(average_rating NUMERIC, review_count BIGINT) AS $$
  SELECT
    COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0) as average_rating,
    COUNT(r.id) as review_count
  FROM public.reviews r
  WHERE r.professional_id = prof_user_id AND r.is_visible = true;
$$ LANGUAGE sql STABLE;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES POLICIES
-- ============================================================
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- ============================================================
-- SERVICE CATEGORIES POLICIES
-- ============================================================
CREATE POLICY "Categories are viewable by everyone"
  ON public.service_categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage categories"
  ON public.service_categories FOR ALL
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- PROFESSIONAL PROFILES POLICIES
-- ============================================================
CREATE POLICY "Approved professionals are public"
  ON public.professional_profiles FOR SELECT
  USING (
    verification_status = 'approved'
    OR user_id = auth.uid()
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Professionals can insert own profile"
  ON public.professional_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Professionals can update own profile"
  ON public.professional_profiles FOR UPDATE
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (
    CASE
      WHEN user_id = auth.uid() AND NOT public.is_admin(auth.uid()) THEN
        -- Non-admin users cannot change their own verification status
        verification_status = (
          SELECT verification_status FROM public.professional_profiles WHERE user_id = auth.uid()
        )
      ELSE true
    END
  );

-- ============================================================
-- PROFESSIONAL CATEGORIES POLICIES
-- ============================================================
CREATE POLICY "Professional categories are public"
  ON public.professional_categories FOR SELECT
  USING (true);

CREATE POLICY "Professionals can manage own categories"
  ON public.professional_categories FOR INSERT
  WITH CHECK (
    professional_id IN (
      SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Professionals can delete own categories"
  ON public.professional_categories FOR DELETE
  USING (
    professional_id IN (
      SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- PORTFOLIO IMAGES POLICIES
-- ============================================================
CREATE POLICY "Portfolio images are public"
  ON public.portfolio_images FOR SELECT
  USING (true);

CREATE POLICY "Professionals can manage own portfolio"
  ON public.portfolio_images FOR INSERT
  WITH CHECK (
    professional_id IN (
      SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Professionals can update own portfolio"
  ON public.portfolio_images FOR UPDATE
  USING (
    professional_id IN (
      SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Professionals can delete own portfolio"
  ON public.portfolio_images FOR DELETE
  USING (
    professional_id IN (
      SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- SERVICE REQUESTS POLICIES
-- ============================================================
CREATE POLICY "Users can view own requests"
  ON public.service_requests FOR SELECT
  USING (
    customer_id = auth.uid()
    OR professional_id = auth.uid()
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Customers can create requests"
  ON public.service_requests FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Participants can update request status"
  ON public.service_requests FOR UPDATE
  USING (
    customer_id = auth.uid()
    OR professional_id = auth.uid()
    OR public.is_admin(auth.uid())
  );

-- ============================================================
-- REVIEWS POLICIES
-- ============================================================
CREATE POLICY "Visible reviews are public"
  ON public.reviews FOR SELECT
  USING (is_visible = true OR customer_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Customers can create reviews for completed requests"
  ON public.reviews FOR INSERT
  WITH CHECK (
    customer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.service_requests
      WHERE id = request_id
        AND customer_id = auth.uid()
        AND status = 'completed'
    )
  );

CREATE POLICY "Admins can update reviews"
  ON public.reviews FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- FAVORITES POLICIES
-- ============================================================
CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Users can add favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Users can remove own favorites"
  ON public.favorites FOR DELETE
  USING (customer_id = auth.uid());

-- ============================================================
-- NOTIFICATIONS POLICIES
-- ============================================================
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- System/admin can insert notifications (via service role)
CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- REPORTS POLICIES
-- ============================================================
CREATE POLICY "Users can create reports"
  ON public.reports FOR INSERT
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can view own reports"
  ON public.reports FOR SELECT
  USING (reporter_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage reports"
  ON public.reports FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- AUDIT LOG POLICIES
-- ============================================================
CREATE POLICY "Only admins can view audit log"
  ON public.audit_log FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert audit entries"
  ON public.audit_log FOR INSERT
  WITH CHECK (true);
