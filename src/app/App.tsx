import { useState, useEffect } from 'react';
import LoginPage from '@/app/components/LoginPage';
import Dashboard from '@/app/components/Dashboard';
import Footer from '@/app/components/Footer';

const AUTH_STORAGE_KEY = 'procurex_isLoggedIn';

export default function App() {
  // Check localStorage on mount to restore login state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored === 'true';
  });

  // Update localStorage when login state changes
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="flex flex-col" style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <div className="flex-1 flex flex-col" style={{ minHeight: '100vh' }}>
        {isLoggedIn ? (
          <Dashboard onLogout={handleLogout} />
        ) : (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
      <Footer />
    </div>
  );
}
