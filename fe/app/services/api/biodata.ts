import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api/biodata`;

export interface BiodataFormData {
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  foto_profil: string;
  nama_ayah: string;
  pekerjaan_ayah: string;
  nama_ibu: string;
  pekerjaan_ibu: string;
  minat: string;
  bakat: string;
  cita_cita: string;
  harapan_setahun: string;
  harapan_lulus: string;
  kegiatan_harian: string;
  ekstrakurikuler: string;
  gambaran_diri: string;
}


export const createBiodata = async (data: FormData, token: string) => {
  const res = await axios.post(API_BASE_URL, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};




export const updateBiodata = async (id: string, data: BiodataFormData, token: string) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'foto_profil' && value instanceof File) {
      formData.append('foto_profil', value);
    } else {
      formData.append(key, value);
    }
  });

  const res = await axios.put(`${API_BASE_URL}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


// ✅ DELETE - Hapus Biodata (Guru Only - pakai token)
export const deleteBiodata = async (id: string, token: string) => {
  const res = await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getAllBiodata = async (token: string) => {
  
  const res = await axios.get(API_BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ GET - Detail Biodata by ID (Guru Only - pakai token)
export const getBiodataById = async (id: string, token: string) => {
  const res = await axios.get(`${API_BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
