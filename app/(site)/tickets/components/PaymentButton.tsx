
import { YooCheckout, ICreatePayment } from '@a2seven/yoo-checkout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Ticket } from '@/app/interface/ticket.interface';
import { OrderTicket } from '@/app/interface/order-ticket.interface';
import ErrorPopup from '../../print3d/components/ErrorPopup';

const host = process.env.NEXT_PUBLIC_SERVER;
const api = axios.create({
  baseURL: host,
});

const PaymentButton: React.FC<OrderTicket> = ({ email, ...data }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payLink, setPaylink] = useState('');

  const handleCreatePayment = async () => {
    const requestData: ICreatePayment = {
      amount: {
        value: data.price,
        currency: 'RUB',
      },
      payment_method_data: {
        type: 'sbp',
      },
      confirmation: {
        type: 'redirect',
        return_url: 'https://robobug.ru/tickets/my-tickets',
      },
      capture: true,
      receipt: {
        customer: {
          full_name: 'Ivan Ivanov',
          email: 'customerEmail@data.ru',
          phone: '+74554654',
        },
        items: [
          {
            description: data.title,
            quantity: '1.00',
            amount: {
              value: data.price,
              currency: 'RUB',
            },
            vat_code: 1,
          },
        ],
      },
    };

    setLoading(true);
    setError(null);

    try {
      const checkoutResponse = await fetch('/api/yookassa/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requestData,
        }),
      });

      if (!checkoutResponse.ok) {
        throw new Error('Произошла ошибка при создании платежа.');
      }

      const checkoutData = await checkoutResponse.json();
      if (!checkoutData) {
        throw new Error('Произошла ошибка при получении данных платежа.');
      }
      const formData = new FormData();
      formData.append('paymentId', checkoutData.id.toString());
      formData.append('title', data.title);
      formData.append('price', data.price.toString());
      formData.append('description', data.description || '');
      
      if(email)
        formData.append('email', email);
      
      const uploadResponse = await fetch(`${host}/order-ticket/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Произошла ошибка при загрузке данных заказа.');
      }

      const confUrl = checkoutData.confirmation.confirmation_url;
      setPaylink(confUrl);

    } catch (error) {
      // console.error(error);
      setError('Произошла ошибка при создании платежа.');
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = email === '' || loading || payLink !== '';

  return (
    <div className="flex w-full items-center justify-center">
      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
      <button
        onClick={handleCreatePayment}
        disabled={isButtonDisabled}
        className={`py-2 px-4 rounded-xl w-full max-w-xs text-white font-bold transition duration-300 ease-in-out transform active:scale-95 focus:outline-none focus:ring-4 ${
          isButtonDisabled
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-300'
        }`}
      >
        {loading ? 'Создается платеж...' : 'Оплатить по СБП'}
      </button>
    </div>
  );
};

export default PaymentButton;