import JSZip from 'jszip';

export async function extractCineTrackZip(file: File): Promise<Record<string, string>> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);
  const files: Record<string, string> = {};

  const entries = Object.keys(loadedZip.files);

  for (const filename of entries) {
    const entry = loadedZip.files[filename];
    if (entry.dir) continue;

    // Normalize path by stripping root folder like "CineTrack-web-main/"
    let normalizedPath = filename;
    const parts = filename.split('/');
    if (parts.length > 1 && (parts[0].includes('CineTrack') || parts[0].includes('web'))) {
      normalizedPath = parts.slice(1).join('/');
    }

    try {
      const content = await entry.async('string');
      files[normalizedPath] = content;
    } catch (e) {
      console.warn(`Could not read file ${filename} as text:`, e);
    }
  }

  return files;
}
