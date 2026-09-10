# Freelance Shopify Store & Landing Page Developer Portfolio

A high-performance, single-page portfolio web app with an integrated content management system (CMS) admin portal, engineered for a freelance Shopify specialist.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript
- **Styling:** Tailwind CSS + custom Deep Navy Theme (`#1B2A4A` base accent)
- **Theme Support:** `next-themes` (Dark/Light Mode with smooth transition)
- **Animations:** Framer Motion (Parallax hero graphic, staggered scroll reveals, reduced motion fallback)
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Supabase Auth, Storage)
- **Data Fetching & Cache:** Incremental Static Regeneration (ISR) + On-Demand `/api/revalidate`
- **Charts:** Recharts (Leads over time, channel source breakdown)
- **Form & Validation:** React Hook Form + Zod + Honeypot anti-spam + API Rate Limiting
- **Drag & Drop:** `@dnd-kit/core` & `@dnd-kit/sortable`

---

## Features

### Public Front-End (`/`)
1. **Dynamic Sticky Navigation:** Transparent over the hero, smoothly transitions to solid glassmorphism with subtle drop shadow on scroll. Includes active section highlighting via `IntersectionObserver`.
2. **High-Converting Hero Section:** Eyebrow label, bold H1, subheadline, dual CTAs ("View My Work" & "Chat on WhatsApp"), and a Framer Motion parallax device mockup that translates vertically at a different rate than text.
3. **Trust Bar Strip:** 4 credibility stats counting up into view (`whileInView`).
4. **Case Studies / Work Grid:** Responsive card grid with tags, cover images, and an interactive case study deep-dive modal detailing Problem, Solution, and Revenue Results.
5. **Services Section:** 3 featured services prominently positioned in the top row, plus an expandable grid revealing specialized Shopify offerings.
6. **Testimonials Carousel:** Auto-playing review slider with pause-on-hover, 5-star badges, and client avatars.
7. **About Section:** Freelancer story, 4+ years background, live availability indicator ("Currently booking for this month"), and tech stack badges.
8. **FAQ Accordion:** Clean, accessible accordion addressing common client hiring questions.
9. **Contact Section & Direct WhatsApp:**
   - Zod-validated form with budget and project type selectors, honeypot spam protection, and server-side rate-limiting.
   - Fixed floating WhatsApp CTA button logging conversion events into `cta_events`.
10. **SEO & Structured Data:** `generateMetadata` pulling from `seo_meta`, OpenGraph preview image, Schema.org `Person` and `ProfessionalService` JSON-LD, `robots.ts` and `sitemap.ts`.

### Admin Dashboard (`/admin`)
- **Protected by Supabase Auth:** Next.js middleware blocks unauthenticated requests and redirects to `/admin/login`.
- **Overview:** High-level metrics, inquiries this month, and recent leads.
- **Projects CRUD:** Add/edit case studies, auto-slug generator, tag inputs, and `@dnd-kit` drag-to-reorder.
- **Services CRUD:** Reorder services, edit hooks/descriptions, and toggle featured placement.
- **Testimonials CRUD:** Manage quote cards, avatars, and featured status with drag-and-drop order.
- **FAQs CRUD:** Add/edit/delete FAQs with custom display ordering.
- **Leads Inbox:** Live search by client name/email, status filtering, source filtering, and inline status updates (`new` / `contacted` / `won` / `lost`).
- **SEO Settings:** Real-time character counters with Google SERP and social share card live previews.
- **Site Settings:** Tabbed editor for General, Hero, Trust Bar, About, and WhatsApp integration.
- **Analytics Dashboard:** Recharts area chart of inquiries over time, source breakdown bar chart, and project engagement table with 7d/30d/90d filters.
- **Media Library:** View and manage uploaded assets in Supabase Storage.

---

## Getting Started

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
RESEND_API_KEY=re_your_resend_api_key
CONTACT_NOTIFICATION_EMAIL=your-email@example.com
REVALIDATE_SECRET_TOKEN=your_custom_secret_token_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note on Demo Mode:**
> If you run the project without setting Supabase credentials, it will automatically run in **Local Demo Mode** using the built-in seed dataset. You can explore the public page and click **"Preview Admin with Demo Credentials"** on `/admin/login` to test the dashboard immediately!

### 3. Run Supabase Database Schema
In your Supabase project's SQL Editor:
1. Copy and execute `supabase/schema.sql` to create all tables, indexes, and Row Level Security policies.
2. Copy and execute `supabase/seed.sql` to populate default services, projects, FAQs, and site settings.
3. In Supabase Storage, create a public bucket named: `portfolio-assets`.

### 4. Create Your Admin Account
In Supabase Dashboard > Authentication > Users:
Click **Add user** > **Create user** with your email and password. You will use these credentials to log in at `/admin/login`.

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to view the admin portal.

---

## Deployment to Vercel

1. Push your repository to GitHub.
2. Import the project in Vercel (`https://vercel.com/new`).
3. Add all environment variables from `.env.local` in the Vercel Project Settings.
4. Deploy!
5. Connect your custom domain and submit `/sitemap.xml` to Google Search Console.
