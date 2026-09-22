import React from 'react';
import { getRouteUrl, navigateTo } from '../lib/navigation';
import { ArrowRight, Film, CheckCircle2, Cloud, Smartphone } from 'lucide-react';

export const HomePage: React.FC = () => {
  const handleNavToUpdates = (e: React.MouseEvent) => {
    if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      navigateTo('updates');
    }
  };

  return (
    <div className="flex-1 bg-[#070709] text-white">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#22222e] bg-[#111118] px-3.5 py-1 text-xs font-medium text-[#9999a8] mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span>CineTrack for Android</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:tracking-tight lg:text-7xl">
            CineTrack
          </h1>

          <p className="mt-4 text-xl sm:text-2xl font-medium tracking-tight text-[#a0a0b2]">
            A cinematic movie and TV tracking experience.
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[#7e7e90]">
            Organize your personal movie and TV watchlist, discover trending releases, and keep your watching history synchronized cleanly on Android.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href={getRouteUrl('updates')}
              onClick={handleNavToUpdates}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-sm transition-all hover:bg-[#e4e4eb] active:scale-[0.98]"
            >
              <span>GET CINETRACK</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href={getRouteUrl('updates')}
              onClick={handleNavToUpdates}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#22222e] bg-[#101016] px-6 py-3.5 text-sm font-semibold text-[#d0d0dc] transition-all hover:border-[#383848] hover:bg-[#161620] hover:text-white"
            >
              <span>VIEW UPDATES</span>
            </a>
          </div>
        </div>
      </section>

      {/* Cinematic Visual Section */}
      <section className="border-t border-[#161620] bg-[#09090d] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Designed for Film & Television Lovers
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#7e7e90]">
              Built with a minimal, dark aesthetic to let cinema take center stage.
            </p>
          </div>

          {/* Device Mockup & Showcase */}
          <div className="relative mx-auto max-w-4xl rounded-2xl border border-[#1e1e2b] bg-[#0d0d14] p-4 sm:p-8 shadow-2xl overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl" />

            {/* App UI Showcase Header */}
            <div className="flex items-center justify-between border-b border-[#1b1b26] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#272736]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#272736]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#272736]" />
                <span className="ml-2 text-xs font-medium text-[#737385]">CineTrack Mobile</span>
              </div>
              <span className="text-[11px] font-mono text-[#58586a]">Native Android Experience</span>
            </div>

            {/* Simulated Android Interface */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Feature Card 1 */}
              <div className="rounded-xl border border-[#1b1b26] bg-[#11111a] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#181824] border border-[#252535] text-white mb-4">
                    <Film className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white">Personal Watchlist</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#7c7c8f]">
                    Easily mark movies and shows as watched, save upcoming releases, and rate your favorites.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#1a1a26] flex items-center justify-between text-[11px] text-[#8e8ea2]">
                  <span>Tracked titles</span>
                  <span className="font-mono text-white">Instant Sync</span>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="rounded-xl border border-[#1b1b26] bg-[#11111a] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#181824] border border-[#252535] text-white mb-4">
                    <Cloud className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white">Cloud Synchronization</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#7c7c8f]">
                    Secure token-based sync keeps your watchlist up-to-date across installations with zero friction.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#1a1a26] flex items-center justify-between text-[11px] text-[#8e8ea2]">
                  <span>Cloud architecture</span>
                  <span className="font-mono text-white">Encrypted</span>
                </div>
              </div>

              {/* Feature Card 3 */}
              <div className="rounded-xl border border-[#1b1b26] bg-[#11111a] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#181824] border border-[#252535] text-white mb-4">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white">Fast & Lightweight</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#7c7c8f]">
                    Crafted specifically for modern Android with fluid transitions, low battery consumption, and offline caching.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#1a1a26] flex items-center justify-between text-[11px] text-[#8e8ea2]">
                  <span>Android runtime</span>
                  <span className="font-mono text-white">Jetpack Compose</span>
                </div>
              </div>
            </div>

            {/* Simulated Cinema Card Showcase */}
            <div className="mt-6 rounded-xl border border-[#1c1c28] bg-[#0a0a10] p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#636376]">
                  Catalog Preview
                </span>
                <span className="text-xs text-[#7c7c90]">Monochrome Layout</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3.5 p-3 rounded-lg border border-[#181824] bg-[#12121c]">
                  <div className="h-14 w-11 rounded bg-[#1f1f2e] border border-[#2b2b3d] flex items-center justify-center shrink-0">
                    <Film className="h-5 w-5 text-[#85859e]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-white truncate">Oppenheimer</h4>
                    <p className="text-[11px] text-[#6f6f82]">2023 • Biography, Drama</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#a3a3b8]">★ 8.9</span>
                      <span className="text-[10px] text-[#555567]">•</span>
                      <span className="text-[10px] text-[#88889c]">Watched</span>
                    </div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-white shrink-0" />
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-lg border border-[#181824] bg-[#12121c]">
                  <div className="h-14 w-11 rounded bg-[#1f1f2e] border border-[#2b2b3d] flex items-center justify-center shrink-0">
                    <Film className="h-5 w-5 text-[#85859e]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-white truncate">Dune: Part Two</h4>
                    <p className="text-[11px] text-[#6f6f82]">2024 • Sci-Fi, Adventure</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#a3a3b8]">★ 8.6</span>
                      <span className="text-[10px] text-[#555567]">•</span>
                      <span className="text-[10px] text-[#88889c]">In Watchlist</span>
                    </div>
                  </div>
                  <div className="h-4 w-4 rounded border border-[#353548] shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Call to Action */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-bold text-white">Ready to start tracking?</h3>
            <p className="mt-2 text-sm text-[#7e7e90]">
              Download the latest release package directly from GitHub Releases.
            </p>
            <div className="mt-6">
              <a
                href={getRouteUrl('updates')}
                onClick={handleNavToUpdates}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black shadow-sm transition-all hover:bg-[#e4e4eb] active:scale-[0.98]"
              >
                <span>GET CINETRACK</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
