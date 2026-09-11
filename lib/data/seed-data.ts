import { Project, Service, Testimonial, FAQ, SiteSettingsMap, SeoMeta, Lead } from '@/types/database.types';

export const defaultHeroTrustChips: string[] = [
  'Shopify 2.0',
  'Liquid',
  'HTML5/CSS3',
  'JavaScript',
  'Figma/UI/UX',
  'APIs/GraphQL',
  'React/Next.js',
  'Performance and SEO',
  'Apps & Integrations',
  'CRO and Analytics',
  'AI Integration',
];

export const defaultSiteSettings: SiteSettingsMap = {
  site_name: 'AnisShopify',
  developer_name: 'Ansarul Anis',
  nav_cta_label: "Let's Talk",
  hero_eyebrow: 'Shopify Developer & Landing Page Specialist',
  hero_headline: 'Shopify Website Design That',
  hero_headline_prefix: 'Shopify Website Design That',
  hero_rotating_words: [
    'Drives Growth',
    'Boosts Sales',
    'Elevates Brands',
    'Generates Results',
  ],
  hero_trust_chips: defaultHeroTrustChips,
  hero_subheadline: "Hey, I'm Ansarul Anis. A passionate young Shopify developer engineering custom high-converting stores, direct-response landing pages, and lightning-fast themes built to turn traffic into revenue.",
  hero_primary_cta_label: 'View My Work',
  hero_secondary_cta_label: 'Contact Me',
  hero_secondary_cta_url: '#contact',
  hero_graphic_url: '/images/shopify-dashboard.png',
  whatsapp_number: '+8801709260934',
  whatsapp_message: "Hi Anis! I visited AnisShopify and I'd like to discuss a Shopify project.",
  exit_popup_enabled: true,
  exit_popup_eyebrow: 'WAIT! BEFORE YOU GO',
  exit_popup_title: "Let's Build Your Dream Shopify Store",
  exit_popup_subheading: "Get a Free 15-Minute Shopify Audit & Fixed Quote for your project. Reach out on WhatsApp or drop a quick line below!",
  exit_popup_whatsapp_label: 'Chat Instantly on WhatsApp',
  exit_popup_whatsapp_tag: 'Under 20m reply',
  exit_popup_submit_label: 'Get Free Audit & Quote',
  about_photo_url: '/images/ansarul-anis.jpg',
  about_text: [
    "I'm Ansarul Anis — a Shopify expert and young freelance developer who helps brands build Shopify stores that actually convert. From Shopify store design to full Shopify website development, I engineer every pixel for revenue.",
    "Whether you need to create a Shopify store from scratch, launch a Shopify dropshipping store, or redesign an underperforming ecommerce website, I bring direct-response CRO principles, clean Liquid code, and modern React engineering together.",
    "My mission: build Shopify websites that rank high, load in under a second, and turn every visitor into a buyer — no bloated apps, no agency overhead, just results."
  ],
  availability_line: 'Currently booking for this month',
  about_tools: [
    'Shopify Development',
    'Liquid',
    'HTML & CSS',
    'JavaScript',
    'TypeScript',
    'Figma',
    'UI/UX Design',
    'Shopify APIs',
    'GraphQL',
    'React',
    'Next.js',
    'Headless Shopify',
    'Shopify App Development',
    'Shopify CLI',
    'Shopify Theme Development',
    'Performance Optimization',
    'Technical SEO',
    'Third-Party Integrations',
    'Automation',
    'CRO & Analytics',
    'SEO',
  ],
  social_links: [
    { platform: 'LinkedIn', url: 'https://linkedin.com' },
    { platform: 'Facebook', url: 'https://facebook.com' },
    { platform: 'X', url: 'https://x.com' }
  ],
  trust_stats: [
    { value: '4+', label: 'Years Freelancing' },
    { value: '270+', label: 'Shopify Stores Built' },
    { value: '99.8%', label: 'Client Satisfaction' },
    { value: '3.4x', label: 'Avg. Conversion Lift' }
  ],
  appearance: {
    theme_preset: 'crimson',
    font_preset: 'jakarta',
    font_size: 'md',
    style_preset: 'rounded',
    custom_accent: '#FF2A51',
  },
};

export const defaultSeoMeta: SeoMeta = {
  id: 'default-seo',
  page_key: 'home',
  meta_title: 'AnisShopify | Shopify Expert — Shopify Website Design & Ecommerce Website Development',
  meta_description: 'Ansarul Anis (AnisShopify) is a Shopify expert specializing in Shopify store design, Shopify website development, dropshipping stores, ecommerce website builds, and Shopify store redesign for DTC brands.',
  og_image_url: '/images/social-share.jpg',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const defaultServices: Service[] = [
  {
    id: 'srv-1',
    title: 'Shopify Store Design & Development',
    hook: 'Custom Liquid 2.0 storefronts engineered to turn traffic into direct revenue.',
    description: 'Bespoke shopify store design and Liquid theme engineering built from scratch. As a shopify expert, I build shopify websites with sub-second loading, conversion-driven UI/UX, and native section schemas to create shopify store experiences tailored to your brand.',
    icon: 'ShoppingBag',
    order_index: 1,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'srv-2',
    title: 'High-Converting Landing Pages',
    hook: 'Direct-response sales pages built for paid Meta, TikTok, and Google ad traffic.',
    description: 'Maximize ROAS with direct-response shopify website design for paid campaigns. Ideal for shopify dropshipping and DTC product drops with sticky add-to-cart, bundle builders, and one-click checkout to boost your ecommerce website conversions.',
    icon: 'Target',
    order_index: 2,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'srv-3',
    title: 'Headless Shopify Storefronts',
    hook: 'Ultra-fast Next.js & React architectures with unrestricted design freedom.',
    description: 'Build shopify website applications using Next.js, Storefront GraphQL API, and modern React for instantaneous page loads. The ultimate shopify ecommerce website development solution for enterprise product catalogs and headless commerce.',
    icon: 'Code2',
    order_index: 3,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'srv-4',
    title: 'Platform Migrations to Shopify',
    hook: 'Zero-downtime re-platforming from WooCommerce, Magento, or custom CMS.',
    description: 'Execute a full shopify store redesign and seamless migration from WooCommerce, Magento, or BigCommerce. Retain your SEO rankings, customer records, and order history while upgrading to a high-converting shopify ecommerce website.',
    icon: 'ArrowRightLeft',
    order_index: 4,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'srv-5',
    title: 'Shopify Plus & B2B Wholesale Builds',
    hook: 'Custom wholesale portals, tiered volume pricing, and company accounts.',
    description: 'Expand your shopify store with wholesale capabilities. Implement custom matrix order forms, customer-specific tier pricing, net payment terms, and automated invoicing to streamline wholesale ecommerce website sales.',
    icon: 'Building2',
    order_index: 5,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'srv-6',
    title: 'Custom App & API Integrations',
    hook: 'Tailored backend apps, Admin GraphQL API tools, and ERP automation.',
    description: 'Solve complex operational workflows during shopify website development. Build custom private apps, connect ERP systems, synchronize inventory, and automate fulfillment to run your shopify store on autopilot.',
    icon: 'Cpu',
    order_index: 6,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'srv-7',
    title: 'Subscription & Membership Commerce',
    hook: 'Recurring revenue engines powered by Recharge, Smartrr, and custom portals.',
    description: 'Turn one-time shoppers into recurring subscriber LTV. We integrate subscription engines, build custom box builders, and design subscriber portals during complete shopify store setup to scale your ecommerce website.',
    icon: 'Repeat',
    order_index: 7,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'srv-8',
    title: 'AI-Powered Store Features',
    hook: 'Smart search, personalized product recommendations, and automated AI chat.',
    description: 'Infuse cutting-edge AI into your shopify design. Implement personalized upsell recommendations, AI search filtering, and smart chat assistants that increase average order value across your shopify dropshipping store.',
    icon: 'Sparkles',
    order_index: 8,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'srv-9',
    title: 'Speed & Technical SEO Optimization',
    hook: 'Sub-second mobile speed, Lighthouse 95+ scores, and top Google rankings.',
    description: 'Technical SEO and speed tuning for your shopify dropshipping brand or custom shopify website. Audit Liquid rendering loops, purge heavy apps, and implement structured schema to rank high for shopify store redesign keywords.',
    icon: 'Zap',
    order_index: 9,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const defaultProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Aura Botanicals — Shopify Store Redesign',
    slug: 'aura-botanicals-storefront',
    category: 'Ecommerce Store',
    summary: 'Complete high-converting Shopify store redesign with 3.8x mobile conversion lift and sub-second load times. Built with custom Liquid 2.0 theme sections, native upsells, and clean mobile-first UI architecture for an organic skincare brand.',
    problem: 'Aura Botanicals had a sluggish commercial theme with heavy app bloat, causing an 8-second mobile load time and a 68% bounce rate. Their Shopify store design was costing them sales daily.',
    solution: 'Engineered a custom Shopify website using modern Liquid and Tailwind CSS. Stripped 12 redundant apps by building native bundle and upsell functionality — a ground-up Shopify store redesign focused on speed and conversion.',
    result: 'Mobile load time dropped from 8.2s to 1.1s. Mobile conversion rate skyrocketed from 1.4% to 3.8% (+171%), generating $185,000 additional revenue in 90 days.',
    tech_stack: ['Shopify 2.0', 'Liquid', 'Tailwind CSS', 'Alpine.js', 'Core Web Vitals'],
    live_url: 'https://example.com',
    order_index: 1,
    status: 'published',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-1',
        project_id: 'proj-1',
        image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Aura Botanicals Shopify Store Redesign for Organic Skincare Ecommerce',
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'img-1-2',
        project_id: 'proj-1',
        image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Aura Botanicals Mobile Shopify Website Design',
        order_index: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'proj-2',
    title: 'Veloce Cycling — High-Converting Landing Page',
    slug: 'veloce-cycling-landing-page',
    category: 'Product Launch',
    summary: 'Direct-response product launch funnel built for high-volume paid Meta and TikTok advertising campaigns. Features custom Next.js landing page architecture, dynamic quantity tier discounts, and frictionless one-click checkout integration.',
    problem: 'Veloce Cycling was launching their flagship helmet. Sending paid traffic to a generic product page yielded an unprofitable $84 CPA — their Shopify website wasn\'t built for paid acquisition.',
    solution: 'Designed a dedicated Shopify landing page with sticky ATC, dynamic quantity tier discounts, 360° product showcase, and one-click checkout — Shopify website development optimized for dropshipping and DTC funnels.',
    result: 'CPA slashed from $84 to $39 (−53%). Launch generated over $320,000 in sales within 3 weeks at a 5.2% conversion rate.',
    tech_stack: ['Shopify', 'Next.js', 'Framer Motion', 'Tailwind CSS', 'Meta Pixel'],
    live_url: 'https://example.com',
    order_index: 2,
    status: 'published',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-2',
        project_id: 'proj-2',
        image_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Veloce Cycling Shopify Landing Page for Sports Ecommerce',
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'proj-3',
    title: 'Nordic Home — Headless Shopify Ecommerce Website',
    slug: 'nordic-home-decor-headless',
    category: 'Headless Store',
    summary: 'Headless Shopify ecommerce website engineered for luxury home decor catalog with instant filtering across 4,000+ SKUs. Integrated Next.js App Router, Storefront GraphQL API, and Three.js 3D AR product visualization for maximum buyer engagement.',
    problem: 'Nordic Home wanted a premium editorial experience with instant filtering across 4,000+ SKUs and AR furniture preview — standard Shopify store themes couldn\'t handle it.',
    solution: 'Architected a headless Shopify ecommerce website powered by Next.js, Storefront GraphQL API, and Three.js for interactive 3D rendering — the ultimate way to build a Shopify website for complex catalogs.',
    result: 'Achieved a 98/100 Lighthouse score. Session duration doubled and AR-engaged users converted at 6.4%.',
    tech_stack: ['Next.js', 'Shopify Storefront API', 'GraphQL', 'Tailwind CSS', 'Three.js'],
    live_url: 'https://example.com',
    order_index: 3,
    status: 'published',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-3',
        project_id: 'proj-3',
        image_url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Nordic Home Headless Shopify Ecommerce Website for Luxury Furniture',
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'proj-4',
    title: 'Luxe Timepieces — Shopify Plus Store Redesign',
    slug: 'luxe-timepieces-shopify-plus',
    category: 'Shopify Plus Store',
    summary: 'Enterprise Shopify Plus store redesign for a luxury watch brand featuring multi-currency checkout, B2B wholesale portal, and bespoke custom Liquid 2.0 sections engineered for high AOV sales.',
    problem: 'Outdated legacy Magento setup with high maintenance costs and sluggish mobile performance.',
    solution: 'Migrated to Shopify Plus with custom Liquid theme, B2B company accounts, and multi-currency localized checkout.',
    result: 'Decreased page load time by 65% and increased global conversion rates by 42%.',
    tech_stack: ['Shopify Plus', 'Liquid', 'Tailwind CSS', 'JavaScript'],
    live_url: 'https://example.com',
    order_index: 4,
    status: 'published',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-4',
        project_id: 'proj-4',
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Luxe Timepieces Shopify Plus Store Redesign',
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'proj-5',
    title: 'Pulse Audio — High-Converting Product Launch Landing Page',
    slug: 'pulse-audio-launch-landing-page',
    category: 'Landing Page',
    summary: 'Direct-response landing page built for noise-canceling headphone release. Includes sticky add-to-cart, 360-degree interactive product viewer, audio sound comparison widget, and one-click upsells.',
    problem: 'Generic product page had a high bounce rate on paid ad traffic.',
    solution: 'Engineered a dedicated high-converting landing page with direct response UX, sticky buy bar, and customer audio comparisons.',
    result: 'Boosted ROAS from 1.8 to 3.4 on Meta ads with 4.8% conversion rate.',
    tech_stack: ['Shopify', 'React', 'Framer Motion', 'Tailwind CSS'],
    live_url: 'https://example.com',
    order_index: 5,
    status: 'published',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-5',
        project_id: 'proj-5',
        image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Pulse Audio High Converting Product Launch Landing Page',
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'proj-6',
    title: 'Solstice Eyewear — Brand Website & Custom Storefront',
    slug: 'solstice-eyewear-brand-website',
    category: 'Brand Website',
    summary: 'Editorial brand website and custom Shopify 2.0 store for a sustainable eyewear brand. Features virtual try-on integration, custom quiz builder, and rich lifestyle story sections.',
    problem: 'Brand identity was lost in a basic Shopify starter theme with poor storytelling.',
    solution: 'Designed bespoke editorial layout with interactive style quiz and virtual frame fitting.',
    result: 'Increased average order value (AOV) by $38 and doubled average time on site.',
    tech_stack: ['Shopify 2.0', 'Liquid', 'JavaScript', 'Tailwind CSS'],
    live_url: 'https://example.com',
    order_index: 6,
    status: 'published',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-6',
        project_id: 'proj-6',
        image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Solstice Eyewear Brand Website',
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'proj-7',
    title: 'Keto Fuel — High-Volume Dropshipping Store',
    slug: 'keto-fuel-dropshipping-store',
    category: 'Ecommerce Store',
    summary: 'Speed-optimized Shopify dropshipping store engineered for rapid scale and viral TikTok traffic. Integrated sub-second product pages, automated bundle discounts, and fast checkout flows.',
    problem: 'High ad spend bounce rate due to slow mobile loading and generic app popups.',
    solution: 'Rebuilt theme natively without heavy apps, adding built-in quantity breaks and instant cart drawer.',
    result: 'Scaled from $10k to $140k monthly revenue within 60 days of relaunch.',
    tech_stack: ['Shopify', 'Liquid', 'JavaScript', 'CRO & Analytics'],
    live_url: 'https://example.com',
    order_index: 7,
    status: 'published',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-7',
        project_id: 'proj-7',
        image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Keto Fuel High Volume Dropshipping Store',
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'proj-8',
    title: 'Velvet & Vine — Campaign Landing Page & Quiz Funnel',
    slug: 'velvet-vine-campaign-funnel',
    category: 'Campaign',
    summary: 'Seasonal holiday campaign landing page featuring personalized wine pairing quiz, custom bundle builder, and subscription order flow for an artisanal winery ecommerce website.',
    problem: 'Needed a high-converting seasonal campaign for Black Friday and holiday gifting.',
    solution: 'Created a custom wine quiz funnel driving users to curated 3-bottle gift sets with subscription options.',
    result: 'Generated $210,000 in campaign revenue with a 6.1% funnel conversion rate.',
    tech_stack: ['Shopify', 'React', 'GraphQL', 'Tailwind CSS'],
    live_url: 'https://example.com',
    order_index: 8,
    status: 'published',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-8',
        project_id: 'proj-8',
        image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Velvet & Vine Campaign Landing Page',
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'proj-9',
    title: 'Zenith Athletic — Headless Shopify Storefront',
    slug: 'zenith-athletic-headless-store',
    category: 'Headless Store',
    summary: 'Next.js headless Shopify storefront for activewear brand. Built with Storefront GraphQL API, instant search filtering, localized currency switching, and instant edge page caching.',
    problem: 'Standard theme couldn\'t handle complex variant matrix across 25 global regions.',
    solution: 'Architected a Next.js App Router headless store with edge caching and Shopify Storefront GraphQL API.',
    result: 'Achieved 99/100 mobile Lighthouse performance score and 52% higher international conversion.',
    tech_stack: ['Headless Shopify', 'Next.js', 'GraphQL', 'TypeScript'],
    live_url: 'https://example.com',
    order_index: 9,
    status: 'published',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-9',
        project_id: 'proj-9',
        image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Zenith Athletic Headless Shopify Storefront',
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'proj-10',
    title: 'Glow Skin — Shopify Store Setup & Integration',
    slug: 'glow-skin-store-setup',
    category: 'Ecommerce Store',
    summary: 'End-to-end Shopify store setup for luxury skincare brand. Includes custom theme design, Klaviyo email marketing automation, Recharge subscription engine, and Google Analytics 4 tracking.',
    problem: 'New brand needed a complete turnkey store launch ready for paid acquisition.',
    solution: 'Built custom Shopify 2.0 store with subscriber discount flows and seamless checkout.',
    result: 'Launched on time with 22% of initial orders converting into recurring monthly subscriptions.',
    tech_stack: ['Shopify 2.0', 'Liquid', 'Third-Party Integrations', 'CRO & Analytics'],
    live_url: 'https://example.com',
    order_index: 10,
    status: 'published',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-10',
        project_id: 'proj-10',
        image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Glow Skin Shopify Store Setup',
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'proj-11',
    title: 'Aero Tech — Product Launch Funnel & Pre-Order Store',
    slug: 'aero-tech-preorder-funnel',
    category: 'Product Launch',
    summary: 'Crowdfunding and pre-order product launch site for next-gen smartwatch. Built with real-time backer counter, milestone progress bar, and instant deposit checkout flow.',
    problem: 'Needed to collect pre-orders before mass production with strong buyer urgency.',
    solution: 'Designed a high-urgency product launch page with dynamic progress bar and tiered early-bird rewards.',
    result: 'Captured 4,200 pre-orders valued at over $650,000 in 14 days.',
    tech_stack: ['Shopify', 'Liquid', 'JavaScript', 'HTML & CSS'],
    live_url: 'https://example.com',
    order_index: 11,
    status: 'published',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-11',
        project_id: 'proj-11',
        image_url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Aero Tech Product Launch Funnel',
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'proj-12',
    title: 'Artisan Roast — Brand Website & Subscription Store',
    slug: 'artisan-roast-brand-website',
    category: 'Brand Website',
    summary: 'Bespoke brand website and coffee subscription portal. Features interactive coffee grind selector, custom recurring delivery schedule builder, and rich origin story sections.',
    problem: 'High subscriber churn due to rigid subscription setup on old storefront.',
    solution: 'Redesigned subscription onboarding flow with flexible frequency and coffee selection options.',
    result: 'Reduced subscriber churn by 34% and increased customer lifetime value by 48%.',
    tech_stack: ['Shopify 2.0', 'Liquid', 'Figma', 'UI/UX Design'],
    live_url: 'https://example.com',
    order_index: 12,
    status: 'published',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-12',
        project_id: 'proj-12',
        image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Artisan Roast Brand Website',
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  },
  {
    id: 'proj-13',
    title: 'Omni Gear — Enterprise Shopify Plus Migration',
    slug: 'omni-gear-shopify-plus-migration',
    category: 'Shopify Plus Store',
    summary: 'Complex enterprise migration from Magento 2 to Shopify Plus for outdoor apparel retailer. Integrated ERP synchronization, custom matrix variant selector, and multi-warehouse routing.',
    problem: 'Legacy Magento 2 store suffered frequent downtime during flash sales.',
    solution: 'Migrated 15,000 SKUs to Shopify Plus with custom Liquid theme and custom ERP middleware.',
    result: 'Handled 50,000 concurrent visitors on Black Friday with 0% downtime and 1.2s page load.',
    tech_stack: ['Shopify Plus', 'Shopify APIs', 'GraphQL', 'Performance Optimization'],
    live_url: 'https://example.com',
    order_index: 13,
    status: 'published',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-13',
        project_id: 'proj-13',
        image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Omni Gear Enterprise Shopify Plus Migration',
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: 't-1',
    client_name: 'Sarah Jenkins',
    client_company: 'Founder & CMO, Aura Botanicals',
    quote: 'Anis is hands-down the best Shopify expert we have ever worked with. Our previous theme was sluggish, taking over 8 seconds to load on mobile. Anis executed a complete Shopify store redesign and custom Liquid build that slashed our mobile load time down to 1.1s. Our mobile conversion rate jumped from 1.4% to 3.8% within 60 days of relaunching. He is an absolute master at high-converting ecommerce website development!',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    order_index: 1,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 't-2',
    client_name: 'Marcus Vance',
    client_company: 'Head of Acquisition, Veloce Cycling',
    quote: 'We were burning tens of thousands on Meta ads with an unprofitable $84 CPA because our standard Shopify product pages couldn\'t convert paid traffic. Anis designed a bespoke Shopify landing page with sticky ATC, quantity tier discounts, and sub-second checkout. Our CPA dropped to $39 overnight and we generated over $320k in 3 weeks. If you need a Shopify website design that drives real profit, call Anis.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    order_index: 2,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 't-3',
    client_name: 'Elena Rostova',
    client_company: 'Ecommerce Director, Nordic Home',
    quote: 'Building a headless Shopify ecommerce website with 4,000+ SKUs and 3D AR previews seemed daunting until Anis stepped in. His Next.js and Storefront GraphQL architecture achieved a 98/100 mobile Lighthouse score. Session durations doubled and users interacting with the 3D visualizer converted at 6.4%. Anis delivers world-class Shopify website development.',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    order_index: 3,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 't-4',
    client_name: 'David Sterling',
    client_company: 'CEO, Luxe Timepieces',
    quote: 'Migrating our enterprise watch brand from Magento to Shopify Plus was high stakes. Anis handled the entire platform migration seamlessly with zero downtime. He built a custom B2B wholesale portal and localized multi-currency checkout. Global sales are up 42% and our team can finally manage the store without developer overhead.',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    order_index: 4,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 't-5',
    client_name: 'Chloe Bennett',
    client_company: 'Co-Founder, Pulse Audio',
    quote: 'Anis built our product launch funnel on Shopify ahead of our headphone release. The interactive sound comparison tool and 360-degree product viewer he engineered blew our audience away. ROAS on TikTok ad traffic jumped from 1.8 to 3.4. Anis is a true Shopify design genius who understands consumer psychology.',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    order_index: 5,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 't-6',
    client_name: 'Julian Thorne',
    client_company: 'Brand Manager, Solstice Eyewear',
    quote: 'Our old Shopify store felt like every other generic template. Anis took our Figma designs and built a custom Shopify store setup with an interactive style quiz and virtual frame fitting. Our average order value increased by $38 and customer feedback has been incredible!',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    order_index: 6,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 't-7',
    client_name: 'Brandon Hayes',
    client_company: 'Growth Director, Keto Fuel',
    quote: 'When our TikTok video went viral, our old store crashed under the traffic spike. We hired Anis for an emergency Shopify dropshipping store rebuild. He created a lightning-fast theme with zero app bloat that handled 30k visitors simultaneously. We scaled from $10k to $140k monthly revenue in 60 days.',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    order_index: 7,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 't-8',
    client_name: 'Sophia Martinez',
    client_company: 'VP of Marketing, Velvet & Vine',
    quote: 'Anis created a custom holiday campaign funnel with a wine pairing quiz that drove unprecedented sales for our winery. The subscriber order flow he built converted 6.1% of all landing page visitors into recurring monthly wine club members, generating $210,000 during Q4 alone.',
    avatar_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    order_index: 8,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 't-9',
    client_name: 'Liam O\'Connor',
    client_company: 'Operations Lead, Zenith Athletic',
    quote: 'Managing variant matrices across 25 international markets was a nightmare. Anis architected a headless Shopify storefront that handles real-time stock sync and instant localized checkout. International conversion rate surged 52%. He is the most reliable Shopify expert we\'ve hired.',
    avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    order_index: 9,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 't-10',
    client_name: 'Amara Okafor',
    client_company: 'Founder, Glow Skin',
    quote: 'Anis completed our entire turn-key Shopify store setup from scratch, including custom Liquid theme sections, Klaviyo email flows, and Recharge subscriptions. 22% of our launch day customers converted into monthly subscribers. Anis made starting our brand seamless.',
    avatar_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    order_index: 10,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 't-11',
    client_name: 'Tariq Al-Mansoor',
    client_company: 'Founder, Aero Tech',
    quote: 'We needed a high-urgency crowdfunding pre-order store for our new smartwatch. Anis built a custom Shopify landing page with real-time backer counters and tier rewards that generated 4,200 pre-orders worth $650,000 in just 14 days. His shopify website development skills are top-tier.',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    order_index: 11,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 't-12',
    client_name: 'Hannah Croft',
    client_company: 'Director of Digital, Artisan Roast',
    quote: 'Our coffee subscription program was plagued by churn due to rigid checkout steps. Anis redesigned our subscription portal and onboarding wizard on Shopify 2.0. Subscriber churn dropped by 34% and customer LTV jumped by 48%. Working with Anis was the best investment we made this year.',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    order_index: 12,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const defaultFaqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How long does it take to build a Shopify store from scratch?',
    answer: 'A standard custom Shopify store setup takes 3 to 5 weeks from kickoff to launch. Single high-converting landing pages are delivered in 5 to 7 business days. Complex headless or enterprise Shopify ecommerce website development projects typically run 6 to 8 weeks.',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'faq-2',
    question: 'How does your Shopify website development pricing work?',
    answer: 'I work on fixed-price quotes — no surprise billing. Landing pages start at $1,500, full custom Shopify store design builds start at $3,500, and headless or enterprise Shopify ecommerce website projects start at $6,000. All quotes include testing, migration, and post-launch support.',
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'faq-3',
    question: 'What\'s your process to create a Shopify store?',
    answer: 'We start with a strategic discovery call to map your brand goals and conversion bottlenecks. I then present interactive Figma prototypes. Once approved, I build your Shopify website in a staging environment, conduct rigorous cross-browser and mobile testing, and perform a seamless live migration — with 2 rounds of revisions included.',
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'faq-4',
    question: 'Can I manage content myself after the Shopify store setup?',
    answer: 'Absolutely. Every Shopify store I build uses native Shopify 2.0 architecture (JSON templates and customizable schema blocks). Your team can change text, images, products, and banners without writing code.',
    order_index: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'faq-5',
    question: 'Do you build Shopify dropshipping stores?',
    answer: 'Yes! I specialize in Shopify dropshipping store builds optimized for paid traffic acquisition. This includes one-click checkout flows, dynamic upsells, supplier app integrations, and speed-optimized themes designed to maximize AOV and minimize CPA for dropshipping businesses.',
    order_index: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'faq-6',
    question: 'Do you provide support after the Shopify website launches?',
    answer: 'Every project includes 30 days of complimentary post-launch support covering bug fixes, tweaks, and walkthrough training. For brands wanting continuous CRO and feature rollouts, I offer monthly retainer packages.',
    order_index: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const defaultLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Oliver Thorne',
    email: 'oliver@thorneapparel.com',
    budget_range: '$2000-$5000',
    project_type: 'New store',
    message: 'Looking for a full Shopify 2.0 custom theme for our sustainable clothing line launching next month.',
    source: 'email_form',
    status: 'new',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
  },
  {
    id: 'lead-2',
    name: 'Chloe Simmons',
    email: 'chloe@glowcosmetics.co',
    budget_range: '$500-$2000',
    project_type: 'Landing page',
    message: 'Need a high-converting direct response landing page for our vitamin C serum ad campaign.',
    source: 'whatsapp',
    status: 'contacted',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 'lead-3',
    name: 'David Keller',
    email: 'david@kellercoffee.com',
    budget_range: '$5000+',
    project_type: 'Redesign',
    message: 'Our subscription store on Recharge needs a full redesign and speed optimization overhaul.',
    source: 'email_form',
    status: 'won',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
  }
];

