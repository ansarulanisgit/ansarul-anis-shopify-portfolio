-- Supabase Schema for Freelance Shopify Developer Portfolio
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Projects (Case Studies)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  result TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  live_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Project Images
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Services
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  hook TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'ShoppingBag',
  order_index INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_company TEXT NOT NULL,
  quote TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. FAQs
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Leads Inbox
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  budget_range TEXT,
  project_type TEXT,
  message TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'email_form' CHECK (source IN ('email_form', 'whatsapp')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'won', 'lost')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Site Settings (Key-Value JSONB store)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. SEO Metadata
CREATE TABLE IF NOT EXISTS public.seo_meta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key TEXT UNIQUE NOT NULL,
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  og_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. CTA Events (Analytics tracking)
CREATE TABLE IF NOT EXISTS public.cta_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  source_section TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_status_order ON public.projects(status, order_index);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id, order_index);
CREATE INDEX IF NOT EXISTS idx_services_order ON public.services(order_index);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON public.testimonials(order_index);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON public.faqs(order_index);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cta_events_created_at ON public.cta_events(created_at DESC);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cta_events ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Public Read Policies
CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Public can view project images"
  ON public.project_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view services"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view testimonials"
  ON public.testimonials FOR SELECT
  TO anon, authenticated
  USING (featured = true);

CREATE POLICY "Public can view faqs"
  ON public.faqs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view seo meta"
  ON public.seo_meta FOR SELECT
  TO anon, authenticated
  USING (true);

-- Public Insert Policies
CREATE POLICY "Public can submit contact leads"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can log cta events"
  ON public.cta_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated Admin Policies (Full CRUD on all tables)
CREATE POLICY "Admin full access on projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access on project_images"
  ON public.project_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access on services"
  ON public.services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access on testimonials"
  ON public.testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access on faqs"
  ON public.faqs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access on leads"
  ON public.leads FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access on site_settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access on seo_meta"
  ON public.seo_meta FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access on cta_events"
  ON public.cta_events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 10. Page Sections (Front-End Builder & Dynamic Section Management)
CREATE TABLE IF NOT EXISTS public.page_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key TEXT NOT NULL DEFAULT 'home',
  section_key TEXT UNIQUE NOT NULL,
  section_type TEXT NOT NULL,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  desktop_visible BOOLEAN NOT NULL DEFAULT true,
  tablet_visible BOOLEAN NOT NULL DEFAULT true,
  mobile_visible BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  draft_settings JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_sections_order ON public.page_sections(page_key, order_index);
CREATE INDEX IF NOT EXISTS idx_page_sections_status ON public.page_sections(status, is_enabled);

ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published and enabled page sections"
  ON public.page_sections FOR SELECT
  TO anon, authenticated
  USING (status = 'published' AND is_enabled = true);

CREATE POLICY "Admin full access on page_sections"
  ON public.page_sections FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 11. Enable Supabase Realtime Publication for Tables
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.page_sections;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;


-- Storage bucket setup comment:
-- In Supabase Storage, create a public bucket named "portfolio-assets".
-- Policy: Allow authenticated users to upload/delete, allow public (anon) to read.
