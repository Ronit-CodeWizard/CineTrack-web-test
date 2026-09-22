/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Film, 
  KeyRound, 
  Sparkles, 
  Settings, 
  Server, 
  Upload, 
  RotateCcw, 
  Code2, 
  Eye, 
  Check, 
  AlertCircle,
  FileArchive
} from 'lucide-react';
import { DEFAULT_CINETRACK_FILES } from './defaultCineTrack';
import { extractCineTrackZip } from './zipHandler';

type PageKey = 'index.html' | 'reset-password/index.html' | 'updates/index.html' | 'config.js' | 'worker-updated.js';

const STORAGE_KEY = 'cinetrack_extracted_files';

export default function App() {
  // Load files from storage or default CineTrack package
  const [files, setFiles] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Object.keys(parsed).length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load saved CineTrack files:', e);
    }
    return DEFAULT_CINETRACK_FILES;
  });

  const [activePage, setActivePage] = useState<PageKey>('index.html');
  const [viewCode, setViewCode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save files to local storage
  const saveFiles = (newFiles: Record<string, string>) => {
    setFiles(newFiles);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFiles));
    } catch (e) {
      console.error('Failed to persist files:', e);
    }
    setRefreshKey((k) => k + 1);
  };

  // Handle ZIP file upload
  const handleZipFile = async (file: File) => {
    setUploadStatus('Extracting ZIP file...');
    try {
      if (file.name.endsWith('.zip')) {
        const extracted = await extractCineTrackZip(file);
        if (Object.keys(extracted).length > 0) {
          // Merge with existing files
          const merged = { ...files, ...extracted };
          saveFiles(merged);
          setUploadStatus(`Extracted ${Object.keys(extracted).length} files successfully!`);
          setTimeout(() => setUploadStatus(null), 3500);
        } else {
          setUploadStatus('No readable files found in ZIP archive.');
        }
      } else {
        // Individual file
        const text = await file.text();
        const path = file.name;
        saveFiles({ ...files, [path]: text });
        setUploadStatus(`Loaded ${file.name}`);
        setTimeout(() => setUploadStatus(null), 3000);
      }
    } catch (err: any) {
      setUploadStatus(`Extraction error: ${err.message || 'Corrupted archive'}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleZipFile(e.dataTransfer.files[0]);
    }
  };

  // Build current HTML content for iframe
  const getRenderContent = () => {
    let content = files[activePage] || '';

    // If viewing config or worker, show code view
    if (activePage.endsWith('.js')) {
      return null;
    }

    // Embed config.js if index.html or other page references it
    const configJs = files['config.js'] || '';
    if (configJs && !content.includes(configJs)) {
      const scriptTag = `<script>\n${configJs}\n</script>`;
      if (content.includes('</head>')) {
        content = content.replace('</head>', `${scriptTag}\n</head>`);
      } else {
        content = `${scriptTag}\n${content}`;
      }
    }

    // Intercept internal relative links so navigation works inside our multi-page runner
    const linkInterceptor = `
      <script>
        document.addEventListener('click', function(e) {
          var target = e.target.closest('a');
          if (!target) return;
          var href = target.getAttribute('href');
          if (href && !href.startsWith('http') && !href.startsWith('#')) {
            e.preventDefault();
            window.parent.postMessage({
              type: 'NAVIGATE',
              href: href
            }, '*');
          }
        });
      </script>
    `;

    if (content.includes('</body>')) {
      content = content.replace('</body>', `${linkInterceptor}\n</body>`);
    } else {
      content = `${content}\n${linkInterceptor}`;
    }

    return content;
  };

  // Listen for navigation messages from inside the preview
  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.data && e.data.type === 'NAVIGATE') {
        const href = e.data.href;
        if (href.includes('reset-password')) {
          setActivePage('reset-password/index.html');
        } else if (href.includes('updates')) {
          setActivePage('updates/index.html');
        } else if (href.includes('index.html') || href === './' || href === '/') {
          setActivePage('index.html');
        }
      }
    };
    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, []);

  const renderContent = getRenderContent();

  return (
    <div
      className="flex flex-col h-screen w-screen bg-[#070a0f] text-slate-100 overflow-hidden font-sans"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* Top Header */}
      <header className="bg-[#0b0f17] border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm shadow-red-600/30">
              CT
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">CineTrack Web</span>
                <span className="text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">
                  v2.4.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                CineTrack Source Runner
              </p>
            </div>
          </div>
        </div>

        {/* Page Switcher Navigation */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActivePage('index.html')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activePage === 'index.html'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Catalog (index.html)</span>
          </button>

          <button
            onClick={() => setActivePage('reset-password/index.html')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activePage === 'reset-password/index.html'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Reset Password</span>
          </button>

          <button
            onClick={() => setActivePage('updates/index.html')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activePage === 'updates/index.html'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Updates</span>
          </button>

          <button
            onClick={() => setActivePage('config.js')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activePage === 'config.js'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>config.js</span>
          </button>

          <button
            onClick={() => setActivePage('worker-updated.js')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activePage === 'worker-updated.js'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>worker.js</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Toggle Code / Preview */}
          {!activePage.endsWith('.js') && (
            <button
              onClick={() => setViewCode(!viewCode)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                viewCode
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-transparent border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {viewCode ? <Eye className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
              <span>{viewCode ? 'View Preview' : 'View Code'}</span>
            </button>
          )}

          {/* Upload / Drop ZIP */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all"
            title="Upload CineTrack-web-main.zip from your device"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Load ZIP File</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip,.html,.js,.css"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleZipFile(e.target.files[0]);
              }
            }}
          />

          {/* Refresh */}
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-all"
            title="Refresh App"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Drag and Drop Overlay Indicator */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-blue-900/40 backdrop-blur-md border-4 border-dashed border-blue-400 flex flex-col items-center justify-center p-8 pointer-events-none">
          <FileArchive className="w-16 h-16 text-blue-300 animate-bounce mb-3" />
          <h2 className="text-xl font-bold text-white mb-1">Drop CineTrack-web-main.zip here</h2>
          <p className="text-sm text-blue-200">Files will be extracted and loaded automatically</p>
        </div>
      )}

      {/* Upload Feedback Toast */}
      {uploadStatus && (
        <div className="bg-emerald-950 border-b border-emerald-800 px-4 py-2 flex items-center justify-between text-xs text-emerald-200 shrink-0">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{uploadStatus}</span>
          </div>
          <button onClick={() => setUploadStatus(null)} className="text-emerald-400 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 flex overflow-hidden relative bg-[#070a0f]">
        {/* If viewing code or a .js file */}
        {(viewCode || activePage.endsWith('.js')) ? (
          <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{activePage}</span>
              <span>{(files[activePage] || '').length.toLocaleString()} characters</span>
            </div>
            <textarea
              value={files[activePage] || ''}
              onChange={(e) => {
                const updated = { ...files, [activePage]: e.target.value };
                saveFiles(updated);
              }}
              spellCheck={false}
              className="flex-1 w-full p-4 bg-slate-950 text-slate-100 font-mono text-xs outline-none resize-none leading-relaxed"
            />
          </div>
        ) : (
          /* Live Preview of the CineTrack HTML Page */
          <iframe
            key={`${activePage}-${refreshKey}`}
            id="cinetrack-frame"
            title="CineTrack App Preview"
            srcDoc={renderContent || ''}
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
            className="w-full h-full border-0 bg-[#0a0d14]"
          />
        )}
      </main>
    </div>
  );
}
