import React, { useEffect, useState } from 'react';
import {
  fetchCineTrackReleases,
  ReleaseItem,
  formatFileSize,
} from '../lib/version';
import { Download, RefreshCw, AlertCircle, Calendar, PackageCheck, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export const UpdatesPage: React.FC = () => {
  const [releases, setReleases] = useState<ReleaseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Record<number, boolean>>({});

  const loadReleases = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCineTrackReleases(forceRefresh);
      setReleases(data);
    } catch (err: any) {
      setError(err?.message || 'Unable to load the release list right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReleases();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Render markdown text cleanly without external heavy dependencies
  const renderReleaseBody = (body: string) => {
    if (!body || !body.trim()) return null;

    const lines = body.trim().split('\n');
    return (
      <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-[#9e9eb0]">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return null;

          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="pt-2 font-semibold text-white text-xs sm:text-sm">
                {trimmed.replace(/^###\s+/, '')}
              </h4>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} className="pt-2 font-semibold text-white text-sm">
                {trimmed.replace(/^##\s+/, '')}
              </h3>
            );
          }
          if (trimmed.startsWith('# ')) {
            return (
              <h2 key={idx} className="pt-2 font-bold text-white text-base">
                {trimmed.replace(/^#\s+/, '')}
              </h2>
            );
          }
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const content = trimmed.replace(/^[\*\-]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-[#646478] mt-1.5">•</span>
                <span>{content}</span>
              </div>
            );
          }
          return <p key={idx}>{trimmed}</p>;
        })}
      </div>
    );
  };

  const latestRelease = releases.length > 0 ? releases[0] : null;
  const olderReleases = releases.length > 1 ? releases.slice(1) : [];

  return (
    <div className="flex-1 bg-[#070709] text-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#1a1a24] pb-6 mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#22222e] bg-[#111118] px-3 py-1 text-xs font-medium text-[#9999a8] mb-3">
              <PackageCheck className="h-3.5 w-3.5 text-white" />
              <span>GitHub Releases</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Updates
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#7e7e90]">
              Get the latest CineTrack release directly for your Android device.
            </p>
          </div>

          <button
            onClick={() => loadReleases(true)}
            disabled={loading}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-lg border border-[#22222e] bg-[#121218] px-3 py-2 text-xs font-medium text-[#9e9eb0] transition-colors hover:border-[#383848] hover:text-white disabled:opacity-50"
            title="Refresh releases from GitHub"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Check for Updates</span>
          </button>
        </div>

        {/* State 1: Loading State */}
        {loading && (
          <div className="rounded-2xl border border-[#1b1b26] bg-[#0c0c13] p-12 text-center my-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#161622] text-white mb-4">
              <RefreshCw className="h-6 w-6 animate-spin text-[#a5a5bc]" />
            </div>
            <p className="text-base font-semibold text-white">Loading available releases…</p>
            <p className="mt-1 text-xs text-[#707084]">Connecting to GitHub Releases API</p>
          </div>
        )}

        {/* State 2: Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-[#2f1c20] bg-[#130b0e] p-8 sm:p-10 text-center my-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#2b1419] text-[#f87171] mb-4">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Unable to load the release list right now.</h3>
            <p className="mt-2 text-xs sm:text-sm text-[#a88289] max-w-md mx-auto">
              {error}
            </p>
            <div className="mt-6">
              <button
                onClick={() => loadReleases(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-xs sm:text-sm font-semibold text-black shadow-sm transition-all hover:bg-[#e4e4eb] active:scale-[0.98]"
              >
                <RefreshCw className="h-4 w-4" />
                <span>TRY AGAIN</span>
              </button>
            </div>
          </div>
        )}

        {/* State 3: Empty (No Releases) */}
        {!loading && !error && releases.length === 0 && (
          <div className="rounded-2xl border border-[#1b1b26] bg-[#0c0c13] p-12 text-center my-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#161622] text-[#8e8ea4] mb-4">
              <PackageCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No CineTrack releases are available yet.</h3>
            <p className="mt-2 text-xs sm:text-sm text-[#7e7e90] max-w-md mx-auto">
              Releases published on GitHub will automatically show up here as soon as they are tagged.
            </p>
            <div className="mt-6">
              <button
                onClick={() => loadReleases(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#22222e] bg-[#121218] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#181822]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>CHECK AGAIN</span>
              </button>
            </div>
          </div>
        )}

        {/* State 4: Active Releases Loaded */}
        {!loading && !error && latestRelease && (
          <div className="space-y-10">
            {/* LATEST VERSION CARD */}
            <section className="rounded-2xl border border-[#242434] bg-[#0d0d15] p-6 sm:p-8 shadow-xl relative overflow-hidden">
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/20" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b1b28] pb-5 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white text-black px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase mb-2">
                    LATEST VERSION
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    CineTrack {latestRelease.version.normalized}
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#7e7e90] shrink-0 font-mono">
                  <Calendar className="h-3.5 w-3.5 text-[#666678]" />
                  <span>{latestRelease.formattedDate}</span>
                </div>
              </div>

              {/* Release Notes / Highlights */}
              {latestRelease.body && latestRelease.body.trim() && (
                <div className="mb-6 rounded-xl border border-[#191924] bg-[#101018] p-4 sm:p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6b6b80] mb-3">
                    Release Notes & Highlights
                  </h3>
                  {renderReleaseBody(latestRelease.body)}
                </div>
              )}

              {/* Download Action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                <div>
                  {latestRelease.apkAsset ? (
                    <div className="text-xs text-[#737385] font-mono">
                      <span className="text-white font-medium">{latestRelease.apkAsset.name}</span>
                      {latestRelease.apkAsset.size > 0 && (
                        <span> • {formatFileSize(latestRelease.apkAsset.size)}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-[#8d8d9f]">
                      Asset packaged via GitHub Releases
                    </span>
                  )}
                </div>

                {latestRelease.apkUrl ? (
                  <a
                    href={latestRelease.apkUrl}
                    download
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-sm transition-all hover:bg-[#e4e4eb] active:scale-[0.98]"
                  >
                    <Download className="h-4 w-4" />
                    <span>DOWNLOAD CINETRACK {latestRelease.version.normalized}</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1c1c28] border border-[#2b2b3c] px-6 py-3.5 text-sm font-semibold text-[#68687a] cursor-not-allowed"
                  >
                    <Download className="h-4 w-4" />
                    <span>APK unavailable</span>
                  </button>
                )}
              </div>
            </section>

            {/* OLDER VERSIONS SECTION */}
            {olderReleases.length > 0 && (
              <section className="space-y-4">
                <div className="border-b border-[#1b1b26] pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#737385]">
                    OLDER VERSIONS
                  </h3>
                </div>

                <div className="space-y-3">
                  {olderReleases.map((rel) => {
                    const isExpanded = Boolean(expandedNotes[rel.id]);
                    return (
                      <div
                        key={rel.id}
                        className="rounded-xl border border-[#1b1b26] bg-[#0c0c12] p-4 sm:p-5 transition-colors hover:border-[#282838]"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="text-base font-bold text-white">
                                CineTrack {rel.version.normalized}
                              </h4>
                              <span className="text-xs text-[#6e6e80] font-mono">
                                {rel.formattedDate}
                              </span>
                            </div>
                            {rel.apkAsset && (
                              <p className="mt-1 text-[11px] text-[#606072] font-mono">
                                {rel.apkAsset.name} {rel.apkAsset.size > 0 ? `(${formatFileSize(rel.apkAsset.size)})` : ''}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            {rel.body && rel.body.trim() && (
                              <button
                                onClick={() => toggleExpand(rel.id)}
                                className="inline-flex items-center gap-1 rounded-lg border border-[#1d1d28] bg-[#12121a] px-2.5 py-1.5 text-xs text-[#8e8ea0] hover:text-white"
                              >
                                <span>Notes</span>
                                {isExpanded ? (
                                  <ChevronUp className="h-3.5 w-3.5" />
                                ) : (
                                  <ChevronDown className="h-3.5 w-3.5" />
                                )}
                              </button>
                            )}

                            {rel.apkUrl ? (
                              <a
                                href={rel.apkUrl}
                                download
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#2b2b3a] bg-[#14141d] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#1a1a26]"
                              >
                                <Download className="h-3.5 w-3.5" />
                                <span>DOWNLOAD APK</span>
                              </a>
                            ) : (
                              <span className="text-xs text-[#646476] px-2 py-1">
                                APK unavailable
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Collapsible notes */}
                        {isExpanded && rel.body && (
                          <div className="mt-4 pt-3 border-t border-[#181822]">
                            {renderReleaseBody(rel.body)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* GitHub Repository Reference */}
            <div className="text-center pt-4 pb-2">
              <a
                href="https://github.com/official-ronit-codewizard/CineTrack"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-xs text-[#6e6e82] hover:text-white transition-colors"
              >
                <span>View CineTrack repository on GitHub</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
