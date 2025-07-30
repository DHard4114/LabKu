'use client';

import { useEffect, useState } from 'react';
import { getAllBiodata } from '../../services/api/biodata';
import { FlaskConical, Sparkles, X, User, MapPin, Heart, Star, Target, Activity, Calendar, Users, Briefcase, Home, Eye, Filter, Search, LucideIcon, Menu } from 'lucide-react';
import type { Biodata } from '../../types/biodata'; // sesuaikan tipe `Biodata`
import Image from 'next/image';

export default function BiodataListPage() {
  const [biodataList, setBiodataList] = useState<Biodata[]>([]);
  const [selectedBiodata, setSelectedBiodata] = useState<Biodata | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Helper function to format date properly
  const formatDateOnly = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      // Create date object from the ISO string
      const date = new Date(dateString);
      
      // Format as YYYY-MM-DD in local timezone
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getAllBiodata(token || '');
        
        // Transform response data to match the expected format
        const formattedData = response.data?.map((item: Partial<Biodata>) => ({
          id: item.id,
          nama: item.nama,
          tempat_lahir: item.tempat_lahir,
          tanggal_lahir: item.tanggal_lahir ? formatDateOnly(item.tanggal_lahir) : '',
          alamat: item.alamat,
          nama_ayah: item.nama_ayah,
          pekerjaan_ayah: item.pekerjaan_ayah,
          nama_ibu: item.nama_ibu,
          pekerjaan_ibu: item.pekerjaan_ibu,
          minat: item.minat,
          bakat: item.bakat,
          cita_cita: item.cita_cita,
          harapan_setahun: item.harapan_setahun,
          harapan_lulus: item.harapan_lulus,
          kegiatan_harian: item.kegiatan_harian,
          ekstrakurikuler: item.ekstrakurikuler,
          gambaran_diri: item.gambaran_diri,
          foto_profil: item.foto_profil || 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop&crop=faces'
        })) || [];

        setBiodataList(formattedData);
      } catch (err) {
        console.error('Error fetching biodata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBiodata = biodataList.filter(bio => {
    const matchesSearch = bio.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bio.cita_cita.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bio.minat.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    return matchesSearch && bio.minat.toLowerCase().includes(filterBy.toLowerCase());
  });

  const InfoCard = ({ icon: Icon, label, value, className = "" }: InfoCardProps) => (
    <div className={`flex items-start space-x-3 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 ${className}`}>
      <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-cyan-300 uppercase tracking-wide">{label}</p>
        <p className="text-xs sm:text-sm text-white/90 font-medium break-words leading-relaxed">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        {/* Additional mobile-optimized background elements */}
        <div className="absolute top-1/4 right-1/4 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-yellow-500/10 to-red-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 py-6 sm:py-8 lg:py-12 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/30 animate-pulse">
                  <FlaskConical className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-lg">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white m-1 sm:m-1.5" />
                </div>
                <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-3 sm:mb-4 drop-shadow-2xl leading-tight">
              Student Biodata
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/70 font-light mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
              Comprehensive student profiles with detailed information and achievements
            </p>
            
            <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-xl">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 animate-pulse" />
              <span className="text-cyan-300 text-xs sm:text-sm font-bold">Teacher Access Portal</span>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Enhanced Search and Filter Section */}
          <div className="mb-6 sm:mb-8 space-y-4 max-w-4xl mx-auto">
            {/* Mobile Filter Toggle */}
            <div className="flex sm:hidden justify-between items-center">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white text-sm font-medium"
              >
                <Menu className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* Search and Filter Container */}
            <div className={`${mobileFilterOpen ? 'block' : 'hidden'} space-y-4 sm:space-y-0 sm:flex sm:gap-4`}>
              <div className="relative flex-1">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search students by name, dreams, or interests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 focus:bg-white/15 transition-all duration-300 text-sm sm:text-base"
                />
              </div>
              <div className="relative sm:w-auto">
                <Filter className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="w-full sm:w-auto pl-10 sm:pl-12 pr-8 py-3 sm:py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl text-white focus:outline-none focus:border-cyan-400/50 focus:bg-white/15 transition-all duration-300 appearance-none cursor-pointer text-sm sm:text-base"
                >
                  <option value="all" className="bg-slate-800">All Interests</option>
                  <option value="teknologi" className="bg-slate-800">Technology</option>
                  <option value="seni" className="bg-slate-800">Arts</option>
                  <option value="olahraga" className="bg-slate-800">Sports</option>
                </select>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border border-cyan-400/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center transform hover:scale-105 transition-all duration-300">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mx-auto mb-2 sm:mb-3" />
              <h3 className="text-xl sm:text-2xl font-bold text-white">{biodataList.length}</h3>
              <p className="text-cyan-300 text-xs sm:text-sm">Total Students</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center transform hover:scale-105 transition-all duration-300">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2 sm:mb-3" />
              <h3 className="text-xl sm:text-2xl font-bold text-white">{new Set(biodataList.map(b => b.cita_cita)).size}</h3>
              <p className="text-purple-300 text-xs sm:text-sm">Career Goals</p>
            </div>
            <div className="bg-gradient-to-br from-pink-500/20 to-orange-500/20 backdrop-blur-xl border border-pink-400/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center transform hover:scale-105 transition-all duration-300">
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400 mx-auto mb-2 sm:mb-3" />
              <h3 className="text-xl sm:text-2xl font-bold text-white">{filteredBiodata.length}</h3>
              <p className="text-pink-300 text-xs sm:text-sm">Filtered Results</p>
            </div>
          </div>

          {/* Enhanced Biodata Grid */}
          {loading ? (
            <div className="text-center py-12 sm:py-16">
              <div className="inline-flex items-center space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                <span className="text-white/70 text-base sm:text-lg animate-pulse">Loading students data...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredBiodata.map((bio, index) => (
                <div
                  key={bio.id}
                  onClick={() => setSelectedBiodata(bio)}
                  className="group cursor-pointer bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-400/30 hover:bg-white/10 transition-all duration-500 hover:scale-105 animate-[fadeInUp_0.6s_ease-out_forwards] opacity-0"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    opacity: 0
                  }}
                >
                  {/* Enhanced Profile Image */}
                  <div className="relative w-full h-36 sm:h-48 mb-4 sm:mb-6 overflow-hidden rounded-xl sm:rounded-2xl">
                    <Image
                      src={bio.foto_profil}
                      alt={bio.nama}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-white/20 backdrop-blur-sm rounded-full p-1.5 sm:p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    {/* Floating elements */}
                    <div className="absolute top-2 left-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div className="absolute top-3 right-4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-500"></div>
                  </div>

                  {/* Enhanced Content */}
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2 line-clamp-1">
                        {bio.nama}
                      </h3>
                      <div className="flex items-center space-x-2 text-white/60 text-xs sm:text-sm">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="line-clamp-1">{bio.tempat_lahir}</span>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20">
                        <Target className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-cyan-300 font-medium">DREAM</p>
                          <p className="text-xs sm:text-sm text-white font-medium line-clamp-1">{bio.cita_cita}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-purple-300 font-medium">INTEREST</p>
                          <p className="text-xs sm:text-sm text-white font-medium line-clamp-1">{bio.minat}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-pink-500/10 to-orange-500/10 border border-pink-400/20">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-pink-300 font-medium">TALENT</p>
                          <p className="text-xs sm:text-sm text-white font-medium line-clamp-1">{bio.bakat}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredBiodata.length === 0 && !loading && (
            <div className="text-center py-12 sm:py-16">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 sm:w-8 sm:h-8 text-white/40" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white/70 mb-2">No students found</h3>
              <p className="text-white/50 text-sm sm:text-base">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Responsive Modal */}
      {selectedBiodata && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-7xl bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-2xl text-white rounded-2xl sm:rounded-3xl border border-cyan-400/30 shadow-2xl shadow-cyan-500/20 overflow-hidden mx-2 sm:mx-4 my-4 sm:my-8 max-h-[95vh] overflow-y-auto">
            
            {/* Enhanced Close Button */}
            <button
              onClick={() => setSelectedBiodata(null)}
              className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 group"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 group-hover:text-white" />
            </button>

            {/* Enhanced Header Section */}
            <div className="relative p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border-b border-white/10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-6">
                <div className="relative mx-auto lg:mx-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
                    <Image
                      src={selectedBiodata.foto_profil}
                      alt={selectedBiodata.nama}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-3 leading-tight">
                    {selectedBiodata.nama}
                  </h2>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 mb-4">
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-300 text-xs sm:text-sm font-medium">
                      {selectedBiodata.tempat_lahir}
                    </span>
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 text-xs sm:text-sm font-medium">
                      {selectedBiodata.cita_cita}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Content Section */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                
                {/* Personal Information */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4 sm:mb-6 flex items-center">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 mr-2 sm:mr-3" />
                    Personal Information
                  </h3>
                  
                  <div className="grid gap-3 sm:gap-4">
                    <InfoCard icon={MapPin} label="Birth Place" value={selectedBiodata.tempat_lahir} />
                    <InfoCard icon={Calendar} label="Birth Date" value={selectedBiodata.tanggal_lahir} />
                    <InfoCard icon={Home} label="Address" value={selectedBiodata.alamat} className="col-span-2" />
                  </div>
                </div>

                {/* Family Information */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4 sm:mb-6 flex items-center">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mr-2 sm:mr-3" />
                    Family Background
                  </h3>
                  
                  <div className="grid gap-3 sm:gap-4">
                    <InfoCard icon={User} label="Father's Name" value={selectedBiodata.nama_ayah} />
                    <InfoCard icon={Briefcase} label="Father's Job" value={selectedBiodata.pekerjaan_ayah} />
                    <InfoCard icon={User} label="Mother's Name" value={selectedBiodata.nama_ibu} />
                    <InfoCard icon={Briefcase} label="Mother's Job" value={selectedBiodata.pekerjaan_ibu} />
                  </div>
                </div>

                {/* Interests & Talents */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 mb-4 sm:mb-6 flex items-center">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 mr-2 sm:mr-3" />
                    Interests & Talents
                  </h3>
                  
                  <div className="grid gap-3 sm:gap-4">
                    <InfoCard icon={Heart} label="Interest" value={selectedBiodata.minat} />
                    <InfoCard icon={Star} label="Talent" value={selectedBiodata.bakat} />
                    <InfoCard icon={Target} label="Dream Career" value={selectedBiodata.cita_cita} />
                  </div>
                </div>

                {/* Activities & Goals */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 mb-4 sm:mb-6 flex items-center">
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 mr-2 sm:mr-3" />
                    Activities & Goals
                  </h3>
                  
                  <div className="grid gap-3 sm:gap-4">
                    <InfoCard icon={Activity} label="Daily Activities" value={selectedBiodata.kegiatan_harian} />
                    <InfoCard icon={Users} label="Extracurricular" value={selectedBiodata.ekstrakurikuler} />
                  </div>
                </div>

                {/* Future Aspirations */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-4 sm:mb-6 flex items-center">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-2 sm:mr-3" />
                    Future Aspirations
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    <InfoCard icon={Target} label="1 Year Goal" value={selectedBiodata.harapan_setahun} />
                    <InfoCard icon={Target} label="Graduation Goal" value={selectedBiodata.harapan_lulus} />
                  </div>
                </div>

                {/* Self Description */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4 sm:mb-6 flex items-center">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mr-2 sm:mr-3" />
                    Self Description
                  </h3>
                  
                  <div className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl backdrop-blur-sm">
                    <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                      {selectedBiodata.gambaran_diri}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Custom scrollbar for modal */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #8b5cf6);
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #7c3aed);
        }

        /* Enhanced mobile touch targets */
        @media (max-width: 640px) {
          button, input, select {
            min-height: 44px;
          }
        }

        /* Improved focus states for accessibility */
        input:focus, select:focus, button:focus {
          outline: 2px solid #06b6d4;
          outline-offset: 2px;
        }

        /* Enhanced hover effects for desktop */
        @media (hover: hover) {
          .group:hover .group-hover\\:scale-110 {
            transform: scale(1.1);
          }
          
          .group:hover .group-hover\\:opacity-100 {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}