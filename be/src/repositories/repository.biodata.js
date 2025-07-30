const db = require('../database/db');

exports.getAllBiodata = async () => {
    const result = await db.query('SELECT * FROM biodata_siswa');
    return result.rows;
};

exports.getBiodataById = async (id) => {
    const result = await db.query('SELECT * FROM biodata_siswa WHERE id = $1', [id]);
    return result.rows[0];
};

exports.createBiodata = async (data) => {
    const {
        user_id, nama, tempat_lahir, tanggal_lahir, alamat, foto_profil,
        nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu,
        minat, bakat, cita_cita, harapan_setahun, harapan_lulus,
        kegiatan_harian, ekstrakurikuler
    } = data;
    const result = await db.query(
        `INSERT INTO biodata_siswa (
            user_id, nama, tempat_lahir, tanggal_lahir, alamat, foto_profil,
            nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu,
            minat, bakat, cita_cita, harapan_setahun, harapan_lulus,
            kegiatan_harian, ekstrakurikuler
        ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17
        ) RETURNING *`,
        [
            user_id, nama, tempat_lahir, tanggal_lahir, alamat, foto_profil,
            nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu,
            minat, bakat, cita_cita, harapan_setahun, harapan_lulus,
            kegiatan_harian, ekstrakurikuler
        ]
    );
    return result.rows[0];
};

exports.updateBiodata = async (id, data) => {
    const {
        nama, tempat_lahir, tanggal_lahir, alamat, foto_profil,
        nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu,
        minat, bakat, cita_cita, harapan_setahun, harapan_lulus,
        kegiatan_harian, ekstrakurikuler
    } = data;
    const result = await db.query(
        `UPDATE biodata_siswa SET
            nama=$1, tempat_lahir=$2, tanggal_lahir=$3, alamat=$4, foto_profil=$5,
            nama_ayah=$6, pekerjaan_ayah=$7, nama_ibu=$8, pekerjaan_ibu=$9,
            minat=$10, bakat=$11, cita_cita=$12, harapan_setahun=$13, harapan_lulus=$14,
            kegiatan_harian=$15, ekstrakurikuler=$16, updated_at=NOW()
        WHERE id=$17 RETURNING *`,
        [
            nama, tempat_lahir, tanggal_lahir, alamat, foto_profil,
            nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu,
            minat, bakat, cita_cita, harapan_setahun, harapan_lulus,
            kegiatan_harian, ekstrakurikuler, id
        ]
    );
    return result.rows[0];
};

exports.deleteBiodata = async (id) => {
    const result = await db.query('DELETE FROM biodata_siswa WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};