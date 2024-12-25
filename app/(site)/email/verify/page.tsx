'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type VerificationStatus = 'loading' | 'success' | 'error';

const EmailVerify: React.FC = () => {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('loading');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Извлекаем токен из URL вручную
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    setToken(tokenFromUrl);

    if (!tokenFromUrl) {
      setVerificationStatus('error');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await axios.get('/api/auth/verify-email', {
          params: { token: tokenFromUrl },
        });

        if (response.status === 200) {
          setVerificationStatus('success');
          router.push('https://robobug.ru/registerSuccess');
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        console.error('Ошибка при подтверждении email:', error);
        setVerificationStatus('error');
      }
    };

    verifyEmail();
  }, [router]);

  if (verificationStatus === 'loading') {
    return <p>Подтверждение email...</p>;
  }

  if (verificationStatus === 'success') {
    return <p>Email успешно подтвержден!</p>;
  }

  return <p>Ошибка подтверждения email. Попробуйте еще раз.</p>;
};

export default EmailVerify;
