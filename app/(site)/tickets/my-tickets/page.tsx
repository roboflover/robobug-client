'use client'

import React, { useState } from 'react';
import OrderList from './components/OrderList';
import { Ticket } from '@/app/interface/ticket.interface';

const OrderCompleted = () => {
    const [email, setEmail] = useState('');
    const [orders, setOrders] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    };
  
    const handleFetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/ticket/getTickets?email=${email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError('Ошибка при загрузке заказов.');
      } finally {
        setLoading(false);
      }
    };
  
    const handleDeleteOrder = (id: number) => {
      setOrders(orders.filter(order => order.id !== id));
    };

    return (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Ваши билеты</h2>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Введите вашу электронную почту"
              className="p-2 border rounded w-full"
            />
            <button
              onClick={handleFetchOrders}
              disabled={loading || !email}
              className="mt-2 p-2 bg-blue-500 text-white rounded w-full disabled:bg-gray-500"
            >
              {loading ? 'Загрузка...' : 'Получить заказы'}
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <OrderList orders={orders} onDelete={handleDeleteOrder} />
        </div>
      );
    };

 
export default OrderCompleted;


