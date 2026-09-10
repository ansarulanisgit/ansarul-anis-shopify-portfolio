-- Seed Data for Freelance Shopify Developer Portfolio
-- Run after schema.sql

-- 1. Services
INSERT INTO public.services (id, title, hook, description, icon, order_index, featured) VALUES
('a1000000-0000-0000-0000-000000000001', 'Shopify Store Design & Development', 'Custom Shopify stores built to convert, not just look good.', 'Bespoke Liquid theme development crafted for high speed, bespoke brand identity, and seamless mobile purchasing experience.', 'ShoppingBag', 1, true),
('a1000000-0000-0000-0000-000000000002', 'High-Converting Landing Pages', 'Landing pages engineered to turn clicks into customers.', 'Direct-response product and bundle landing pages built with data-driven UX principles, rapid load times, and custom checkout flows.', 'Target', 2, true),
('a1000000-0000-0000-0000-000000000003', 'Headless Shopify Storefronts', 'Custom-built storefronts using Shopify''s Storefront API.', 'Ultra-modern headless e-commerce architectures using Next.js and Shopify Storefront API for sub-second page transitions.', 'Code2', 3, true),
('a1000000-0000-0000-0000-000000000004', 'Platform Migrations to Shopify', 'Seamless migration from WooCommerce, Magento, or BigCommerce.', 'Complete product catalog, customer history, order data, and 301 redirect mapping to protect your SEO rankings without downtime.', 'ArrowRightLeft', 4, false),
('a1000000-0000-0000-0000-000000000005', 'Shopify Plus & B2B Wholesale Builds', 'Custom pricing, wholesale portals, and complex checkout logic.', 'Enterprise wholesale solutions utilizing Shopify Plus features, custom checkout rules, and tiered catalog access.', 'Building2', 5, false),
('a1000000-0000-0000-0000-000000000006', 'Custom App & API Integrations', 'Connect Shopify to the tools your business actually runs on.', 'Custom private apps integrating ERPs, CRMs (HubSpot/Salesforce), fulfillment centers, and proprietary warehouse APIs.', 'Cpu', 6, false),
('a1000000-0000-0000-0000-000000000007', 'Subscription & Membership Commerce', 'Turn one-time buyers into recurring revenue.', 'Recharge, Smartrr, and Shopify Subscriptions integrations designed for high customer retention and seamless subscriber portals.', 'Repeat', 7, false),
('a1000000-0000-0000-0000-000000000008', 'AI-Powered Store Features', 'Smarter storefronts with AI built in.', 'AI-driven personalized product recommendations, visual search, dynamic smart search, and predictive sizing assistants.', 'Sparkles', 8, false),
('a1000000-0000-0000-0000-000000000009', 'Speed & Technical SEO Optimization', 'Faster stores rank higher and convert better.', 'Core Web Vitals auditing, asset minification, script deferral, structured schema markup, and Google Lighthouse 95+ tuning.', 'Zap', 9, false)
ON CONFLICT (id) DO NOTHING;

-- 2. Projects / Case Studies
INSERT INTO public.projects (id, title, slug, summary, problem, solution, result, tech_stack, live_url, order_index, status, featured) VALUES
('b1000000-0000-0000-0000-000000000001', 'Aura Botanicals - Organic Skincare Storefront', 'aura-botanicals-storefront', 'Custom Shopify theme redesign with 3.8x mobile conversion lift and sub-second load times.', 
 'Aura Botanicals had a sluggish commercial theme with heavy app bloat, causing an 8-second mobile load time and a high bounce rate (68%). Mobile customers struggled with confusing ingredient navigation.',
 'Engineered a custom Shopify 2.0 theme using modern Liquid, Tailwind CSS, and vanilla JavaScript. Stripped out 12 redundant third-party apps by writing native bundle and upsell functionality.',
 'Decreased mobile load time from 8.2s to 1.1s. Mobile conversion rate skyrocketed from 1.4% to 3.8% (+171%), generating an additional $185,000 in revenue during the first 90 days.',
 ARRAY['Shopify 2.0', 'Liquid', 'Tailwind CSS', 'Alpine.js', 'Core Web Vitals'], 'https://example.com', 1, 'published', true),

('b1000000-0000-0000-0000-000000000002', 'Veloce Cycling Gear - Direct Response Landing Page', 'veloce-cycling-landing-page', 'High-converting product launch funnel engineered for paid Meta and TikTok traffic.', 
 'Veloce Cycling was launching their flagship aerodynamic helmet. Sending paid traffic directly to their generic product page was yielding an unprofitable $84 cost-per-acquisition (CPA).',
 'Designed and built a dedicated, direct-response landing page with sticky ATC, dynamic quantity tier discounts, interactive 360 review showcase, and one-click checkout integration.',
 'Slashed CPA down from $84 to $39 (-53%). The launch campaign generated over $320,000 in sales within 3 weeks with a 5.2% page conversion rate.',
 ARRAY['Shopify', 'Next.js', 'Framer Motion', 'Tailwind CSS', 'Meta Pixel'], 'https://example.com', 2, 'published', true),

('b1000000-0000-0000-0000-000000000003', 'Nordic Home Decor - Headless Shopify Store', 'nordic-home-decor-headless', 'Headless e-commerce platform with instantaneous filtering and 3D AR product visualizer.', 
 'Nordic Home wanted an editorial luxury experience with instant category filtering across 4,000+ SKUs and an augmented reality 3D furniture preview that regular Shopify themes could not handle smoothly.',
 'Architected a headless storefront powered by Next.js App Router, Shopify Storefront GraphQL API, and Three.js for interactive 3D model rendering.',
 'Achieved a perfect 98/100 Google Lighthouse score. Average session duration doubled, and AR-engaged users converted at 6.4%.',
 ARRAY['Next.js', 'Shopify Storefront API', 'GraphQL', 'Tailwind CSS', 'Three.js'], 'https://example.com', 3, 'published', true)
ON CONFLICT (id) DO NOTHING;

-- 2.1 Project Images
INSERT INTO public.project_images (id, project_id, image_url, alt_text, order_index) VALUES
('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80', 'Aura Botanicals Shopify Store Design for Organic Skincare', 1),
('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80', 'Veloce Cycling High-Converting Landing Page for Sports Retail', 1),
('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80', 'Nordic Home Decor Headless Shopify Storefront for Luxury Furniture', 1)
ON CONFLICT (id) DO NOTHING;

-- 3. Testimonials
INSERT INTO public.testimonials (id, client_name, client_company, quote, avatar_url, order_index, featured) VALUES
('d1000000-0000-0000-0000-000000000001', 'Sarah Jenkins', 'Founder, Aura Botanicals', 'Working together was the single best investment we made for our brand. Our mobile conversion rate literally tripled within three weeks of launching the new theme.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', 1, true),
('d1000000-0000-0000-0000-000000000002', 'Marcus Vance', 'Head of Growth, Veloce Gear', 'The landing page built for our product drop performed at 5.2% conversion on cold paid traffic. The code is spotless, lighting-fast, and exceeded all our KPI targets.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 2, true),
('d1000000-0000-0000-0000-000000000003', 'Elena Rostova', 'Creative Director, Nordic Living', 'Exceptional eye for design paired with deep technical mastery of the Shopify API. Delivered ahead of schedule with zero post-launch bugs.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 3, true)
ON CONFLICT (id) DO NOTHING;

-- 4. FAQs
INSERT INTO public.faqs (id, question, answer, order_index) VALUES
('e1000000-0000-0000-0000-000000000001', 'What is your typical project timeline for a custom Shopify store?', 'A standard custom Shopify 2.0 store build typically takes 3 to 5 weeks from kickoff to launch. Single high-converting landing pages are delivered in 5 to 7 business days. Complex headless or enterprise builds generally run 6 to 8 weeks.', 1),
('e1000000-0000-0000-0000-000000000002', 'How does your pricing model work?', 'I work primarily on fixed-price project quotes so you never encounter surprise billing. Landing pages typically start at $1,500, full custom store builds start at $3,500, and headless or enterprise integrations start at $6,000. All quotes include testing, migration, and post-launch support.', 2),
('e1000000-0000-0000-0000-000000000003', 'What is your development and revision process?', 'We begin with a strategic discovery call to establish your brand goals and conversion bottlenecks. Next, I present interactive Figma prototypes for feedback. Once approved, I build the custom theme or page in a staging environment, conduct rigorous cross-browser and mobile testing, and perform a seamless live migration with 2 rounds of included revisions.', 3),
('e1000000-0000-0000-0000-000000000004', 'Will I be able to edit and update content myself after launch?', 'Absolutely! All themes and sections are built natively with Shopify 2.0 theme architecture (JSON templates and customizable schema blocks). You and your marketing team will be able to change text, images, products, and banners effortlessly without writing a line of code.', 4),
('e1000000-0000-0000-0000-000000000005', 'Do you provide ongoing support after the site launches?', 'Yes! Every project includes 30 days of complimentary post-launch support covering bug fixes, minor tweaks, and walkthrough training. For brands seeking continuous conversion rate optimization and ongoing feature rollouts, I also offer monthly retainer packages.', 5)
ON CONFLICT (id) DO NOTHING;

-- 5. Site Settings
INSERT INTO public.site_settings (key, value) VALUES
('general', '{
  "site_name": "DevShopify",
  "nav_cta_label": "Let''s Talk",
  "social_links": [
    {"platform": "Twitter", "url": "https://twitter.com"},
    {"platform": "LinkedIn", "url": "https://linkedin.com"},
    {"platform": "GitHub", "url": "https://github.com"}
  ]
}'::jsonb),
('hero', '{
  "hero_eyebrow": "Shopify Developer & Landing Page Specialist",
  "hero_headline": "Shopify Website Design That Converts",
  "hero_subheadline": "I build high-converting Shopify stores, bespoke landing pages, and lightning-fast e-commerce experiences engineered to turn traffic into revenue.",
  "hero_primary_cta_label": "View My Work",
  "hero_secondary_cta_label": "Chat on WhatsApp",
  "hero_graphic_url": ""
}'::jsonb),
('trust_bar', '{
  "trust_stats": [
    {"value": "4+", "label": "Years Freelancing"},
    {"value": "35+", "label": "Shopify Stores Built"},
    {"value": "99.8%", "label": "Client Satisfaction"},
    {"value": "3.4x", "label": "Avg. Conversion Lift"}
  ]
}'::jsonb),
('about', '{
  "about_photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  "about_text": [
    "I am a freelance Shopify store & landing page developer with over 4 years of dedicated experience crafting high-performing e-commerce storefronts for DTC brands across the US, UK, and Europe.",
    "Unlike traditional developers who merely install generic templates, I combine direct-response conversion rate optimization (CRO) principles with clean, modular Liquid and React engineering to drive measurable revenue growth.",
    "From optimizing Core Web Vitals to building custom checkout flows and headless architectures, my focus is delivering stores that rank high, load fast, and convert visitors into loyal buyers."
  ],
  "availability_line": "Currently booking for this month",
  "about_tools": ["Shopify 2.0", "Liquid", "React / Next.js", "Tailwind CSS", "Storefront API", "Figma", "Klaviyo", "Recharge"]
}'::jsonb),
('contact', '{
  "whatsapp_number": "+1234567890",
  "whatsapp_message": "Hi! I visited your portfolio and I would like to discuss a Shopify project."
}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 6. SEO Meta
INSERT INTO public.seo_meta (page_key, meta_title, meta_description, og_image_url) VALUES
('home', 
 'Shopify Website Design & Development | High-Converting E-Commerce Stores',
 'Freelance Shopify developer specializing in custom Shopify store design, high-converting landing pages, theme development, and speed optimization.',
 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80')
ON CONFLICT (page_key) DO NOTHING;
