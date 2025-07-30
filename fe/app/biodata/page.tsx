'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createBiodata, getBiodataByUserId, updateBiodata } from '../services/api/biodata';
import { BiodataFormData, Biodata } from '../types/biodata';
import { useAuth } from '../hooks/useAuth';

export default function BiodataFormPage() {
  const [formData, setFormData] = useState<BiodataFormData>({
    nama: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat: '',
    foto_profil: null,
    nama_ayah: '',
    pekerjaan_ayah: '',
    nama_ibu: '',
    pekerjaan_ibu: '',
    minat: '',
    bakat: '',
    cita_cita: '',
    harapan_setahun: '',
    harapan_lulus: '',
    kegiatan_harian: '',
    ekstrakurikuler: '',
    gambaran_diri: '',
  });

  const { getUserId, getToken } = useAuth();
  const [preview, setPreview] = useState<string>('');
  const [existingBiodata, setExistingBiodata] = useState<Biodata | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to format date properly without timezone issues
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // FIXED LOGIC: Check if form should be editable
  const isFormEditable = !existingBiodata || isEditing;

  useEffect(() => {
    const fetchUserBiodata = async () => {
      setIsLoading(true);
      try {
        const token = getToken();
        const userId = getUserId();

        if (!token || !userId) {
          console.error("Token atau User ID tidak ditemukan");
          setIsLoading(false);
          return;
        }

        const response = await getBiodataByUserId(userId, token);
        const userBiodata = response.data.data;

        if (userBiodata) {
          // User already has biodata - set to view mode
          setExistingBiodata(userBiodata);
          setFormData({
            nama: userBiodata.nama || '',
            tempat_lahir: userBiodata.tempat_lahir || '',
            tanggal_lahir: formatDateForInput(userBiodata.tanggal_lahir),
            alamat: userBiodata.alamat || '',
            foto_profil: null,
            nama_ayah: userBiodata.nama_ayah || '',
            pekerjaan_ayah: userBiodata.pekerjaan_ayah || '',
            nama_ibu: userBiodata.nama_ibu || '',
            pekerjaan_ibu: userBiodata.pekerjaan_ibu || '',
            minat: userBiodata.minat || '',
            bakat: userBiodata.bakat || '',
            cita_cita: userBiodata.cita_cita || '',
            harapan_setahun: userBiodata.harapan_setahun || '',
            harapan_lulus: userBiodata.harapan_lulus || '',
            kegiatan_harian: userBiodata.kegiatan_harian || '',
            ekstrakurikuler: userBiodata.ekstrakurikuler || '',
            gambaran_diri: userBiodata.gambaran_diri || '',
          });

          if (userBiodata.foto_profil) {
            setExistingPhotoUrl(userBiodata.foto_profil);
            setPreview(userBiodata.foto_profil);
          }
          setNewPhotoFile(null);
        } else {
          // New user - no biodata yet, allow form to be editable
          setExistingBiodata(null);
        }
      } catch (err) {
        console.error('Gagal memuat biodata user:', err);
        // If error (like 404), assume no biodata exists yet
        setExistingBiodata(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBiodata();
  }, [getToken, getUserId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setNewPhotoFile(file);
    setFormData(prev => ({ ...prev, foto_profil: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = getToken();
    const userId = getUserId();

    if (!token || !userId) {
      setIsSubmitting(false);
      return alert('Token atau User ID tidak ditemukan');
    }

    const form = new FormData();
    form.append('user_id', userId);

    // Handle all text fields
    Object.keys(formData).forEach(key => {
      if (key !== 'foto_profil') {
        const value = formData[key as keyof BiodataFormData];
        if (typeof value === 'string') {
          form.append(key, value);
        }
      }
    });

    // Handle photo logic
    if (newPhotoFile) {
      form.append('foto_profil', newPhotoFile);
      console.log('📸 Sending new photo file');
    } else if (existingPhotoUrl) {
      form.append('foto_profil', existingPhotoUrl);
      console.log('🔄 Keeping existing photo URL:', existingPhotoUrl);
    }

    try {
      if (existingBiodata) {
        await updateBiodata(existingBiodata.id, form, token);
        alert('✅ Biodata berhasil diperbarui!');
      } else {
        await createBiodata(form, token);
        alert('✅ Biodata berhasil disimpan!');
      }

      setIsEditing(false);
      setNewPhotoFile(null);
      setIsSubmitting(false);
      window.location.reload();
    } catch (err) {
      console.error('❌ Error:', err);
      alert('Terjadi kesalahan saat menyimpan biodata');
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewPhotoFile(null);
    
    if (existingPhotoUrl) {
      setPreview(existingPhotoUrl);
    } else {
      setPreview('');
    }
    
    if (existingBiodata) {
      setFormData({
        nama: existingBiodata.nama || '',
        tempat_lahir: existingBiodata.tempat_lahir || '',
        tanggal_lahir: formatDateForInput(existingBiodata.tanggal_lahir),
        alamat: existingBiodata.alamat || '',
        foto_profil: null,
        nama_ayah: existingBiodata.nama_ayah || '',
        pekerjaan_ayah: existingBiodata.pekerjaan_ayah || '',
        nama_ibu: existingBiodata.nama_ibu || '',
        pekerjaan_ibu: existingBiodata.pekerjaan_ibu || '',
        minat: existingBiodata.minat || '',
        bakat: existingBiodata.bakat || '',
        cita_cita: existingBiodata.cita_cita || '',
        harapan_setahun: existingBiodata.harapan_setahun || '',
        harapan_lulus: existingBiodata.harapan_lulus || '',
        kegiatan_harian: existingBiodata.kegiatan_harian || '',
        ekstrakurikuler: existingBiodata.ekstrakurikuler || '',
        gambaran_diri: existingBiodata.gambaran_diri || '',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-400/20 border-b-purple-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-white/70 text-lg animate-pulse">Loading biodata...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 px-4 py-8 sm:py-12 text-white relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-1/4 right-1/4 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-yellow-500/15 to-red-500/15 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500/15 to-blue-500/15 rounded-full blur-2xl animate-pulse delay-3000"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="bg-white/10 border border-white/20 backdrop-blur-2xl shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-cyan-500/10 transition-all duration-500">
          {/* Enhanced Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block p-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
              <div className="bg-slate-900 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {existingBiodata ? 'BIODATA PRIBADI' : 'BUAT BIODATA PRIBADI'}
                </h1>
              </div>
            </div>
            <p className="text-gray-300 text-base sm:text-lg">
              {existingBiodata ? 'Profil dan Informasi Personal' : 'Lengkapi profil dan informasi personal Anda'}
            </p>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto mt-3 sm:mt-4 rounded-full"></div>
            
            {!existingBiodata && (
              <div className="mt-4 sm:mt-6 inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-full px-4 py-2 backdrop-blur-xl">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-sm font-medium">Mode Pembuatan Biodata</span>
              </div>
            )}
          </div>

          {/* Edit Button - Only show if biodata exists and not editing */}
          {existingBiodata && !isEditing && (
            <div className="text-center mb-6 sm:mb-8">
              <button
                onClick={() => setIsEditing(true)}
                className="group relative bg-gradient-to-r from-cyan-500 to-purple-600 py-3 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-semibold text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Biodata
                </span>
              </button>
            </div>
          )}

          {/* Enhanced Photo Section */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="relative group">
              {preview ? (
                <div className="relative">
                  <div className="w-32 h-40 sm:w-40 sm:h-48 rounded-xl sm:rounded-2xl overflow-hidden border-4 border-gradient-to-r from-cyan-400 to-purple-500 shadow-2xl transform transition-all duration-300 group-hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 p-1 rounded-xl sm:rounded-2xl">
                      <div className="w-full h-full rounded-lg sm:rounded-xl overflow-hidden">
                        <Image src={preview} alt="Foto Profil" className="w-full h-full object-cover" width={160} height={192} />
                      </div>
                    </div>
                  </div>
                  {isFormEditable && (
                    <label className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-all duration-300 rounded-xl sm:rounded-2xl">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white mb-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-white font-medium text-xs sm:text-sm">Ganti Foto</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>
              ) : (existingBiodata && !isFormEditable) ? (
                <div className="w-32 h-40 sm:w-40 sm:h-48 rounded-xl sm:rounded-2xl border-4 border-dashed border-white/30 flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white/40 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-white/60 text-xs sm:text-sm font-medium">Tidak Ada Foto</span>
                </div>
              ) : (
                <label className="w-32 h-40 sm:w-40 sm:h-48 border-4 border-dashed border-cyan-400/50 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-400/5 transition-all duration-300 group">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 text-cyan-400 mb-2 sm:mb-3 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-cyan-400 font-medium text-xs sm:text-sm text-center px-2">Upload Foto</span>
                  <span className="text-white/60 text-xs mt-1">JPG, PNG, GIF</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Personal Info */}
            <div className="space-y-4 sm:space-y-6">
              <Input name="nama" label="Nama Lengkap" value={formData.nama} onChange={handleChange} disabled={!isFormEditable} icon="👤" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Input name="tempat_lahir" label="Tempat Lahir" value={formData.tempat_lahir} onChange={handleChange} disabled={!isFormEditable} icon="📍" />
                <Input name="tanggal_lahir" label="Tanggal Lahir" type="date" value={formData.tanggal_lahir} onChange={handleChange} disabled={!isFormEditable} icon="📅" />
              </div>
              <Textarea name="alamat" label="Alamat Lengkap" value={formData.alamat} onChange={handleChange} rows={3} disabled={!isFormEditable} icon="🏠" />
            </div>

            <SectionDivider title="Informasi Keluarga" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Input name="nama_ayah" label="Nama Ayah" value={formData.nama_ayah} onChange={handleChange} disabled={!isFormEditable} icon="👨" />
              <Input name="pekerjaan_ayah" label="Pekerjaan Ayah" value={formData.pekerjaan_ayah} onChange={handleChange} disabled={!isFormEditable} icon="💼" />
              <Input name="nama_ibu" label="Nama Ibu" value={formData.nama_ibu} onChange={handleChange} disabled={!isFormEditable} icon="👩" />
              <Input name="pekerjaan_ibu" label="Pekerjaan Ibu" value={formData.pekerjaan_ibu} onChange={handleChange} disabled={!isFormEditable} icon="💼" />
            </div>

            <SectionDivider title="Minat & Kemampuan" />
            
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Input name="minat" label="Minat & Hobi" value={formData.minat} onChange={handleChange} disabled={!isFormEditable} icon="❤️" />
                <Input name="bakat" label="Kemampuan Khusus" value={formData.bakat} onChange={handleChange} disabled={!isFormEditable} icon="⭐" />
              </div>
              <Input name="ekstrakurikuler" label="Kegiatan Ekstrakurikuler" value={formData.ekstrakurikuler} onChange={handleChange} disabled={!isFormEditable} icon="🏆" />
              <Input name="cita_cita" label="Aspirasi Karir" value={formData.cita_cita} onChange={handleChange} disabled={!isFormEditable} icon="🎯" />
            </div>

            <SectionDivider title="Rencana Masa Depan" />
            
            <div className="space-y-4 sm:space-y-6">
              <Textarea name="harapan_setahun" label="Target Jangka Pendek (1 Tahun)" value={formData.harapan_setahun} onChange={handleChange} rows={3} disabled={!isFormEditable} icon="📈" />
              <Textarea name="harapan_lulus" label="Rencana Setelah Lulus" value={formData.harapan_lulus} onChange={handleChange} rows={3} disabled={!isFormEditable} icon="🎓" />
              <Textarea name="kegiatan_harian" label="Aktivitas Sehari-hari" value={formData.kegiatan_harian} onChange={handleChange} rows={3} disabled={!isFormEditable} icon="⏰" />
            </div>

            <SectionDivider title="Tentang Diri" />
            
            <Textarea name="gambaran_diri" label="Ceritakan tentang diri Anda" value={formData.gambaran_diri} onChange={handleChange} rows={5} disabled={!isFormEditable} icon="✨" />

            {/* Action Buttons */}
            {isFormEditable && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8">
                {existingBiodata && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 bg-gray-600/80 backdrop-blur-sm py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold text-white shadow-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none text-sm sm:text-base"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none relative overflow-hidden group text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {existingBiodata ? 'Update Biodata' : 'Simpan Biodata'}
                    </span>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 my-6 sm:my-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      <h3 className="text-lg sm:text-xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent px-2 sm:px-4">
        {title}
      </h3>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
    </div>
  );
}

function Input({ name, label, value, onChange, placeholder, type = 'text', disabled = false, icon }: {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  icon?: string;
}) {
  return (
    <div className="space-y-2 group">
      <label htmlFor={name} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
        {icon && <span className="text-base sm:text-lg">{icon}</span>}
        {label}
      </label>
      <div className="relative">
        <input 
          type={type} 
          id={name} 
          name={name} 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder} 
          disabled={disabled} 
          required 
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed backdrop-blur-sm hover:bg-white/15 text-sm sm:text-base" 
        />
        <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
    </div>
  );
}

function Textarea({ name, label, value, onChange, placeholder, rows = 4, disabled = false, icon }: {
  name: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  icon?: string;
}) {
  return (
    <div className="space-y-2 group">
      {label && (
        <label htmlFor={name} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
          {icon && <span className="text-base sm:text-lg">{icon}</span>}
          {label}
        </label>
      )}
      <div className="relative">
        <textarea 
          id={name} 
          name={name} 
          value={value} 
          onChange={onChange} 
          rows={rows} 
          placeholder={placeholder} 
          disabled={disabled} 
          required 
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed backdrop-blur-sm hover:bg-white/15 resize-none text-sm sm:text-base" 
        />
        <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
    </div>
  );
}