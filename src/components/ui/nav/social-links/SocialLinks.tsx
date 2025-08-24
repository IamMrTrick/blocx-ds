'use client';
import React from 'react';
import { Icon } from '@/components/ui/icon';
import './SocialLinks.scss';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  label?: string;
  username?: string;
  color?: string;
}

export interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
  variant?: 'default' | 'minimal' | 'filled' | 'outlined' | 'floating';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical' | 'grid';
  showLabels?: boolean;
  showUsernames?: boolean;
  animated?: boolean;
  target?: '_blank' | '_self';
  rel?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  links,
  className = '',
  variant = 'default',
  size = 'md',
  layout = 'horizontal',
  showLabels = false,
  showUsernames = false,
  animated = true,
  target = '_blank',
  rel = 'noopener noreferrer',
}) => {
  const handleLinkClick = (link: SocialLink, event: React.MouseEvent) => {
    // Analytics or tracking can be added here
    console.log(`Social link clicked: ${link.platform}`);
  };

  const getPlatformColor = (platform: string): string => {
    const colors: Record<string, string> = {
      facebook: '#1877F2',
      twitter: '#1DA1F2',
      instagram: '#E4405F',
      linkedin: '#0A66C2',
      youtube: '#FF0000',
      github: '#181717',
      discord: '#5865F2',
      telegram: '#0088CC',
      whatsapp: '#25D366',
      tiktok: '#000000',
      pinterest: '#BD081C',
      snapchat: '#FFFC00',
      reddit: '#FF4500',
      twitch: '#9146FF',
      spotify: '#1DB954',
      dribbble: '#EA4C89',
      behance: '#1769FF',
      medium: '#000000',
      dev: '#0A0A0A',
      codepen: '#000000',
    };
    return colors[platform.toLowerCase()] || '#6B7280';
  };

  const renderSocialLink = (link: SocialLink) => {
    const linkClasses = [
      'social-links__link',
      `social-links__link--${link.platform.toLowerCase()}`,
      animated && 'social-links__link--animated',
    ].filter(Boolean).join(' ');

    const linkStyle = variant === 'filled' ? {
      '--social-color': link.color || getPlatformColor(link.platform)
    } as React.CSSProperties : undefined;

    return (
      <li key={link.id} className="social-links__item">
        <a
          href={link.url}
          className={linkClasses}
          style={linkStyle}
          target={target}
          rel={rel}
          onClick={(e) => handleLinkClick(link, e)}
          aria-label={link.label || `Follow us on ${link.platform}`}
        >
          <Icon 
            name={link.icon} 
            className="social-links__icon"
            aria-hidden="true"
          />
          
          {showLabels && (
            <span className="social-links__label">
              {link.label || link.platform}
            </span>
          )}
          
          {showUsernames && link.username && (
            <span className="social-links__username">
              @{link.username}
            </span>
          )}
          
          {/* Hover effect overlay */}
          <span className="social-links__overlay" aria-hidden="true" />
        </a>
      </li>
    );
  };

  const socialLinksClasses = [
    'social-links',
    `social-links--${variant}`,
    `social-links--${size}`,
    `social-links--${layout}`,
    animated && 'social-links--animated',
    className
  ].filter(Boolean).join(' ');

  return (
    <nav className={socialLinksClasses} aria-label="Social media links">
      <ul className="social-links__list">
        {links.map(renderSocialLink)}
      </ul>
    </nav>
  );
};

// Predefined social platforms for easy use
export const SOCIAL_PLATFORMS = {
  FACEBOOK: { platform: 'Facebook', icon: 'facebook' },
  TWITTER: { platform: 'Twitter', icon: 'twitter' },
  INSTAGRAM: { platform: 'Instagram', icon: 'instagram' },
  LINKEDIN: { platform: 'LinkedIn', icon: 'linkedin' },
  YOUTUBE: { platform: 'YouTube', icon: 'youtube' },
  GITHUB: { platform: 'GitHub', icon: 'github' },
  DISCORD: { platform: 'Discord', icon: 'discord' },
  TELEGRAM: { platform: 'Telegram', icon: 'telegram' },
  WHATSAPP: { platform: 'WhatsApp', icon: 'whatsapp' },
  TIKTOK: { platform: 'TikTok', icon: 'tiktok' },
  PINTEREST: { platform: 'Pinterest', icon: 'pinterest' },
  SNAPCHAT: { platform: 'Snapchat', icon: 'snapchat' },
  REDDIT: { platform: 'Reddit', icon: 'reddit' },
  TWITCH: { platform: 'Twitch', icon: 'twitch' },
  SPOTIFY: { platform: 'Spotify', icon: 'spotify' },
  DRIBBBLE: { platform: 'Dribbble', icon: 'dribbble' },
  BEHANCE: { platform: 'Behance', icon: 'behance' },
  MEDIUM: { platform: 'Medium', icon: 'medium' },
  DEV: { platform: 'Dev.to', icon: 'dev' },
  CODEPEN: { platform: 'CodePen', icon: 'codepen' },
} as const;

export default SocialLinks;
