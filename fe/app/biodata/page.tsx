'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createBiodata } from '../services/api/biodata';
import { BiodataFormData } from '../types/biodata';

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

  const [preview, setPreview] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData(prev => ({ ...prev, foto_profil: file }));
    setPreview(URL.createObjectURL(file));
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    console.log('user_id:', user_id, 'type:', typeof user_id);


    if (!token) return alert('Token tidak ditemukan');
    if (!user_id) return alert('User ID tidak ditemukan');

    const form = new FormData();
    form.append('user_id', String(user_id));
;

    for (const key in formData) {
        const value = formData[key as keyof BiodataFormData];
        if (key === 'foto_profil' && value instanceof File) {
        form.append('foto_profil', value);
        } else if (typeof value === 'string') {
        form.append(key, value);
        }
    }

    try {
        await createBiodata(form, token);
        alert('Biodata berhasil disimpan');
        setFormData({
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
        setPreview('');
    } catch (err) {
        console.error(err);
        alert('Gagal menyimpan biodata');
    }
    };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 px-4 py-10 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl rounded-3xl p-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              BIODATA PRIBADI
            </h1>
            <p className="text-sm text-gray-300 mt-2">Profil dan Informasi Personal</p>
          </div>

          {/* Photo Upload */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              {formData.foto_profil ? (
                <div className="w-32 h-40 rounded-lg overflow-hidden border-2 border-white/30 shadow-md">
                  <Image src={preview} alt="Foto Profil" className="w-full h-full object-cover" width={128} height={160} />
                </div>
              ) : (
                <label className="w-32 h-40 border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-white/50 hover:bg-white/5 transition">
                  <svg className="w-8 h-8 text-white/60 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs text-white/70 text-center px-2">Upload Photo</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <Input name="nama" label="Nama Lengkap" value={formData.nama} onChange={handleChange} placeholder="Masukkan nama lengkap" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input name="tempat_lahir" label="Tempat Lahir" value={formData.tempat_lahir} onChange={handleChange} placeholder="Kota kelahiran" />
              <Input name="tanggal_lahir" label="Tanggal Lahir" type="date" value={formData.tanggal_lahir} onChange={handleChange} />
            </div>

            <Textarea name="alamat" label="Alamat Lengkap" value={formData.alamat} onChange={handleChange} placeholder="Alamat tempat tinggal" rows={3} />

            {/* Orang Tua */}
            <hr className="border-white/20 my-6" />
            <h3 className="text-lg font-semibold text-white">Informasi Orang Tua</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input name="nama_ayah" label="Nama Ayah" value={formData.nama_ayah} onChange={handleChange} placeholder="Nama lengkap ayah" />
              <Input name="pekerjaan_ayah" label="Pekerjaan Ayah" value={formData.pekerjaan_ayah} onChange={handleChange} placeholder="Profesi ayah" />
              <Input name="nama_ibu" label="Nama Ibu" value={formData.nama_ibu} onChange={handleChange} placeholder="Nama lengkap ibu" />
              <Input name="pekerjaan_ibu" label="Pekerjaan Ibu" value={formData.pekerjaan_ibu} onChange={handleChange} placeholder="Profesi ibu" />
            </div>

            {/* Minat dan Aspirasi */}
            <hr className="border-white/20 my-6" />
            <h3 className="text-lg font-semibold text-white">Minat, Bakat, dan Aspirasi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input name="minat" label="Minat" value={formData.minat} onChange={handleChange} placeholder="Hobi dan ketertarikan" />
              <Input name="bakat" label="Kemampuan Khusus" value={formData.bakat} onChange={handleChange} placeholder="Keahlian dan bakat" />
            </div>

            <Input name="ekstrakurikuler" label="Kegiatan Ekstrakurikuler" value={formData.ekstrakurikuler} onChange={handleChange} placeholder="Contoh: Olahraga, Seni, Organisasi" />
            <Input name="cita_cita" label="Aspirasi Karir" value={formData.cita_cita} onChange={handleChange} placeholder="Tujuan karir dan cita-cita masa depan" />

            {/* Rencana dan Harapan */}
            <hr className="border-white/20 my-6" />
            <h3 className="text-lg font-semibold text-white">Rencana dan Harapan</h3>
            <Textarea name="harapan_setahun" label="Target Jangka Pendek (1 Tahun)" value={formData.harapan_setahun} onChange={handleChange} placeholder="Apa yang ingin dicapai dalam 1 tahun ke depan" rows={3} />
            <Textarea name="harapan_lulus" label="Rencana Setelah Lulus" value={formData.harapan_lulus} onChange={handleChange} placeholder="Rencana pendidikan atau karir selanjutnya" rows={3} />
            <Textarea name="kegiatan_harian" label="Aktivitas Sehari-hari" value={formData.kegiatan_harian} onChange={handleChange} placeholder="Kegiatan rutin di luar jam belajar" rows={3} />

            {/* Deskripsi Pribadi */}
            <hr className="border-white/20 my-6" />
            <h3 className="text-lg font-semibold text-white">Deskripsi Pribadi</h3>
            <Textarea name="gambaran_diri" value={formData.gambaran_diri} onChange={handleChange} placeholder="Ceritakan tentang dirimu..." rows={5} />

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-purple-600 py-3 px-6 rounded-xl font-semibold text-white shadow-md hover:opacity-90 transition"
            >
              Simpan Biodata
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}

// Input Component
function Input({
  name,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-white">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
      />
    </div>
  );
}

// Textarea Component
function Textarea({
  name,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  name: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-white">
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        required
        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
      />
    </div>
  );
}
