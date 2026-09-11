import { PageSection, SectionType } from '@/types/database.types';

export type { SectionType };

export interface SectionCapability {
  supportsContent: boolean;
  supportsLayout: boolean;
  supportsStyle: boolean;
  supportsTypography: boolean;
  supportsSpacing: boolean;
  supportsAnimation: boolean;
  supportsVisibility: boolean;
  supportsBlocks?: boolean;
}

export type BlockType = 'text' | 'image' | 'button' | 'stat' | 'card';

export interface ContentBlock {
  id: string;
  type: BlockType;
  title?: string;
  text?: string;
  image_url?: string;
  button_label?: string;
  button_url?: string;
  stat_value?: string;
  stat_label?: string;
  icon?: string;
  link_url?: string;
}

export interface SectionSettings {
  // Content
  eyebrow?: string;
  heading?: string;
  heading_prefix?: string;
  rotating_words?: string[];
  hero_trust_chips?: string[];
  subheading?: string;
  description?: string;
  primary_cta_label?: string;
  primary_cta_url?: string;
  secondary_cta_label?: string;
  secondary_cta_url?: string;
  image_url?: string;
  image_alt?: string;
  image_position?: 'left' | 'right' | 'top' | 'background';
  video_url?: string;
  blocks?: ContentBlock[];
  
  // Specific Section Toggles
  show_heading?: boolean;
  show_subheading?: boolean;
  featured_count?: number;
  carousel_autoplay?: boolean;
  carousel_speed?: number; // ms
  pause_on_hover?: boolean;
  accordion_allow_multiple?: boolean;
  sticky_nav?: boolean;
  transparent_over_hero?: boolean;
  show_social_icons?: boolean;
  show_theme_toggle?: boolean;
  whatsapp_prefill?: string;
  whatsapp_number?: string;
  availability_line?: string;
  tools?: string[];
  badge_top_title?: string;
  badge_top_subtitle?: string;
  badge_bottom_title?: string;
  badge_bottom_subtitle?: string;
  copyright_text?: string;
  nav_title?: string;
  connect_title?: string;
  back_to_top_text?: string;
  nav_links?: Array<{ label: string; href: string }>;
  show_filters?: boolean;
  quote_icon?: string;
  
  // Layout
  layout?:
    | 'contained'
    | 'full'
    | 'two-column'
    | 'three-column'
    | 'four-column'
    | 'grid'
    | 'centered'
    | 'left'
    | 'image-left'
    | 'image-right';
  stack_on_mobile?: boolean;
  columns?: 1 | 2 | 3 | 4;
  content_width?: 'narrow' | 'normal' | 'wide' | 'full';

  // Style
  background?:
    | 'default'
    | 'white'
    | 'light'
    | 'dark'
    | 'accent'
    | 'muted'
    | 'gradient-subtle'
    | 'gradient-card'
    | 'gradient-radial'
    | 'gradient-accent'
    | 'gradient-vibrant'
    | 'custom';
  custom_bg?: string;
  text_color?: 'default' | 'light' | 'dark' | 'accent' | 'custom';
  custom_text_color?: string;
  card_style?: 'flat' | 'border' | 'soft-shadow' | 'strong-shadow' | 'glass' | 'elevated';
  border_radius?: 'none' | 'small' | 'medium' | 'large' | 'full';

  // Typography
  heading_size?: 'sm' | 'md' | 'lg' | 'xl';
  heading_weight?: 'normal' | 'semibold' | 'bold' | 'extrabold';
  body_size?: 'sm' | 'md' | 'lg';
  alignment?: 'left' | 'center' | 'right';

  // Spacing
  spacing_top?: 'none' | 'compact' | 'normal' | 'spacious' | 'extra';
  spacing_bottom?: 'none' | 'compact' | 'normal' | 'spacious' | 'extra';
  inner_padding?: 'none' | 'small' | 'normal' | 'large';

  // Animation
  animation?:
    | 'none'
    | 'fade'
    | 'fade-up'
    | 'fade-down'
    | 'fade-left'
    | 'fade-right'
    | 'scale'
    | 'stagger';
  animation_speed?: 'slow' | 'normal' | 'fast';
  animation_intensity?: 'subtle' | 'normal' | 'strong';

  // Custom CSS identifier
  custom_class?: string;
  custom_id?: string;
}

export interface SectionDefinition {
  type: SectionType;
  title: string;
  description: string;
  category: 'core' | 'content' | 'media' | 'layout';
  iconName: string;
  capabilities: SectionCapability;
  defaultSettings: SectionSettings;
}
