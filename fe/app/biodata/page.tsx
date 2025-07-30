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
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null); // Separate state for new photo file
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string>(''); // URL from database
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Function to format date properly without timezone issues
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchUserBiodata = async () => {
      try {
        const token = getToken();
        const userId = getUserId();

        if (!token || !userId) {
          console.error("Token atau User ID tidak ditemukan");
          return;
        }

        const response = await getBiodataByUserId(userId, token);
        const userBiodata = response.data.data;

        if (userBiodata) {
          setExistingBiodata(userBiodata);
          setFormData({
            nama: userBiodata.nama || '',
            tempat_lahir: userBiodata.tempat_lahir || '',
            tanggal_lahir: formatDateForInput(userBiodata.tanggal_lahir),
            alamat: userBiodata.alamat || '',
            foto_profil: null, // Always null for File input
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

          // Handle existing photo
          if (userBiodata.foto_profil) {
            setExistingPhotoUrl(userBiodata.foto_profil);
            setPreview(userBiodata.foto_profil);
          }
          setNewPhotoFile(null); // Reset new photo
        }
      } catch (err) {
        console.error('Gagal memuat biodata user:', err);
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
    
    // Set new photo file
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

    // Handle photo logic - THIS IS THE KEY FIX!
    if (newPhotoFile) {
      // User uploaded a new photo
      form.append('foto_profil', newPhotoFile);
      console.log('📸 Sending new photo file');
    } else if (existingPhotoUrl) {
      // No new photo, but we have existing photo URL - send it back
      form.append('foto_profil', existingPhotoUrl);
      console.log('🔄 Keeping existing photo URL:', existingPhotoUrl);
    }
    // If no new photo and no existing photo, don't send foto_profil field

    // Debug logging
    console.log('📝 Form data being sent:');
    for (const [key, value] of form.entries()) {
      console.log(`${key}:`, typeof value === 'string' ? value : 'File object');
    }

    try {
      if (existingBiodata) {
        await updateBiodata(existingBiodata.id, form, token);
        alert('✅ Biodata berhasil diperbarui!');
      } else {
        await createBiodata(form, token);
        alert('✅ Biodata berhasil disimpan!');
      }

      // Reset states
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
    // Reset preview to existing photo
    if (existingPhotoUrl) {
      setPreview(existingPhotoUrl);
    } else {
      setPreview('');
    }
    // Reset form data without reload
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 px-4 py-10 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white/10 border border-white/20 backdrop-blur-2xl shadow-2xl rounded-3xl p-8 hover:shadow-cyan-500/10 transition-all duration-500">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl mb-4">
              <div className="bg-slate-900 rounded-xl px-6 py-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  BIODATA PRIBADI
                </h1>
              </div>
            </div>
            <p className="text-gray-300 text-lg">Profil dan Informasi Personal</p>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Edit Button */}
          {existingBiodata && !isEditing && (
            <div className="text-center mb-8">
              <button
                onClick={() => setIsEditing(true)}
                className="group relative bg-gradient-to-r from-cyan-500 to-purple-600 py-3 px-8 rounded-2xl font-semibold text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Biodata
                </span>
              </button>
            </div>
          )}

          {/* Photo Section */}
          <div className="flex justify-center mb-12">
            <div className="relative group">
              {preview ? (
                <div className="relative">
                  <div className="w-40 h-48 rounded-2xl overflow-hidden border-4 border-gradient-to-r from-cyan-400 to-purple-500 shadow-2xl transform transition-all duration-300 group-hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 p-1 rounded-2xl">
                      <div className="w-full h-full rounded-xl overflow-hidden">
                        <Image src={preview} alt="Foto Profil" className="w-full h-full object-cover" width={160} height={192} />
                      </div>
                    </div>
                  </div>
                  {isEditing && (
                    <label className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-all duration-300 rounded-2xl">
                      <svg className="w-8 h-8 text-white mb-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-white font-medium text-sm">Ganti Foto</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>
              ) : (existingBiodata && !isEditing) ? (
                <div className="w-40 h-48 rounded-2xl border-4 border-dashed border-white/30 flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm">
                  <svg className="w-12 h-12 text-white/40 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-white/60 text-sm font-medium">Tidak Ada Foto</span>
                </div>
              ) : isEditing && (
                <label className="w-40 h-48 border-4 border-dashed border-cyan-400/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-400/5 transition-all duration-300 group">
                  <svg className="w-12 h-12 text-cyan-400 mb-3 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-cyan-400 font-medium text-sm text-center px-2">Upload Foto Profil</span>
                  <span className="text-white/60 text-xs mt-1">JPG, PNG, atau GIF</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Info */}
            <div className="space-y-6">
              <Input name="nama" label="Nama Lengkap" value={formData.nama} onChange={handleChange} disabled={!isEditing} icon="👤" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input name="tempat_lahir" label="Tempat Lahir" value={formData.tempat_lahir} onChange={handleChange} disabled={!isEditing} icon="📍" />
                <Input name="tanggal_lahir" label="Tanggal Lahir" type="date" value={formData.tanggal_lahir} onChange={handleChange} disabled={!isEditing} icon="📅" />
              </div>
              <Textarea name="alamat" label="Alamat Lengkap" value={formData.alamat} onChange={handleChange} rows={3} disabled={!isEditing} icon="🏠" />
            </div>

            <SectionDivider title="Informasi Orang Tua" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input name="nama_ayah" label="Nama Ayah" value={formData.nama_ayah} onChange={handleChange} disabled={!isEditing} icon="👨" />
              <Input name="pekerjaan_ayah" label="Pekerjaan Ayah" value={formData.pekerjaan_ayah} onChange={handleChange} disabled={!isEditing} icon="💼" />
              <Input name="nama_ibu" label="Nama Ibu" value={formData.nama_ibu} onChange={handleChange} disabled={!isEditing} icon="👩" />
              <Input name="pekerjaan_ibu" label="Pekerjaan Ibu" value={formData.pekerjaan_ibu} onChange={handleChange} disabled={!isEditing} icon="💼" />
            </div>

            <SectionDivider title="Minat, Bakat, dan Aspirasi" />
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input name="minat" label="Minat" value={formData.minat} onChange={handleChange} disabled={!isEditing} icon="❤️" />
                <Input name="bakat" label="Kemampuan Khusus" value={formData.bakat} onChange={handleChange} disabled={!isEditing} icon="⭐" />
              </div>
              <Input name="ekstrakurikuler" label="Kegiatan Ekstrakurikuler" value={formData.ekstrakurikuler} onChange={handleChange} disabled={!isEditing} icon="🏆" />
              <Input name="cita_cita" label="Aspirasi Karir" value={formData.cita_cita} onChange={handleChange} disabled={!isEditing} icon="🎯" />
            </div>

            <SectionDivider title="Rencana dan Harapan" />
            
            <div className="space-y-6">
              <Textarea name="harapan_setahun" label="Target Jangka Pendek (1 Tahun)" value={formData.harapan_setahun} onChange={handleChange} rows={3} disabled={!isEditing} icon="📈" />
              <Textarea name="harapan_lulus" label="Rencana Setelah Lulus" value={formData.harapan_lulus} onChange={handleChange} rows={3} disabled={!isEditing} icon="🎓" />
              <Textarea name="kegiatan_harian" label="Aktivitas Sehari-hari" value={formData.kegiatan_harian} onChange={handleChange} rows={3} disabled={!isEditing} icon="⏰" />
            </div>

            <SectionDivider title="Deskripsi Pribadi" />
            
            <Textarea name="gambaran_diri" label="Ceritakan tentang dirimu" value={formData.gambaran_diri} onChange={handleChange} rows={5} disabled={!isEditing} icon="✨" />

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4 pt-8">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-600/80 backdrop-blur-sm py-4 px-6 rounded-2xl font-semibold text-white shadow-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 py-4 px-6 rounded-2xl font-semibold text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none relative overflow-hidden group"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Simpan Biodata
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
    <div className="flex items-center gap-4 my-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      <h3 className="text-xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent px-4">
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
      <label htmlFor={name} className="flex items-center gap-2 text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
        {icon && <span className="text-lg">{icon}</span>}
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
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed backdrop-blur-sm hover:bg-white/15" 
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
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
        <label htmlFor={name} className="flex items-center gap-2 text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
          {icon && <span className="text-lg">{icon}</span>}
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
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed backdrop-blur-sm hover:bg-white/15 resize-none" 
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
    </div>
  );
}