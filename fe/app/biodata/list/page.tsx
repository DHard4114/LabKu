'use client';

import { useEffect, useState } from 'react';
import { getAllBiodata } from '../../services/api/biodata';
import { FlaskConical, Sparkles, X, User, MapPin, Heart, Star, Target, Activity, Calendar, Users, Briefcase, Home, Eye, Filter, Search } from 'lucide-react';
import type { Biodata } from '../../types/biodata'; // sesuaikan tipe `Biodata`
import Image from 'next/image';

export default function BiodataListPage() {
  const [biodataList, setBiodataList] = useState<Biodata[]>([]);
  const [selectedBiodata, setSelectedBiodata] = useState<Biodata | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getAllBiodata(token || '');
        
        // Transform response data to match the expected format
        const formattedData = response.data?.map((item: any) => ({
          id: item._id || item.id,
          nama: item.nama,
          tempat_lahir: item.tempat_lahir,
          tanggal_lahir: item.tanggal_lahir,
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

  const InfoCard = ({ icon: Icon, label, value, className = "" }) => (
    <div className={`flex items-start space-x-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 ${className}`}>
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
        <Icon className="w-4 h-4 text-cyan-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-cyan-300 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-white/90 font-medium break-words">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/30 animate-pulse">
                  <FlaskConical className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-lg">
                  <Sparkles className="w-3 h-3 text-white m-1.5" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
            
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4 drop-shadow-2xl">
              Student Biodata
            </h1>
            <p className="text-xl text-white/70 font-light mb-6 max-w-2xl mx-auto">
              Comprehensive student profiles with detailed information and achievements
            </p>
            
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-full px-6 py-3 backdrop-blur-xl">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span className="text-cyan-300 text-sm font-bold">Teacher Access Portal</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search students by name, dreams, or interests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 focus:bg-white/15 transition-all duration-300"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="pl-12 pr-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white focus:outline-none focus:border-cyan-400/50 focus:bg-white/15 transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="all" className="bg-slate-800">All Interests</option>
                <option value="teknologi" className="bg-slate-800">Technology</option>
                <option value="seni" className="bg-slate-800">Arts</option>
                <option value="olahraga" className="bg-slate-800">Sports</option>
              </select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-6 text-center">
              <Users className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">{biodataList.length}</h3>
              <p className="text-cyan-300 text-sm">Total Students</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 text-center">
              <Target className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">{new Set(biodataList.map(b => b.cita_cita)).size}</h3>
              <p className="text-purple-300 text-sm">Career Goals</p>
            </div>
            <div className="bg-gradient-to-br from-pink-500/20 to-orange-500/20 backdrop-blur-xl border border-pink-400/30 rounded-2xl p-6 text-center">
              <Activity className="w-8 h-8 text-pink-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">{filteredBiodata.length}</h3>
              <p className="text-pink-300 text-sm">Filtered Results</p>
            </div>
          </div>

          {/* Biodata Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center space-x-3">
                <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                <span className="text-white/70 text-lg animate-pulse">Loading students data...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBiodata.map((bio, index) => (
                <div
                  key={bio.id}
                  onClick={() => setSelectedBiodata(bio)}
                  className="group cursor-pointer bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 text-white shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-400/30 hover:bg-white/10 transition-all duration-500 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Profile Image */}
                  <div className="relative w-full h-48 mb-6 overflow-hidden rounded-2xl">
                    <Image
                      src={bio.foto_profil}
                      alt={bio.nama}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
                        {bio.nama}
                      </h3>
                      <div className="flex items-center space-x-2 text-white/60 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{bio.tempat_lahir}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20">
                        <Target className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-cyan-300 font-medium">DREAM</p>
                          <p className="text-sm text-white font-medium">{bio.cita_cita}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20">
                        <Heart className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-purple-300 font-medium">INTEREST</p>
                          <p className="text-sm text-white font-medium">{bio.minat}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-orange-500/10 border border-pink-400/20">
                        <Star className="w-5 h-5 text-pink-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-pink-300 font-medium">TALENT</p>
                          <p className="text-sm text-white font-medium">{bio.bakat}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredBiodata.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white/40" />
              </div>
              <h3 className="text-xl font-semibold text-white/70 mb-2">No students found</h3>
              <p className="text-white/50">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modal */}
      {selectedBiodata && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-6xl bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-2xl text-white rounded-3xl border border-cyan-400/30 shadow-2xl shadow-cyan-500/20 overflow-hidden">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedBiodata(null)}
              className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all duration-300 group"
            >
              <X className="w-6 h-6 text-white/70 group-hover:text-white" />
            </button>

            {/* Header Section */}
            <div className="relative p-8 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border-b border-white/10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
                    <Image
                      src={selectedBiodata.foto_profil}
                      alt={selectedBiodata.nama}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-3">
                    {selectedBiodata.nama}
                  </h2>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-300 text-sm font-medium">
                      {selectedBiodata.tempat_lahir}
                    </span>
                    <span className="px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 text-sm font-medium">
                      {selectedBiodata.cita_cita}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6 flex items-center">
                    <User className="w-6 h-6 text-cyan-400 mr-3" />
                    Personal Information
                  </h3>
                  
                  <div className="grid gap-4">
                    <InfoCard icon={MapPin} label="Birth Place" value={selectedBiodata.tempat_lahir} />
                    <InfoCard icon={Calendar} label="Birth Date" value={selectedBiodata.tanggal_lahir} />
                    <InfoCard icon={Home} label="Address" value={selectedBiodata.alamat} className="col-span-2" />
                  </div>
                </div>

                {/* Family Information */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6 flex items-center">
                    <Users className="w-6 h-6 text-purple-400 mr-3" />
                    Family Background
                  </h3>
                  
                  <div className="grid gap-4">
                    <InfoCard icon={User} label="Father's Name" value={selectedBiodata.nama_ayah} />
                    <InfoCard icon={Briefcase} label="Father's Job" value={selectedBiodata.pekerjaan_ayah} />
                    <InfoCard icon={User} label="Mother's Name" value={selectedBiodata.nama_ibu} />
                    <InfoCard icon={Briefcase} label="Mother's Job" value={selectedBiodata.pekerjaan_ibu} />
                  </div>
                </div>

                {/* Interests & Talents */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 mb-6 flex items-center">
                    <Star className="w-6 h-6 text-pink-400 mr-3" />
                    Interests & Talents
                  </h3>
                  
                  <div className="grid gap-4">
                    <InfoCard icon={Heart} label="Interest" value={selectedBiodata.minat} />
                    <InfoCard icon={Star} label="Talent" value={selectedBiodata.bakat} />
                    <InfoCard icon={Target} label="Dream Career" value={selectedBiodata.cita_cita} />
                  </div>
                </div>

                {/* Activities & Goals */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 mb-6 flex items-center">
                    <Activity className="w-6 h-6 text-orange-400 mr-3" />
                    Activities & Goals
                  </h3>
                  
                  <div className="grid gap-4">
                    <InfoCard icon={Activity} label="Daily Activities" value={selectedBiodata.kegiatan_harian} />
                    <InfoCard icon={Users} label="Extracurricular" value={selectedBiodata.ekstrakurikuler} />
                  </div>
                </div>

                {/* Future Aspirations */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-6 flex items-center">
                    <Target className="w-6 h-6 text-green-400 mr-3" />
                    Future Aspirations
                  </h3>
                  
                  <div className="grid lg:grid-cols-2 gap-4">
                    <InfoCard icon={Target} label="1 Year Goal" value={selectedBiodata.harapan_setahun} />
                    <InfoCard icon={Target} label="Graduation Goal" value={selectedBiodata.harapan_lulus} />
                  </div>
                </div>

                {/* Self Description */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-6 flex items-center">
                    <Sparkles className="w-6 h-6 text-blue-400 mr-3" />
                    Self Description
                  </h3>
                  
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                    <p className="text-white/90 leading-relaxed">
                      {selectedBiodata.gambaran_diri}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}