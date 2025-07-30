'use client';
import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, Atom, ArrowRight, Sparkles, Brain, Users, Award,
  Microscope, Beaker, Dna, Calculator, Play, Star
} from 'lucide-react';

export default function Home(): React.JSX.Element {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [activeAtom, setActiveAtom] = useState(0);
  const [particles, setParticles] = useState<
    { left: string; top: string; delay: string; duration: string }[]
  >([]);
  const [isClient, setIsClient] = useState(false);

  // Safe client-only render
  useEffect(() => {
    setIsClient(true);
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const atomInterval = setInterval(() => {
      setActiveAtom((prev) => (prev + 1) % 6);
    }, 2000);

    const generatedParticles = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${2 + Math.random() * 3}s`,
    }));
    setParticles(generatedParticles);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(atomInterval);
    };
  }, []);

  // Avoid SSR mismatch
  if (!isClient) return <></>;


  const subjects = [
    { icon: FlaskConical, title: "Kimia Digital", desc: "Eksperimen virtual & simulasi reaksi kimia", color: "from-green-400 to-emerald-500" },
    { icon: Microscope, title: "Biologi Lab", desc: "Eksplorasi sel & organisme mikroskopis", color: "from-blue-400 to-cyan-500" },
    { icon: Atom, title: "Fisika Quantum", desc: "Memahami atom & hukum fisika modern", color: "from-purple-400 to-violet-500" },
    { icon: Calculator, title: "Matematika", desc: "Problem solving & analisis data", color: "from-orange-400 to-red-500" }
  ];

  const features = [
    { icon: Brain, title: "AI Bu Fitri", desc: "Guru digital yang siap membantu 24/7", highlight: true },
    { icon: Users, title: "Study Groups", desc: "Kolaborasi dengan teman sekelas", highlight: false },
    { icon: Award, title: "Achievement", desc: "Unlock badges & ranking nasional", highlight: false },
  ];

  const atoms = Array.from({ length: 6 }, (_, i) => ({
    x: Math.cos((i * Math.PI * 2) / 6) * 100,
    y: Math.sin((i * Math.PI * 2) / 6) * 100,
    active: i === activeAtom
  }));

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-20 opacity-10">
          <Dna className="w-32 h-32 text-cyan-400 animate-spin" style={{ animationDuration: '15s' }} />
        </div>
        <div className="absolute top-1/4 left-1/6 w-80 h-80 opacity-20">
          <div className="relative w-full h-full">
            <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            {atoms.map((atom, index) => (
              <div
                key={index}
                className={`absolute w-4 h-4 rounded-full transition-all duration-1000 ${
                  atom.active ? 'bg-gradient-to-r from-yellow-400 to-orange-500 scale-150' : 'bg-gradient-to-r from-purple-400 to-pink-500'
                }`}
                style={{
                  left: `calc(50% + ${atom.x}px)`,
                  top: `calc(50% + ${atom.y}px)`
                }}
              ></div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-800/50 to-transparent">
          <div className="absolute bottom-0 left-1/4 opacity-20">
            <Beaker className="w-16 h-16 text-green-400" />
          </div>
          <div className="absolute bottom-5 right-1/3 opacity-15">
            <FlaskConical className="w-20 h-20 text-purple-400" />
          </div>
        </div>

        {/* Particle dots (client only) */}
        <div className="absolute inset-0">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30 animate-ping"
              style={{
                left: p.left,
                top: p.top,
                animationDelay: p.delay,
                animationDuration: p.duration
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Mouse Trail */}
      <div 
        className="fixed w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full pointer-events-none z-50 opacity-30 blur-sm transition-all duration-200"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-full px-6 sm:px-8 py-3 mb-8 backdrop-blur-lg">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-cyan-300 font-bold text-sm sm:text-base">Platform Sains #1 untuk Siswa SMA</span>
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
              Selamat Datang di
            </span>
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              LabFitri
            </span>
            <span className="block text-xl sm:text-2xl md:text-4xl mt-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-bold">
              🧪 Laboratorium Digital Bu Fitri
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-12 max-w-5xl mx-auto leading-relaxed px-4">
            Platform pembelajaran sains revolusioner untuk siswa SMA! Eksperimen <span className="text-green-400 font-bold">kimia virtual</span>, simulasi <span className="text-blue-400 font-bold">fisika interaktif</span>, dan eksplorasi <span className="text-purple-400 font-bold">biologi 3D</span> — bersama <span className="text-cyan-400 font-bold">AI Bu Fitri</span> sebagai guru digital kalian! 🚀
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 px-4">
            <button
              onClick={() => alert('🔬 Wah keren! LabFitri segera hadir untuk revolusi belajar sains kalian! Siap-siap jadi scientist masa depan! 🧬✨')}
              className="group relative px-10 py-4 sm:px-12 sm:py-5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-black text-lg sm:text-xl rounded-2xl shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-3">
                <FlaskConical className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                <span>Mulai Eksperimen!</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </button>
            <button className="group px-10 py-4 border-2 border-cyan-400/40 text-cyan-300 font-bold text-lg sm:text-xl rounded-2xl hover:bg-cyan-400/10 hover:border-cyan-400/60 transition-all duration-300 backdrop-blur-sm flex items-center space-x-3">
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Tonton Demo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto mb-12 px-4">
            {subjects.map((subject, index) => (
              <div 
                key={index}
                className={`group p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl backdrop-blur-lg hover:from-white/20 hover:to-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${subject.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                  <subject.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{subject.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{subject.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group p-8 rounded-3xl backdrop-blur-lg transition-all duration-500 hover:scale-105 transform ${
                  feature.highlight 
                    ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/20' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 200 + 600}ms` }}
              >
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${
                  feature.highlight 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/30' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${feature.highlight ? 'text-cyan-300' : 'text-white'}`}>
                  {feature.title}{feature.highlight && <span className="ml-2 text-yellow-400">✨</span>}
                </h3>
                <p className="text-gray-400 leading-relaxed text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Bubbles */}
      <div className="absolute top-20 right-20 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce opacity-70" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-1/3 left-16 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce opacity-70" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-bounce opacity-70" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/3 right-1/4 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce opacity-70" style={{ animationDelay: '1.5s' }}></div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        <div className="h-20 bg-gradient-to-t from-cyan-500/10 to-transparent"></div>
      </div>
    </div>
  );
}
