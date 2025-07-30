'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { FlaskConical, Menu, X, Home, User, LogOut, LogIn, List } from 'lucide-react';
import { logoutUser } from '../services/api/user';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const isBiodataPage = pathname.startsWith('/biodata');

  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const checkToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setRole(decoded.role);
      } catch (err) {
        console.error('Gagal decode token:', err);
        setRole(null);
      }
    } else {
      setRole(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkToken();

    const handleTokenUpdate = () => {
      checkToken();
    };

    window.addEventListener('storage', handleTokenUpdate);
    window.addEventListener('tokenChanged', handleTokenUpdate);

    return () => {
      window.removeEventListener('storage', handleTokenUpdate);
      window.removeEventListener('tokenChanged', handleTokenUpdate);
    };
  }, [checkToken]);

  const handleLogout = async () => {
    setLoading(true);
    await logoutUser();
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('tokenChanged'));
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isGuru = role === 'guru';

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 px-4 sm:px-6 py-4 backdrop-blur-xl bg-black/70 border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl animate-pulse shadow-lg"></div>
            <div className="space-y-2">
              <div className="h-5 sm:h-6 w-24 sm:w-32 bg-gradient-to-r from-gray-700 to-gray-600 rounded animate-pulse"></div>
              <div className="h-2.5 sm:h-3 w-20 sm:w-24 bg-gradient-to-r from-gray-700 to-gray-600 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-4">
              <div className="h-8 w-16 bg-gradient-to-r from-gray-700 to-gray-600 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-gradient-to-r from-gray-700 to-gray-600 rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl animate-pulse"></div>
            </div>
            <div className="sm:hidden w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="sticky top-0 z-50 px-4 sm:px-6 py-4 backdrop-blur-xl bg-black/70 border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-xl group-hover:shadow-2xl group-hover:shadow-purple-500/30">
                <FlaskConical className="w-5 h-5 sm:w-7 sm:h-7 text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 blur-md transition-all duration-300 group-hover:opacity-40 group-hover:blur-lg"></div>
            </div>
            <div>
              <Link 
                href="/" 
                className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-cyan-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-300"
              >
                LabKu
              </Link>
              <div className="text-xs text-gray-400 font-medium tracking-wider">Digital Science Lab</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Guru Tools */}
            {isBiodataPage && isGuru && (
              <div className="flex items-center space-x-3 border-r border-gray-600/50 pr-6">
                <Link
                  href="/biodata/list"
                  className="group flex items-center space-x-2 px-4 py-2.5 text-cyan-300 hover:text-white bg-cyan-900/20 hover:bg-cyan-700/30 rounded-xl transition-all duration-300 border border-cyan-500/20 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <List className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-sm font-medium">Lihat Semua Biodata</span>
                </Link>
              </div>
            )}

            {/* Main Navigation */}
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className={`group flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  pathname === '/' 
                    ? 'text-cyan-300 bg-cyan-900/30 border border-cyan-500/30 shadow-lg shadow-cyan-500/20' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                }`}
              >
                <Home className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-sm">Home</span>
              </Link>
              
              <Link
                href="/biodata"
                className={`group flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  pathname === '/biodata' 
                    ? 'text-cyan-300 bg-cyan-900/30 border border-cyan-500/30 shadow-lg shadow-cyan-500/20' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                }`}
              >
                <User className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-sm">Biodata</span>
              </Link>

              {/* Auth Button */}
              {role ? (
                <button
                  onClick={handleLogout}
                  className="group flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 shadow-lg hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105 border border-red-400/20"
                >
                  <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className={`group flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                    pathname === '/auth/login'
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/30 border border-purple-400/30'
                      : 'text-gray-300 hover:text-white border border-white/20 hover:bg-white/10 hover:border-white/40'
                  }`}
                >
                  <LogIn className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/30"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={closeMobileMenu}>
          <div 
            className="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-gradient-to-b from-gray-900 via-gray-900 to-black border-l border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <FlaskConical className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  LabKu
                </span>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="p-6 space-y-6">
              {/* Guru Tools */}
              {isBiodataPage && isGuru && (
                <div className="pb-6 border-b border-white/10">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Guru Tools</h3>
                  <Link
                    href="/biodata/list"
                    onClick={closeMobileMenu}
                    className="group flex items-center space-x-3 p-3 text-cyan-300 hover:text-white bg-cyan-900/20 hover:bg-cyan-700/30 rounded-xl transition-all duration-300 border border-cyan-500/20"
                  >
                    <List className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-medium">Lihat Semua Biodata</span>
                  </Link>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Navigation</h3>
                
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className={`group flex items-center space-x-3 p-4 rounded-xl font-medium transition-all duration-300 ${
                    pathname === '/' 
                      ? 'text-cyan-300 bg-cyan-900/30 border border-cyan-500/30' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                  }`}
                >
                  <Home className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span>Home</span>
                </Link>

                <Link
                  href="/biodata"
                  onClick={closeMobileMenu}
                  className={`group flex items-center space-x-3 p-4 rounded-xl font-medium transition-all duration-300 ${
                    pathname === '/biodata' 
                      ? 'text-cyan-300 bg-cyan-900/30 border border-cyan-500/30' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                  }`}
                >
                  <User className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span>Biodata</span>
                </Link>
              </div>

              {/* Auth Section */}
              <div className="pt-6 border-t border-white/10">
                {role ? (
                  <button
                    onClick={handleLogout}
                    className="group w-full flex items-center justify-center space-x-2 p-4 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={closeMobileMenu}
                    className={`group w-full flex items-center justify-center space-x-2 p-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                      pathname === '/auth/login'
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white border border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <LogIn className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span>Login</span>
                  </Link>
                )}
              </div>

              {/* User Info */}
              {role && (
                <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Logged in as</div>
                      <div className="text-xs text-gray-400 capitalize">{role}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}