import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';

interface ChangePasswordFormProps {
    token: string | null;
}

export default function ChangePasswordForm({ token }: ChangePasswordFormProps) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

    const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const handleChangePassword = async (event: React.FormEvent) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordChangeError('Пароли не совпадают');
            return;
        }
        try {
            const host = process.env.NEXT_PUBLIC_SERVER;
            const response = await axios.post(`${host}/auth/change-password`, {
                oldPassword,
                newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Password changed successfully:', response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setPasswordChangeError(error.response?.data.message || 'Ошибка смены пароля');
            } else {
                setPasswordChangeError('Ошибка смены пароля');
            }
        }
    };

    return (
        <form onSubmit={handleChangePassword} className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
                <label htmlFor="old-password" className="block text-sm font-bold mb-2">Старый пароль:</label>
                <input
                    type={oldPasswordVisible ? "text" : "password"}
                    id="old-password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                />
                <small
                    onClick={() => setOldPasswordVisible(!oldPasswordVisible)}
                    className="cursor-pointer text-xs">
                    {oldPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
                </small>
            </div>
            <div className="mb-4">
                <label htmlFor="new-password" className="block text-sm font-bold mb-2">Новый пароль:</label>
                <input
                    type={newPasswordVisible ? "text" : "password"}
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                />
                <small
                    onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                    className="cursor-pointer text-xs">
                    {newPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
                </small>
            </div>
            <div className="mb-4">
                <label htmlFor="confirm-password" className="block text-sm font-bold mb-2">Повторите новый пароль:</label>
                <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                />
                <small
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    className="cursor-pointer text-xs">
                    {confirmPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
                </small>
            </div>
            {passwordChangeError && <p className="text-red-500 text-xs italic">{passwordChangeError}</p>}
            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                > Сменить пароль
                </button>
            </div>
        </form>
    );
}
