export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProjectStatus = 'draft' | 'published';
export type LeadStatus = 'new' | 'contacted' | 'won' | 'lost';
export type LeadSource = 'email_form' | 'whatsapp';
export type CtaEventType = 'whatsapp_click' | 'form_submit' | 'case_study_click' | 'nav_cta_click';

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          summary: string;
          problem: string;
          solution: string;
          result: string;
          tech_stack: string[];
          live_url: string | null;
          order_index: number;
          status: ProjectStatus;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          summary: string;
          problem: string;
          solution: string;
          result: string;
          tech_stack: string[];
          live_url?: string | null;
          order_index?: number;
          status?: ProjectStatus;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          summary?: string;
          problem?: string;
          solution?: string;
          result?: string;
          tech_stack?: string[];
          live_url?: string | null;
          order_index?: number;
          status?: ProjectStatus;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_images: {
        Row: {
          id: string;
          project_id: string;
          image_url: string;
          alt_text: string;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          image_url: string;
          alt_text?: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          image_url?: string;
          alt_text?: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      services: {
        Row: {
          id: string;
          title: string;
          hook: string;
          description: string;
          icon: string;
          order_index: number;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          hook: string;
          description: string;
          icon: string;
          order_index?: number;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          hook?: string;
          description?: string;
          icon?: string;
          order_index?: number;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          client_company: string;
          quote: string;
          avatar_url: string;
          order_index: number;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          client_company: string;
          quote: string;
          avatar_url: string;
          order_index?: number;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_name?: string;
          client_company?: string;
          quote?: string;
          avatar_url?: string;
          order_index?: number;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          budget_range: string | null;
          project_type: string | null;
          message: string;
          source: LeadSource;
          status: LeadStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          budget_range?: string | null;
          project_type?: string | null;
          message: string;
          source?: LeadSource;
          status?: LeadStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          budget_range?: string | null;
          project_type?: string | null;
          message?: string;
          source?: LeadSource;
          status?: LeadStatus;
          created_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      seo_meta: {
        Row: {
          id: string;
          page_key: string;
          meta_title: string;
          meta_description: string;
          og_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page_key: string;
          meta_title: string;
          meta_description: string;
          og_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          page_key?: string;
          meta_title?: string;
          meta_description?: string;
          og_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      cta_events: {
        Row: {
          id: string;
          event_type: CtaEventType;
          source_section: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type: CtaEventType;
          source_section: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_type?: CtaEventType;
          source_section?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      page_sections: {
        Row: {
          id: string;
          page_key: string;
          section_key: string;
          section_type: string;
          title: string;
          order_index: number;
          is_enabled: boolean;
          is_visible: boolean;
          desktop_visible: boolean;
          tablet_visible: boolean;
          mobile_visible: boolean;
          status: 'draft' | 'published';
          settings: Record<string, any>;
          draft_settings: Record<string, any> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page_key?: string;
          section_key: string;
          section_type: string;
          title: string;
          order_index?: number;
          is_enabled?: boolean;
          is_visible?: boolean;
          desktop_visible?: boolean;
          tablet_visible?: boolean;
          mobile_visible?: boolean;
          status?: 'draft' | 'published';
          settings?: Record<string, any>;
          draft_settings?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          page_key?: string;
          section_key?: string;
          section_type?: string;
          title?: string;
          order_index?: number;
          is_enabled?: boolean;
          is_visible?: boolean;
          desktop_visible?: boolean;
          tablet_visible?: boolean;
          mobile_visible?: boolean;
          status?: 'draft' | 'published';
          settings?: Record<string, any>;
          draft_settings?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      project_status: ProjectStatus;
      lead_status: LeadStatus;
      lead_source: LeadSource;
      cta_event_type: CtaEventType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Convenient Entity Types
export type Project = Database['public']['Tables']['projects']['Row'] & {
  images?: Database['public']['Tables']['project_images']['Row'][];
  category?: string;
};
export type ProjectImage = Database['public']['Tables']['project_images']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type Testimonial = Database['public']['Tables']['testimonials']['Row'];
export type FAQ = Database['public']['Tables']['faqs']['Row'];
export type Lead = Database['public']['Tables']['leads']['Row'];
export type SiteSetting = Database['public']['Tables']['site_settings']['Row'];
export type SeoMeta = Database['public']['Tables']['seo_meta']['Row'];
export type CtaEvent = Database['public']['Tables']['cta_events']['Row'];
export type PageSection = Database['public']['Tables']['page_sections']['Row'];

export type SectionType =
  | 'navigation'
  | 'hero'
  | 'trust_bar'
  | 'work'
  | 'services'
  | 'testimonials'
  | 'about'
  | 'faq'
  | 'contact'
  | 'footer'
  | 'exit_popup'
  | 'cta'
  | 'text_image'
  | 'stats'
  | 'logo_strip'
  | 'gallery'
  | 'video'
  | 'spacer'
  | 'custom';

export interface TrustStat {
  value: string;
  label: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export type ThemePreset =
  | 'crimson'
  | 'navy'
  | 'emerald'
  | 'indigo'
  | 'amber'
  | 'cyberpunk'
  | 'rose'
  | 'monochrome';
export type FontPreset = 'jakarta' | 'outfit' | 'inter' | 'space_grotesk' | 'syne';
export type FontSizeScale = 'sm' | 'md' | 'lg';
export type StylePreset = 'pill' | 'rounded' | 'sharp';

export interface AppearanceSettings {
  theme_preset: ThemePreset;
  font_preset: FontPreset;
  font_size: FontSizeScale;
  style_preset?: StylePreset;
  custom_accent?: string;
}

export interface SiteSettingsMap {
  site_name: string;
  developer_name: string;
  nav_cta_label: string;
  hero_eyebrow: string;
  hero_headline: string;
  hero_headline_prefix?: string;
  hero_rotating_words?: string[];
  hero_trust_chips?: string[];
  hero_subheadline: string;
  hero_primary_cta_label: string;
  hero_secondary_cta_label: string;
  hero_secondary_cta_url?: string;
  hero_graphic_url: string;
  whatsapp_number: string;
  whatsapp_message: string;
  about_photo_url: string;
  about_text: string[];
  availability_line: string;
  about_tools: string[];
  social_links: SocialLink[];
  trust_stats: TrustStat[];
  appearance: AppearanceSettings;
  exit_popup_enabled?: boolean;
  exit_popup_eyebrow?: string;
  exit_popup_title?: string;
  exit_popup_subheading?: string;
  exit_popup_whatsapp_label?: string;
  exit_popup_whatsapp_tag?: string;
  exit_popup_submit_label?: string;
  notification_email?: string;
  email_sender_name?: string;
  email_subject_template?: string;
  email_header_title?: string;
  email_template_style?: 'modern' | 'minimal' | 'executive';
  email_accent_color?: string;
  email_provider?: 'smtp' | 'resend';
  smtp_host?: string;
  smtp_port?: number | string;
  smtp_user?: string;
  smtp_pass?: string;
  resend_api_key?: string;
}
