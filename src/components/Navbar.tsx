import React from 'react';
import { AppRoute, getRouteUrl, navigateTo } from '../lib/navigation';

interface NavbarProps {
  currentRoute: AppRoute;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, route: AppRoute) => {
    // Standard left-click without modifier keys should be handled via SPA pushState
    if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      navigateTo(route);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1a1a22] bg-[#070709]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand wordmark */}
        <a
          href={getRouteUrl('home')}
          onClick={(e) => handleNavClick(e, 'home')}
          className="flex items-center gap-2.5 text-white transition-opacity hover:opacity-90"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black font-extrabold text-sm tracking-tight">
            CT
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            CineTrack
          </span>
        </a>

        {/* Minimal Navigation: Home, Updates (No unsolicited items) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <a
            href={getRouteUrl('home')}
            onClick={(e) => handleNavClick(e, 'home')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors rounded-md ${
              currentRoute === 'home'
                ? 'text-white bg-[#16161d]'
                : 'text-[#8b8b99] hover:text-white hover:bg-[#121217]'
            }`}
          >
            Home
          </a>

          <a
            href={getRouteUrl('updates')}
            onClick={(e) => handleNavClick(e, 'updates')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors rounded-md ${
              currentRoute === 'updates'
                ? 'text-white bg-[#16161d]'
                : 'text-[#8b8b99] hover:text-white hover:bg-[#121217]'
            }`}
          >
            Updates
          </a>
        </nav>
      </div>
    </header>
  );
};
