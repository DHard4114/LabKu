'use client';


import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useAuth() {
    const router = useRouter();

    const login = useCallback((token: string, userId: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', userId);
        window.dispatchEvent(new Event('tokenChanged'));
        router.push('/');
    }, [router]);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        router.push('/auth/login');
    }, [router]);

    const getToken = useCallback(() => {
        return localStorage.getItem('token');
    }, []);

    const getUserId = useCallback(() => {
        return localStorage.getItem('user_id');
    }, []);

    return {
        login,
        logout,
        getToken,
        getUserId
    };
}
