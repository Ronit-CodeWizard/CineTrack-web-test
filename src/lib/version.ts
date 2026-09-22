/**
 * CineTrack Version and GitHub Release System
 * Strict two-part versioning: MAJOR.MINOR
 * versionCode = MAJOR * 100 + MINOR
 */

export interface ParsedVersion {
  raw: string;
  normalized: string; // e.g. "1.0", "1.1", "2.0"
  major: number;
  minor: number;
  versionCode: number; // formula: major * 100 + minor
}

export interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
  content_type?: string;
}

export interface VersionJsonPayload {
  versionCode: number;
  versionName: string;
  apkUrl?: string;
}

export interface ReleaseItem {
  id: number;
  tagName: string;
  title: string;
  version: ParsedVersion;
  publishedAt: string;
  formattedDate: string;
  body: string;
  apkAsset: GitHubAsset | null;
  apkUrl: string | null;
  versionJson: VersionJsonPayload | null;
  htmlUrl: string;
}

/**
 * Parses and normalizes a CineTrack version string.
 * ONLY accepts two-part versions: MAJOR.MINOR (e.g. "1.0", "1.1", "1.10", "2.0").
 * Accepts prefixes: "v1.0", "1.0", "CineTrack-v1.0", "CineTrack-1.0".
 * Normalizes all to: "1.0".
 * Rejects 1-part ("1"), 3-part ("1.0.1", "v1.0.1"), and any invalid formats.
 */
export function parseTwoPartVersion(input: string): ParsedVersion | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  // Strip known CineTrack prefixes: "CineTrack-v", "CineTrack-", "CineTrack_", "v", "V"
  let cleaned = trimmed
    .replace(/^CineTrack[-_\s]*/i, '')
    .replace(/^v/i, '')
    .trim();

  // Strict validation: must be exclusively digits.digits
  // Rejects 1.0.0, 1.0.1, 1, 1.0-beta, etc.
  const strictTwoPartRegex = /^(\d+)\.(\d+)$/;
  const match = cleaned.match(strictTwoPartRegex);

  if (!match) {
    return null;
  }

  const major = parseInt(match[1], 10);
  const minor = parseInt(match[2], 10);

  if (isNaN(major) || isNaN(minor) || major < 0 || minor < 0) {
    return null;
  }

  // Exact CineTrack version code formula: MAJOR * 100 + MINOR
  const versionCode = major * 100 + minor;
  const normalized = `${major}.${minor}`;

  return {
    raw: input,
    normalized,
    major,
    minor,
    versionCode,
  };
}

/**
 * Numerically compares two ParsedVersion objects.
 * Returns negative if a > b (for descending sort), positive if b > a, 0 if equal.
 * 2.0 > 1.9, 1.10 > 1.9, 1.2 > 1.1
 */
export function compareVersionsDescending(a: ParsedVersion, b: ParsedVersion): number {
  if (a.major !== b.major) {
    return b.major - a.major;
  }
  return b.minor - a.minor;
}

/**
 * Selects the best APK asset for a given release.
 * Prefers:
 * 1. Contains "CineTrack"
 * 2. Contains the normalized version (e.g. "v1.0" or "1.0")
 * 3. Non-debug APK (penalizes debug APKs)
 * Returns null if no suitable .apk asset exists.
 */
export function detectApkAsset(assets: GitHubAsset[], normalizedVersion: string): GitHubAsset | null {
  if (!assets || !Array.isArray(assets) || assets.length === 0) {
    return null;
  }

  const apkAssets = assets.filter((asset) => {
    return asset.name && asset.name.toLowerCase().endsWith('.apk');
  });

  if (apkAssets.length === 0) {
    return null;
  }

  // Score candidate APK assets
  let bestAsset: GitHubAsset | null = null;
  let bestScore = -Infinity;

  const versionWithV = `v${normalizedVersion}`.toLowerCase();
  const versionPlain = normalizedVersion.toLowerCase();

  for (const asset of apkAssets) {
    const nameLower = asset.name.toLowerCase();
    let score = 0;

    // Reject or heavily penalize debug APKs
    if (nameLower.includes('debug')) {
      score -= 100;
    } else {
      score += 25;
    }

    // Prefer asset containing CineTrack branding
    if (nameLower.includes('cinetrack')) {
      score += 30;
    }

    // Prefer asset containing the version tag
    if (nameLower.includes(versionWithV) || nameLower.includes(versionPlain)) {
      score += 20;
    }

    // Prefer release over unsigned
    if (nameLower.includes('release')) {
      score += 10;
    }

    if (score > bestScore) {
      bestScore = score;
      bestAsset = asset;
    }
  }

  return bestAsset;
}

/**
 * Formats published date to e.g. "Sep 22, 2026"
 */
export function formatReleaseDate(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return isoDateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoDateString;
  }
}

/**
 * Format byte size into readable MB/KB
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return '';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) {
    return `${mb.toFixed(1)} MB`;
  }
  const kb = bytes / 1024;
  return `${kb.toFixed(0)} KB`;
}

const CACHE_KEY = 'cinetrack_github_releases_cache';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

interface CacheContainer {
  timestamp: number;
  releases: ReleaseItem[];
}

/**
 * Fetches releases from GitHub API with caching, rate limit protection,
 * two-part version filtering, and version code sorting.
 */
export async function fetchCineTrackReleases(forceRefresh = false): Promise<ReleaseItem[]> {
  const repoOwner = 'official-ronit-codewizard';
  const repoName = 'CineTrack';
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/releases`;

  // 1. Check browser cache if not forcing refresh
  if (!forceRefresh) {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsedCache: CacheContainer = JSON.parse(cached);
        const age = Date.now() - parsedCache.timestamp;
        if (age < CACHE_TTL_MS && Array.isArray(parsedCache.releases)) {
          return parsedCache.releases;
        }
      }
    } catch {
      // Ignore cache read failures
    }
  }

  // 2. Fetch from GitHub API
  let response: Response;
  try {
    response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });
  } catch (err: any) {
    // Attempt fallback to stale cache if available
    const fallback = getStaleCache();
    if (fallback) return fallback;
    throw new Error(`Network connection error: ${err.message || 'Failed to contact GitHub'}`);
  }

  if (!response.ok) {
    // 404 means the repository has no releases or is private
    // 403 means GitHub rate limit was exceeded
    const fallback = getStaleCache();
    if (fallback) return fallback;

    if (response.status === 404) {
      // Empty releases list
      return [];
    }
    if (response.status === 403) {
      throw new Error('GitHub API rate limit reached. Please try again in a few minutes.');
    }
    throw new Error(`GitHub API error (${response.status})`);
  }

  const rawReleases = await response.json();
  if (!Array.isArray(rawReleases)) {
    const fallback = getStaleCache();
    if (fallback) return fallback;
    return [];
  }

  // 3. Process and filter releases
  const processedList: ReleaseItem[] = [];

  for (const item of rawReleases) {
    // Rule: Ignore draft releases and pre-releases
    if (item.draft || item.prerelease) {
      continue;
    }

    // Try parsing tag_name first, then name
    let parsed = parseTwoPartVersion(item.tag_name || '');
    if (!parsed && item.name) {
      parsed = parseTwoPartVersion(item.name);
    }

    // Rule: Only accept valid two-part versions (MAJOR.MINOR)
    if (!parsed) {
      continue;
    }

    const assets: GitHubAsset[] = Array.isArray(item.assets)
      ? item.assets.map((a: any) => ({
          name: a.name || '',
          browser_download_url: a.browser_download_url || '',
          size: a.size || 0,
          content_type: a.content_type,
        }))
      : [];

    // Detect APK asset
    const bestApk = detectApkAsset(assets, parsed.normalized);

    // Look for version.json in assets
    let versionJsonPayload: VersionJsonPayload | null = null;
    const versionJsonAsset = assets.find(
      (a) => a.name.toLowerCase() === 'version.json'
    );

    if (versionJsonAsset) {
      try {
        const vRes = await fetch(versionJsonAsset.browser_download_url);
        if (vRes.ok) {
          const vJson = await vRes.json();
          if (vJson && typeof vJson.versionName === 'string') {
            const parsedFromJson = parseTwoPartVersion(vJson.versionName);
            if (parsedFromJson) {
              versionJsonPayload = {
                versionCode: vJson.versionCode || parsedFromJson.versionCode,
                versionName: parsedFromJson.normalized,
                apkUrl: vJson.apkUrl,
              };
            }
          }
        }
      } catch {
        // Fallback gracefully: missing or malformed version.json is completely non-fatal
        versionJsonPayload = null;
      }
    }

    const apkUrl = versionJsonPayload?.apkUrl || bestApk?.browser_download_url || null;

    processedList.push({
      id: item.id,
      tagName: item.tag_name,
      title: item.name || `CineTrack v${parsed.normalized}`,
      version: parsed,
      publishedAt: item.published_at || '',
      formattedDate: formatReleaseDate(item.published_at || ''),
      body: item.body || '',
      apkAsset: bestApk,
      apkUrl,
      versionJson: versionJsonPayload,
      htmlUrl: item.html_url || `https://github.com/${repoOwner}/${repoName}/releases/tag/${item.tag_name}`,
    });
  }

  // 4. Sort releases numerically by version code (highest version is latest)
  processedList.sort((a, b) => compareVersionsDescending(a.version, b.version));

  // 5. Store in cache
  try {
    const container: CacheContainer = {
      timestamp: Date.now(),
      releases: processedList,
    };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(container));
  } catch {
    // Quota or private mode
  }

  return processedList;
}

function getStaleCache(): ReleaseItem[] | null {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsedCache: CacheContainer = JSON.parse(cached);
      if (Array.isArray(parsedCache.releases)) {
        return parsedCache.releases;
      }
    }
  } catch {
    // Ignore
  }
  return null;
}
