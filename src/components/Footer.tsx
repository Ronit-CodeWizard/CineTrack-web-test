import React from 'react';
import { AppRoute, getRouteUrl, navigateTo } from '../lib/navigation';

export const Footer: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, route: AppRoute) => {
    if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      navigateTo(route);
    }
  };

  return (
    <footer className="w-full border-t border-[#161620] bg-[#070709] py-8 text-xs text-[#6e6e80]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-white text-[10px] font-bold text-black">
            CT
          </span>
          <span className="text-white font-medium">CineTrack</span>
          <span>— Personal Entertainment Catalog for Android</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={getRouteUrl('home')}
            onClick={(e) => handleNavClick(e, 'home')}
            className="hover:text-white transition-colors"
          >
            Home
          </a>
          <a
            href={getRouteUrl('updates')}
            onClick={(e) => handleNavClick(e, 'updates')}
            className="hover:text-white transition-colors"
          >
            Updates
          </a>
          <a
            href={getRouteUrl('reset-password')}
            onClick={(e) => handleNavClick(e, 'reset-password')}
            className="hover:text-white transition-colors"
          >
            Reset Password
          </a>
        </div>
      </div>
    </footer>
  );
};
