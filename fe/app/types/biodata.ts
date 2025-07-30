export interface BiodataFormData {
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  foto_profil: File | string | null;
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

export interface Biodata {
  id: string;
  userId: string;
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
  harapan_setahun: string;
  harapan_lulus: string;
  kegiatan_harian: string;
  ekstrakurikuler: string;
  gambaran_diri: string;
  foto_profil: string;
}


