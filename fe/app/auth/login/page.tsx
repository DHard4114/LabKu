'use client';

import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
  Sparkles,
  Atom
} from 'lucide-react';
import { loginUser } from '../../services/api/user';
import { useAuth } from '../../hooks/useAuth';
import { AxiosError } from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const {login}  = useAuth();

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      const user = response.data.user;
      login(response.data.token, user.id);


    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const msg = err.response?.data?.message || 'Terjadi kesalahan saat login';
      alert(`⚠️ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const [particles, setParticles] = useState<{ left: string; top: string; delay: string; duration: string }[]>([]);

    useEffect(() => {
      const generated = Array.from({ length: 15 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${2 + Math.random() * 3}s`
      }));
      setParticles(generated);
    }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-purple-500/5 via-cyan-500/5 to-purple-500/5 rounded-full blur-2xl animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      {/* Floating Lab Elements */}
      <div className="absolute top-20 right-20 opacity-20">
        <Atom className="w-16 h-16 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
      </div>
      <div className="absolute bottom-20 left-20 opacity-15">
        <FlaskConical className="w-20 h-20 text-purple-400 animate-bounce" />
      </div>

      {/* Mouse Follower Effect */}
      <div 
        className="fixed w-6 h-6 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full pointer-events-none z-50 opacity-20 blur-sm transition-all duration-300"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className={`w-full max-w-md transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Login Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-cyan-500/30">
                    <FlaskConical className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
                </div>
              </div>
              
              <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                LabKu Login
              </h1>
              
              <p className="text-gray-300 text-sm">
                Masuk ke laboratorium digital masa depan! 🚀
              </p>
              
              {/* Cool Badge */}
              <div className="inline-flex items-center space-x-2 bg-cyan-500/20 border border-cyan-400/30 rounded-full px-4 py-2 mt-4">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-300 text-xs font-bold">Science Learning Platform</span>
              </div>
            </div>

            {/* Login Form */}
            <div className="space-y-6">
              
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="siswa@labfitri.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm hover:bg-white/10"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password rahasia"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm hover:bg-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                onClick={handleLogin}
                disabled={loading}
                className="group relative w-full py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Connecting to Lab...</span>
                    </>
                  ) : (
                    <>
                      <FlaskConical className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Masuk ke LabFitri</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>

              {/* Forgot Password */}
              <div className="text-center">
                <a 
                  href="#" 
                  className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                >
                  Lupa password? Reset di sini
                </a>
              </div>

            </div>

            {/* Register Link */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-gray-400 text-sm mb-4">
                Belum jadi scientist LabFitri?
              </p>
              <a 
                href="/auth/register"
                className="group w-full flex items-center justify-center space-x-3 py-3 border-2 border-purple-400/30 text-purple-300 font-bold rounded-2xl hover:bg-purple-400/10 hover:border-purple-400/50 transition-all duration-300 backdrop-blur-sm"
              >
                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Daftar Sekarang</span>
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Floating Particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30 animate-ping"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        ></div>
      ))}

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
    </div>
  );
}