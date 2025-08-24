// Reusable Logo Component
import React from 'react';

export interface HeaderLogoProps {
  children?: React.ReactNode;
  className?: string;
  href?: string;
  src?: string;
  alt?: string;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({
  children,
  className = '',
  href = '/',
  src,
  alt = 'Logo',
}) => {
  return (
    <a href={href} className={`header__logo ${className}`.trim()}>
      {src ? (
        <img src={src} alt={alt} className="header__logo-img" />
      ) : children ? (
        children
      ) : (
        <span className="header__logo-text">{alt}</span>
      )}
    </a>
  );
};

export default HeaderLogo;
