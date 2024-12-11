// pages/catalog.tsx

'use client'
import { getTickets, updateTickets, deleteTickets } from '@/app/lib/ticketsApi'
import { Ticket } from '@/app/interface/ticket.interface';
import { useEffect, useState } from 'react';
import CatalogList from './components/CatalogList';

export default function Tickets() {
    const [products, setЗroducts] = useState<Ticket[]>([]);

    useEffect(() => {
        fetchProducts();
      }, []);

      const fetchProducts = async () => {
        const data = await getTickets();
        setЗroducts(data);
      };

    return (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-2xl pt-8 pb-10 space-y-6 rounded shadow-md">
            <h2 className="text-3xl text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
              Билеты
              </h2>

          </div>
          <button onClick={() => { window.location.href = '/tickets/my-tickets' }} className="text-center px-6 py-3 h-10 text-sm font-semibold text-gray-500 border border-gray-500 rounded hover:bg-blue-700 hover:text-white transition duration-300 ease-in-out">
              Проверить статус заказа
            </button>
            <CatalogList products={products} />
            <div className='my-5'></div>
            <p className="text-gray-500  text-center underline"><a href="/userAgreementTickets">Перед заказом ознакомьтесь с пользователським соглашением</a> </p>
            <div className='my-5'></div>

        </div>
    )
}
