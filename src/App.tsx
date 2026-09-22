import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { UpdatesPage } from './components/UpdatesPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { Footer } from './components/Footer';
import { AppRoute, getCurrentRoute } from './lib/navigation';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getCurrentRoute());

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentRoute(getCurrentRoute());
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#070709] text-white selection:bg-white selection:text-black font-sans antialiased">
      <Navbar currentRoute={currentRoute} />

      <main className="flex-1 flex flex-col">
        {currentRoute === 'home' && <HomePage />}
        {currentRoute === 'updates' && <UpdatesPage />}
        {currentRoute === 'reset-password' && <ResetPasswordPage />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
