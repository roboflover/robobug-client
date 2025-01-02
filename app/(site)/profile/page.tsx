'use client';

import { useEffect, useState } from 'react';
import { fetchUserProfile } from '@/app/lib/profile';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
// import ChangePasswordForm from './components/ChangePasswordForm';  // Импортируем новый компонент
import {STLFileUploader} from '@/app/(site)/components/modelUpload'

interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: string;
}

export default function Profile() {
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, setIsAuthenticated, logout, userId, token } = useAuth();

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                if (userId) {
                    const data = await fetchUserProfile(userId.toString());
                    setUserProfile(data);
                }
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        setIsAuthenticated(false);
                        logout();
                        router.push('/');
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        getUserProfile();
    }, [logout, router, setIsAuthenticated, userId]);

    return (
        <div>
            <h1>Профиль</h1>
            {loading ? (
                <p>Loading...</p>
            ) : userProfile ? (
                <div>
                    <p>Имя: {userProfile.name}</p>
                    <p>Почта: {userProfile.email}</p>
                    <p>Роль: {userProfile.role}</p>
                    {/* <ChangePasswordForm token={token} />   */}
                    <h1>3D Model Viewer</h1>
                    <p>Upload your STL file to preview the model:</p>
                    <STLFileUploader />
                </div>
            ) : (
                <p>Ошибка загрузки профиля</p>
            )}

        </div>
    );
}
