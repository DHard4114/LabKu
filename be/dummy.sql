CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('admin', 'siswa', 'guru');

CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    nama VARCHAR(100)NOT NULL,;
    password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'siswa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE biodata_siswa (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    nama VARCHAR(100) NOT NULL,
    tempat_lahir VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    alamat TEXT NOT NULL,
    foto_profil VARCHAR(255),
    nama_ayah VARCHAR(100) NOT NULL,
    pekerjaan_ayah VARCHAR(100),
    nama_ibu VARCHAR(100) NOT NULL,
    pekerjaan_ibu VARCHAR(100),
    minat TEXT NOT NULL,
    bakat TEXT NOT NULL,
    cita_cita TEXT NOT NULL,
    harapan_setahun TEXT NOT NULL,
    harapan_lulus TEXT NOT NULL,
    kegiatan_harian TEXT NOT NULL,
    ekstrakurikuler TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
ALTER TABLE users ADD COLUMN name VARCHAR(100);

-- Trigger untuk auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_biodata_siswa_updated_at
    BEFORE UPDATE ON biodata_siswa
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();