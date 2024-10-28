'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Добавленное состояние для видимости пароля
  const router = useRouter();
  const { login, error, role } = useAuth();
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingLogs, setLoadingLogs] = useState<string[]>([]);

  useEffect(() => {
    document.cookie = 'cookieName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingLogs(['Form submitted']);

    try {
      setLoadingLogs((prevLogs) => [...prevLogs, "Attempting login"]);
      const rolePlayer = await login(email, password);
      setLoadingLogs((prevLogs) => [...prevLogs, `Role Player: ${rolePlayer}`]);

      if (rolePlayer !== null) {
        localStorage.setItem('user', JSON.stringify({ email, role: rolePlayer }));
        setIsLoginSuccessful(true);
        setLoginError(null);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoadingLogs((prevLogs) => [...prevLogs, 'Login error']);
      setIsLoginSuccessful(false);
      setLoginError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoginSuccessful) {
      if (role === 'user') {
        router.push('/profile');
      } else if (role === 'admin') {
        router.push('/admin/dashboard');
      } else if (role === 'promoter') {
        router.push('/profile');
      }
    }
  }, [isLoginSuccessful, role, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Вход в личный кабинет</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <div className='flex justify-between w-full my-5'>
            <button className='border border-blue-500 rounded-md px-2 py-1 m-2'  type='button' onClick={()=>router.push('/register')}>Регистрация</button>
            <button className='border border-blue-500 rounded-md px-2 py-1 m-2'  type='button' onClick={()=>router.push('/passwordReset')}>Восстановить пароль</button>
            </div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"} // Изменен тип инпута в зависимости от видимости пароля
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700"
                onClick={() => setShowPassword(!showPassword)} // Обработчик клика для переключения видимости пароля
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Вход
          </button>
          {loginError && <p className="mt-2 text-sm text-red-600">{loginError}</p>}
        </form>
        {loading && (
          <div className="mt-4 p-4 bg-gray-200 rounded">
            <h3 className="text-sm font-medium">Loading logs:</h3>
            <ul className="text-xs">
              {loadingLogs.map((log, index) => (
                <li key={index}>{log}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}