export const DEFAULT_CINETRACK_FILES: Record<string, string> = {
  'config.js': `// CineTrack Client Configuration
window.CINETRACK_CONFIG = {
  APP_NAME: "CineTrack",
  VERSION: "2.4.0",
  API_BASE_URL: "https://api.cinetrack.dev/v1",
  WORKER_URL: "https://cinetrack-worker.workers.dev",
  TMDB_IMAGE_BASE: "https://image.tmdb.org/t/p/w500",
  FEATURES: {
    WATCHLIST_SYNC: true,
    USER_REVIEWS: true,
    UPDATES_FEED: true,
    OFFLINE_CACHE: true
  }
};
console.log("🎬 CineTrack configuration loaded:", window.CINETRACK_CONFIG.APP_NAME, "v" + window.CINETRACK_CONFIG.VERSION);
`,

  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CineTrack — Track Movies & TV Shows</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0a0d14;
      --bg-card: #121722;
      --bg-card-hover: #192030;
      --border-color: #20293a;
      --text-main: #f1f5f9;
      --text-muted: #8e9bb0;
      --accent-red: #e50914;
      --accent-red-hover: #b80710;
      --accent-amber: #f59e0b;
      --accent-blue: #38bdf8;
      --radius-sm: 6px;
      --radius-md: 12px;
      --radius-lg: 18px;
      --font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-family);
      background-color: var(--bg-dark);
      color: var(--text-main);
      line-height: 1.5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Navbar */
    .navbar {
      background-color: rgba(10, 13, 20, 0.9);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 50;
      padding: 14px 24px;
    }
    .nav-container {
      max-width: 1240px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--text-main);
      font-weight: 800;
      font-size: 1.25rem;
      letter-spacing: -0.02em;
    }
    .brand-badge {
      background-color: var(--accent-red);
      color: #fff;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      font-weight: 900;
    }
    .nav-menu {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .nav-link {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      transition: color 0.15s ease;
      cursor: pointer;
    }
    .nav-link:hover, .nav-link.active {
      color: var(--text-main);
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 0.85rem;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .btn-primary {
      background-color: var(--accent-red);
      color: #fff;
    }
    .btn-primary:hover {
      background-color: var(--accent-red-hover);
    }
    .btn-secondary {
      background-color: var(--bg-card);
      color: var(--text-main);
      border: 1px solid var(--border-color);
    }
    .btn-secondary:hover {
      background-color: var(--bg-card-hover);
    }

    /* Hero & Search */
    .hero {
      padding: 40px 24px 20px;
      max-width: 1240px;
      margin: 0 auto;
      width: 100%;
    }
    .hero-header {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 24px;
    }
    .hero-title {
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: -0.03em;
    }
    .hero-sub {
      color: var(--text-muted);
      font-size: 1rem;
    }
    .search-bar-wrapper {
      position: relative;
      margin-bottom: 24px;
    }
    .search-input {
      width: 100%;
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 14px 20px 14px 44px;
      font-size: 1rem;
      color: var(--text-main);
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      font-family: inherit;
    }
    .search-input:focus {
      border-color: var(--accent-red);
      box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.15);
    }
    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      font-size: 1.1rem;
    }

    /* Filter Tabs */
    .tabs-bar {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 8px;
      margin-bottom: 28px;
    }
    .tab-btn {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }
    .tab-btn:hover {
      color: var(--text-main);
      border-color: #334155;
    }
    .tab-btn.active {
      background-color: var(--text-main);
      color: var(--bg-dark);
      border-color: var(--text-main);
    }

    /* Grid */
    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      gap: 20px;
      margin-bottom: 48px;
    }
    .movie-card {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
    }
    .movie-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
      border-color: #2e3a50;
    }
    .poster-box {
      width: 100%;
      height: 290px;
      background-color: #171d2b;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .poster-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .rating-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: rgba(10, 13, 20, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      color: var(--accent-amber);
      font-weight: 700;
      font-size: 0.75rem;
      padding: 3px 8px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .movie-info {
      padding: 14px;
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: space-between;
      gap: 10px;
    }
    .movie-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-main);
      line-height: 1.3;
    }
    .movie-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .btn-watchlist-toggle {
      width: 100%;
      padding: 8px;
      background-color: #1c2436;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      color: var(--text-main);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .btn-watchlist-toggle:hover {
      background-color: var(--accent-red);
      color: #fff;
      border-color: var(--accent-red);
    }
    .btn-watchlist-toggle.in-watchlist {
      background-color: rgba(229, 9, 20, 0.15);
      border-color: var(--accent-red);
      color: #ff6b72;
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 20px;
    }
    .modal-backdrop.open { display: flex; }
    .modal-card {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      max-width: 680px;
      width: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 24px 48px rgba(0,0,0,0.6);
    }
    .modal-hero {
      position: relative;
      height: 220px;
      background-color: #171d2b;
      overflow: hidden;
    }
    .modal-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.6;
    }
    .modal-close {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: rgba(0,0,0,0.6);
      color: #fff;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }
    .modal-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .modal-title {
      font-size: 1.5rem;
      font-weight: 800;
    }
    .modal-synopsis {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    /* Footer */
    .footer {
      margin-top: auto;
      border-top: 1px solid var(--border-color);
      padding: 24px;
      background-color: var(--bg-dark);
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .footer-content {
      max-width: 1240px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .footer-links {
      display: flex;
      gap: 20px;
    }
    .footer-links a {
      color: var(--text-muted);
      text-decoration: none;
    }
    .footer-links a:hover {
      color: var(--text-main);
    }

    @media (max-width: 768px) {
      .hero-title { font-size: 1.75rem; }
      .movies-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .poster-box { height: 220px; }
      .nav-menu { display: none; }
    }
  </style>
  <script src="./config.js"></script>
</head>
<body>
  <!-- Navigation -->
  <header class="navbar">
    <div class="nav-container">
      <a href="./index.html" class="brand">
        <span class="brand-badge">CT</span>
        <span>CineTrack</span>
      </a>

      <nav class="nav-menu">
        <a id="nav-all" class="nav-link active">Discover</a>
        <a id="nav-watchlist" class="nav-link">My Watchlist (<span id="watchlist-count">0</span>)</a>
        <a href="./updates/index.html" class="nav-link">Updates</a>
        <a href="./reset-password/index.html" class="nav-link">Account</a>
      </nav>

      <div class="nav-actions">
        <button id="btn-quick-watchlist" class="btn btn-secondary">Watchlist</button>
        <a href="./reset-password/index.html" class="btn btn-primary">Sign In</a>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="hero">
    <div class="hero-header">
      <h1 class="hero-title" id="page-heading">Track What You Watch</h1>
      <p class="hero-sub">Organize your movie lists, discover trending releases, and sync across devices.</p>
    </div>

    <!-- Search Input -->
    <div class="search-bar-wrapper">
      <span class="search-icon">🔍</span>
      <input type="text" id="movie-search" class="search-input" placeholder="Search by title, genre, director, or actor...">
    </div>

    <!-- Category Filters -->
    <div class="tabs-bar">
      <button class="tab-btn active" data-filter="all">All Releases</button>
      <button class="tab-btn" data-filter="trending">🔥 Trending</button>
      <button class="tab-btn" data-filter="scifi">🚀 Sci-Fi</button>
      <button class="tab-btn" data-filter="action">⚡ Action</button>
      <button class="tab-btn" data-filter="drama">🎭 Drama</button>
      <button class="tab-btn" data-filter="watchlist">⭐ In Watchlist</button>
    </div>

    <!-- Movies Grid -->
    <div class="movies-grid" id="movies-container">
      <!-- Injected by JavaScript -->
    </div>
  </main>

  <!-- Movie Detail Modal -->
  <div class="modal-backdrop" id="movie-modal">
    <div class="modal-card">
      <div class="modal-hero">
        <img id="modal-backdrop-img" class="modal-hero-img" src="" alt="Backdrop">
        <button class="modal-close" id="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <h2 class="modal-title" id="modal-title"></h2>
            <p style="color:var(--text-muted); font-size:0.85rem;" id="modal-meta"></p>
          </div>
          <span class="rating-badge" id="modal-rating" style="position:static;"></span>
        </div>
        <p class="modal-synopsis" id="modal-synopsis"></p>
        <div style="display:flex; gap:12px; margin-top:8px;">
          <button id="modal-toggle-watchlist" class="btn btn-primary" style="flex:1;">+ Add to Watchlist</button>
          <button id="modal-share" class="btn btn-secondary">Share</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-content">
      <div>
        <strong>CineTrack Web</strong> — Personal Entertainment Catalog
      </div>
      <div class="footer-links">
        <a href="./updates/index.html">Changelog</a>
        <a href="./reset-password/index.html">Reset Password</a>
        <a href="#top">Back to Top ↑</a>
      </div>
    </div>
  </footer>

  <script>
    // CineTrack Application Core
    const MOVIES_DATABASE = [
      {
        id: "ct-1",
        title: "Interstellar: Beyond Horizon",
        genre: "scifi",
        year: 2024,
        rating: "8.9",
        duration: "2h 49m",
        synopsis: "A team of exploratory researchers journey through a newly stabilized wormhole in search of human sustenance across uncharted galaxies.",
        poster: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: "ct-2",
        title: "Cyberpunk: Neon Syndicate",
        genre: "action",
        year: 2025,
        rating: "8.4",
        duration: "2h 14m",
        synopsis: "In a rain-soaked megalopolis, a rogue synthetic agent uncovers an underworld conspiracy threatening memory banks across the network.",
        poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: "ct-3",
        title: "Chronicles of Dune Valley",
        genre: "scifi",
        year: 2024,
        rating: "8.7",
        duration: "2h 35m",
        synopsis: "Noble houses clash over sovereignty across endless desert wastes harboring the universe's most precious spice deposits.",
        poster: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: "ct-4",
        title: "The Midnight Sovereign",
        genre: "drama",
        year: 2023,
        rating: "8.2",
        duration: "1h 58m",
        synopsis: "An aristocratic dynasty faces collapse amidst political intrigue, secret treaties, and rising industrial rebellion.",
        poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: "ct-5",
        title: "Quantum Drift",
        genre: "action",
        year: 2025,
        rating: "7.9",
        duration: "2h 05m",
        synopsis: "An elite street-racer pilots prototype quantum-levitation vehicles through neon orbital skyways under underground syndicates.",
        poster: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: "ct-6",
        title: "Echoes of the Silent Deep",
        genre: "drama",
        year: 2024,
        rating: "8.5",
        duration: "2h 18m",
        synopsis: "Deep ocean explorers discover acoustic signatures that echo past human civilizations beneath tectonic subduction zones.",
        poster: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80"
      }
    ];

    // Local Watchlist State
    let watchlist = JSON.parse(localStorage.getItem('cinetrack_watchlist') || '[]');
    let currentFilter = 'all';
    let searchQuery = '';

    function saveWatchlist() {
      localStorage.setItem('cinetrack_watchlist', JSON.stringify(watchlist));
      updateWatchlistBadge();
    }

    function updateWatchlistBadge() {
      const badge = document.getElementById('watchlist-count');
      if (badge) badge.textContent = watchlist.length;
    }

    function toggleWatchlist(movieId) {
      const idx = watchlist.indexOf(movieId);
      if (idx > -1) {
        watchlist.splice(idx, 1);
      } else {
        watchlist.push(movieId);
      }
      saveWatchlist();
      renderMovies();
    }

    function renderMovies() {
      const container = document.getElementById('movies-container');
      if (!container) return;

      let filtered = MOVIES_DATABASE.filter(m => {
        const matchesFilter = 
          currentFilter === 'all' ||
          (currentFilter === 'watchlist' && watchlist.includes(m.id)) ||
          (currentFilter === 'trending' && parseFloat(m.rating) >= 8.5) ||
          m.genre === currentFilter;

        const matchesSearch = 
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.genre.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
      });

      if (filtered.length === 0) {
        container.innerHTML = \`
          <div style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; color: var(--text-muted);">
            <p style="font-size: 1.25rem; margin-bottom: 8px;">No titles found</p>
            <p style="font-size: 0.9rem;">Try adjusting your search query or switching active category filter.</p>
          </div>
        \`;
        return;
      }

      container.innerHTML = filtered.map(movie => {
        const inWatchlist = watchlist.includes(movie.id);
        return \`
          <div class="movie-card" onclick="openModal('\${movie.id}')">
            <div class="poster-box">
              <img class="poster-img" src="\${movie.poster}" alt="\${movie.title}">
              <span class="rating-badge">★ \${movie.rating}</span>
            </div>
            <div class="movie-info">
              <div>
                <h3 class="movie-title">\${movie.title}</h3>
                <div class="movie-meta">
                  <span>\${movie.year}</span>
                  <span>\${movie.duration}</span>
                </div>
              </div>
              <button 
                class="btn-watchlist-toggle \${inWatchlist ? 'in-watchlist' : ''}" 
                onclick="event.stopPropagation(); toggleWatchlist('\${movie.id}')"
              >
                \${inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>
            </div>
          </div>
        \`;
      }).join('');
    }

    // Modal Handling
    let activeModalMovieId = null;

    function openModal(id) {
      const movie = MOVIES_DATABASE.find(m => m.id === id);
      if (!movie) return;
      activeModalMovieId = id;

      document.getElementById('modal-title').textContent = movie.title;
      document.getElementById('modal-meta').textContent = \`\${movie.year} • \${movie.duration} • \${movie.genre.toUpperCase()}\`;
      document.getElementById('modal-rating').textContent = '★ ' + movie.rating;
      document.getElementById('modal-synopsis').textContent = movie.synopsis;
      document.getElementById('modal-backdrop-img').src = movie.poster;

      const toggleBtn = document.getElementById('modal-toggle-watchlist');
      const inWatchlist = watchlist.includes(id);
      toggleBtn.textContent = inWatchlist ? 'Remove from Watchlist' : '+ Add to Watchlist';

      document.getElementById('movie-modal').classList.add('open');
    }

    function closeModal() {
      document.getElementById('movie-modal').classList.remove('open');
    }

    document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
    document.getElementById('movie-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'movie-modal') closeModal();
    });

    document.getElementById('modal-toggle-watchlist')?.addEventListener('click', () => {
      if (activeModalMovieId) {
        toggleWatchlist(activeModalMovieId);
        const inWatchlist = watchlist.includes(activeModalMovieId);
        document.getElementById('modal-toggle-watchlist').textContent = inWatchlist ? 'Remove from Watchlist' : '+ Add to Watchlist';
      }
    });

    // Event Listeners
    document.getElementById('movie-search')?.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderMovies();
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderMovies();
      });
    });

    document.getElementById('nav-watchlist')?.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      const wlTab = document.querySelector('[data-filter="watchlist"]');
      if (wlTab) wlTab.classList.add('active');
      currentFilter = 'watchlist';
      renderMovies();
    });

    document.getElementById('btn-quick-watchlist')?.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      const wlTab = document.querySelector('[data-filter="watchlist"]');
      if (wlTab) wlTab.classList.add('active');
      currentFilter = 'watchlist';
      renderMovies();
    });

    // Initialize
    updateWatchlistBadge();
    renderMovies();
  </script>
</body>
</html>
`,

  'reset-password/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password — CineTrack</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0a0d14;
      --bg-card: #121722;
      --border-color: #20293a;
      --text-main: #f1f5f9;
      --text-muted: #8e9bb0;
      --accent-red: #e50914;
      --accent-red-hover: #b80710;
      --success-green: #10b981;
      --radius-md: 12px;
      --font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-family);
      background-color: var(--bg-dark);
      color: var(--text-main);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
    }
    .auth-card {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 36px;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .brand-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 24px;
      text-decoration: none;
      color: var(--text-main);
      font-weight: 800;
      font-size: 1.25rem;
    }
    .brand-badge {
      background-color: var(--accent-red);
      color: #fff;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.8rem;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 800;
      margin-bottom: 8px;
    }
    p {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 24px;
      line-height: 1.5;
    }
    .form-group {
      margin-bottom: 18px;
    }
    label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 8px;
    }
    input {
      width: 100%;
      background-color: #0b0f18;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px 14px;
      color: #fff;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.15s ease;
    }
    input:focus {
      border-color: var(--accent-red);
    }
    .btn {
      width: 100%;
      background-color: var(--accent-red);
      color: #fff;
      border: none;
      padding: 12px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.95rem;
      transition: background-color 0.15s ease;
    }
    .btn:hover { background-color: var(--accent-red-hover); }
    .back-link {
      display: block;
      text-align: center;
      margin-top: 20px;
      color: var(--text-muted);
      font-size: 0.85rem;
      text-decoration: none;
    }
    .back-link:hover { color: #fff; }
    .alert {
      padding: 12px;
      border-radius: 8px;
      font-size: 0.85rem;
      margin-bottom: 16px;
      display: none;
    }
    .alert-success {
      background-color: rgba(16, 185, 129, 0.15);
      border: 1px solid var(--success-green);
      color: #6ee7b7;
    }
  </style>
</head>
<body>
  <div class="auth-card">
    <a href="../index.html" class="brand-header">
      <span class="brand-badge">CT</span>
      <span>CineTrack</span>
    </a>

    <h1>Reset Your Password</h1>
    <p>Enter the email associated with your CineTrack account and we will send you a secure verification link.</p>

    <div id="alert-box" class="alert alert-success"></div>

    <form id="reset-form">
      <div class="form-group">
        <label for="email">Account Email</label>
        <input type="email" id="email" placeholder="name@example.com" required>
      </div>

      <button type="submit" class="btn">Send Password Reset Link</button>
    </form>

    <a href="../index.html" class="back-link">← Return to CineTrack Home</a>
  </div>

  <script>
    document.getElementById('reset-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email')?.value;
      const alertBox = document.getElementById('alert-box');
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.textContent = \`A password recovery link has been dispatched to \${email}. Please check your inbox.\`;
      }
    });
  </script>
</body>
</html>
`,

  'updates/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Release Updates — CineTrack</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0a0d14;
      --bg-card: #121722;
      --border-color: #20293a;
      --text-main: #f1f5f9;
      --text-muted: #8e9bb0;
      --accent-red: #e50914;
      --accent-blue: #38bdf8;
      --radius-md: 12px;
      --font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-family);
      background-color: var(--bg-dark);
      color: var(--text-main);
      padding: 36px 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 760px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 36px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 20px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: #fff;
      font-weight: 800;
      font-size: 1.25rem;
    }
    .brand-badge {
      background-color: var(--accent-red);
      color: #fff;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.8rem;
    }
    .back-btn {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .back-btn:hover { color: #fff; }
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    .release-card {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 24px;
    }
    .release-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      background-color: rgba(56, 189, 248, 0.15);
      color: var(--accent-blue);
      padding: 3px 8px;
      border-radius: 999px;
      margin-bottom: 8px;
    }
    h2 {
      font-size: 1.25rem;
      margin-bottom: 8px;
    }
    .date {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 14px;
    }
    ul {
      padding-left: 20px;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    li { margin-bottom: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="../index.html" class="brand">
        <span class="brand-badge">CT</span>
        <span>CineTrack Updates</span>
      </a>
      <a href="../index.html" class="back-btn">← Back to Catalog</a>
    </div>

    <div class="timeline">
      <div class="release-card">
        <span class="release-badge">Current Release</span>
        <h2>CineTrack Web 2.4.0 — Cloud Sync & Watchlist Overhaul</h2>
        <div class="date">Released September 2026</div>
        <ul>
          <li>Integrated Cloudflare Worker API synchronization for watchlists.</li>
          <li>Instant local cache layer preventing telemetry lag during movie queries.</li>
          <li>Refreshed UI theme with high-contrast cinematic color scheme.</li>
          <li>Enhanced account password recovery flow with secure token validation.</li>
        </ul>
      </div>

      <div class="release-card">
        <span class="release-badge">v2.3.1</span>
        <h2>Performance & Mobile Viewport Enhancements</h2>
        <div class="date">August 2026</div>
        <ul>
          <li>Added adaptive touch cards for mobile browsers and tablets.</li>
          <li>Instant search filtering across titles, genres, and directors.</li>
        </ul>
      </div>
    </div>
  </div>
</body>
</html>
`,

  'worker-updated.js': `// CineTrack Cloudflare Worker API
// Handles watchlist sync, authentication tokens, and movie meta proxy
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Standard CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check endpoint
    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ status: "healthy", service: "cinetrack-worker" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Sync watchlist endpoint
    if (url.pathname === "/api/watchlist" && request.method === "POST") {
      try {
        const body = await request.json();
        return new Response(JSON.stringify({ success: true, count: body.items ? body.items.length : 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // Password reset endpoint
    if (url.pathname === "/api/auth/reset" && request.method === "POST") {
      const data = await request.json();
      return new Response(JSON.stringify({ success: true, message: "Reset email dispatched" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response("CineTrack Worker Service Running", { headers: corsHeaders });
  }
};
`
};
