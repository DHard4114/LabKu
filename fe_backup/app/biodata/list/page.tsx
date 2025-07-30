'use client';

import { useEffect, useState } from 'react';
import { getAllBiodata } from '../../services/api/biodata';
import { FlaskConical, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface Biodata {
  id: string;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  nama_ayah: string;
  pekerjaan_ayah: string;
  nama_ibu: string;
  pekerjaan_ibu: string;
  minat: string;
  bakat: string;
  cita_cita: string;
  harapan_siswa: string;
  foto_profil: string;
}

export default function BiodataListPage() {
  const [biodataList, setBiodataList] = useState<Biodata[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await getAllBiodata(token || '');
        setBiodataList(res.data); // adjust this depending on your backend
      } catch (err) {
        console.error('Error fetching biodata:', err);
        alert('Gagal mengambil biodata.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-cyan-500/30">
                <FlaskConical className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
            </div>
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            Semua Biodata Siswa
          </h1>
          <div className="inline-flex items-center space-x-2 bg-cyan-500/20 border border-cyan-400/30 rounded-full px-4 py-2 mt-4">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 text-xs font-bold">Accessible by Guru</span>
          </div>
        </div>

        {loading ? (
          <p className="text-white text-center animate-pulse">Mengambil data...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {biodataList.map((bio) => (
              <div
                key={bio.id}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-white shadow-xl hover:shadow-cyan-500/10 transition-all duration-300"
              >
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={bio.foto_profil}
                    alt={bio.nama}
                    fill
                    className="object-cover rounded-xl border border-white/10"
                  />
                </div>

                <div className="text-sm text-gray-200 space-y-1">
                  <p><strong>Ayah:</strong> {bio.nama_ayah} ({bio.pekerjaan_ayah})</p>
                  <p><strong>Ibu:</strong> {bio.nama_ibu} ({bio.pekerjaan_ibu})</p>
                  <p><strong>Minat:</strong> {bio.minat}</p>
                  <p><strong>Bakat:</strong> {bio.bakat}</p>
                  <p><strong>Cita-cita:</strong> {bio.cita_cita}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
