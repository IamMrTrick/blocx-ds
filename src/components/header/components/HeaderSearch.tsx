زی// Reusable Search Component
import React, { useState } from 'react';

export interface HeaderSearchProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  className = '',
  placeholder = 'Search...',
  onSearch,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query.trim());
    }
  };

  return (
    <form 
      role="search" 
      className={`header__search ${className}`.trim()}
      onSubmit={handleSubmit}
    >
      <label htmlFor="header-search" className="sr-only">
        Search
      </label>
      <div className="header__search-input">
        <svg className="header__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="search"
          id="header-search"
          name="q"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="header__search-field"
        />
      </div>
    </form>
  );
};

export default HeaderSearch;
