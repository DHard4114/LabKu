'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { FlaskConical } from 'lucide-react';
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
  };

  const isGuru = role === 'guru';

  if (loading) {
    return (
      <nav className="relative z-20 px-6 py-4 backdrop-blur-md bg-black/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-700 rounded-2xl animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-6 w-32 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 w-24 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="h-8 w-16 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-700 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="relative z-20 px-6 py-4 backdrop-blur-md bg-black/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo & Title */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-pulse">
              <FlaskConical className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce" />
          </div>
          <div>
            <Link href="/" className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              LabKu
            </Link>
            <div className="text-xs text-gray-400 font-medium">Digital Science Lab</div>
          </div>
        </div>

        {/* Actions & Links */}
        <div className="flex items-center space-x-8">
          {/* Guru only tools */}
          {isBiodataPage && isGuru && (
            <div className="flex items-center space-x-3 border-r border-gray-600 pr-6">
              <Link
                href="/biodata/list"
                className="flex items-center space-x-2 px-3 py-1.5 text-cyan-300 hover:text-white hover:bg-cyan-700 rounded-md transition duration-200"
              >
                📋<span className="text-sm font-medium">Lihat Semua Biodata</span>
              </Link>
            </div>
          )}

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === '/' ? 'text-cyan-300' : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              href="/biodata"
              className={`text-sm font-medium transition-colors ${
                pathname === '/biodata' ? 'text-cyan-300' : 'text-gray-300 hover:text-white'
              }`}
            >
              Biodata
            </Link>

            {role ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-500 to-pink-500 shadow-md hover:opacity-90 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth/login"
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  pathname === '/auth/login'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-md'
                    : 'text-gray-300 hover:text-white border border-white/10 hover:bg-white/10'
                }`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
