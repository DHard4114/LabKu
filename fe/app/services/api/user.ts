import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api/users`;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

// ✅ LOGIN
export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const res = await axios.post(`${API_BASE_URL}/login`, credentials, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

// ✅ CREATE - Tambah user (Guru Only)
export const createUser = async (
  data: CreateUserPayload,
  token: string
): Promise<User> => {
  const res = await axios.post(API_BASE_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

// ✅ GET ALL - Semua user (Guru Only)
export const getAllUsers = async (token: string): Promise<User[]> => {
  const res = await axios.get(API_BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ✅ GET DETAIL - User by ID
export const getUserById = async (
  id: string,
  token: string
): Promise<User> => {
  const res = await axios.get(`${API_BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const registerUser = async (
  data: CreateUserPayload
): Promise<User> => {
  const res = await axios.post(API_BASE_URL, data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

// ✅ UPDATE - Update user
export const updateUser = async (
  id: string,
  data: Partial<CreateUserPayload>,
  token: string
): Promise<User> => {
  const res = await axios.put(`${API_BASE_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

// ✅ LOGOUT - Hapus token dan arahkan keluar
export const logoutUser = (): void => {
  localStorage.removeItem('token');
  // Optional: hapus data user jika kamu simpan
  // localStorage.removeItem('user');

  // Redirect to login or home
  window.location.href = '/auth/login'; // atau '/'
};

// ✅ DELETE - Hapus user
export const deleteUser = async (
  id: string,
  token: string
): Promise<{ message: string }> => {
  const res = await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
