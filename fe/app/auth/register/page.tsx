'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '../../services/api/user';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterPayload>({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser(form);

      alert('Registrasi berhasil! Silakan login.');
      router.push('/auth/login');
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
      ) {
        alert((error as { response?: { data?: { message?: string } } }).response!.data!.message);
      } else {
        alert('Terjadi kesalahan saat registrasi');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-xs bg-white p-6 rounded-lg shadow-md space-y-5"
      >
        <h1 className="text-xl font-semibold text-center">Register</h1>

        <input
          type="text"
          name="name"
          placeholder="Nama lengkap"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          {loading ? 'Loading...' : 'Daftar'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <a href="/auth/login" className="text-indigo-600 hover:underline">
            Masuk di sini
          </a>
        </p>
      </form>
    </div>
  );
}
