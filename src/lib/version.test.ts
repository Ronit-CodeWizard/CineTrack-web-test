/**
 * Automated test suite for CineTrack version logic
 */
import { 
  parseTwoPartVersion, 
  compareVersionsDescending, 
  detectApkAsset,
  GitHubAsset 
} from './version';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
}

console.log('--- Testing CineTrack Version Parsing & Comparison ---');

// 1. Valid two-part versions
const v10 = parseTwoPartVersion('1.0');
assert(v10 !== null && v10.normalized === '1.0' && v10.versionCode === 100, 'Parse 1.0 -> 100');

const v11 = parseTwoPartVersion('v1.1');
assert(v11 !== null && v11.normalized === '1.1' && v11.versionCode === 101, 'Parse v1.1 -> 101');

const v12 = parseTwoPartVersion('CineTrack-v1.2');
assert(v12 !== null && v12.normalized === '1.2' && v12.versionCode === 102, 'Parse CineTrack-v1.2 -> 102');

const v13 = parseTwoPartVersion('CineTrack-1.3');
assert(v13 !== null && v13.normalized === '1.3' && v13.versionCode === 103, 'Parse CineTrack-1.3 -> 103');

const v19 = parseTwoPartVersion('1.9');
assert(v19 !== null && v19.normalized === '1.9' && v19.versionCode === 109, 'Parse 1.9 -> 109');

const v20 = parseTwoPartVersion('v2.0');
assert(v20 !== null && v20.normalized === '2.0' && v20.versionCode === 200, 'Parse v2.0 -> 200');

const v21 = parseTwoPartVersion('2.1');
assert(v21 !== null && v21.normalized === '2.1' && v21.versionCode === 201, 'Parse 2.1 -> 201');

const v110 = parseTwoPartVersion('1.10');
assert(v110 !== null && v110.normalized === '1.10' && v110.versionCode === 110, 'Parse 1.10 -> 110');

// 2. Invalid version formats (strictly rejected)
assert(parseTwoPartVersion('1') === null, 'Single digit "1" is rejected');
assert(parseTwoPartVersion('1.0.1') === null, 'Three-part "1.0.1" is rejected');
assert(parseTwoPartVersion('v1.0.1') === null, '"v1.0.1" is rejected');
assert(parseTwoPartVersion('1.0.0') === null, '"1.0.0" is rejected');
assert(parseTwoPartVersion('CineTrack-v1.0.1') === null, '"CineTrack-v1.0.1" is rejected');
assert(parseTwoPartVersion('abc') === null, '"abc" is rejected');

// 3. Numerical Comparison (descending: highest first)
// 2.0 > 1.9 -> compareVersionsDescending(v20, v19) should be negative (a before b)
assert(compareVersionsDescending(v20!, v19!) < 0, '2.0 is newer than 1.9');
assert(compareVersionsDescending(v110!, v19!) < 0, '1.10 is newer than 1.9');
assert(compareVersionsDescending(v12!, v11!) < 0, '1.2 is newer than 1.1');
assert(compareVersionsDescending(v21!, v20!) < 0, '2.1 is newer than 2.0');

// 4. Sorting an array of mixed versions
const versions = [v10!, v20!, v12!, v21!, v19!, v11!];
versions.sort(compareVersionsDescending);
const sortedStrings = versions.map((v) => v.normalized);
assert(
  JSON.stringify(sortedStrings) === JSON.stringify(['2.1', '2.0', '1.9', '1.2', '1.1', '1.0']),
  `Sort order correct: ${JSON.stringify(sortedStrings)}`
);

// 5. APK Detection
const mockAssets: GitHubAsset[] = [
  { name: 'app-debug.apk', browser_download_url: 'https://github.com/app-debug.apk', size: 1000 },
  { name: 'CineTrack-v1.0.apk', browser_download_url: 'https://github.com/CineTrack-v1.0.apk', size: 25000000 },
  { name: 'source.zip', browser_download_url: 'https://github.com/source.zip', size: 500000 },
];

const bestApk = detectApkAsset(mockAssets, '1.0');
assert(bestApk !== null, 'Found APK');
assert(bestApk?.name === 'CineTrack-v1.0.apk', 'Prefers CineTrack-v1.0.apk over debug');

// Test APK unavailable when no .apk exists
const nonApkAssets: GitHubAsset[] = [
  { name: 'source.zip', browser_download_url: 'https://github.com/source.zip', size: 500000 },
];
assert(detectApkAsset(nonApkAssets, '1.0') === null, 'Correctly reports null when no APK');

console.log('✅ All version tests passed successfully!');
