'use client'
import React, { useEffect, useState } from 'react';
import { getTickets, createTickets, updateTickets, deleteTickets } from '../../lib/ticketsApi';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import { Ticket } from '@/app/interface/ticket.interface';

const Home: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const data = await getTickets();
    setTickets(data);
  };

  const handleDeleteTodo = async (id: number) => {
    await deleteTickets(id);
    setTickets(tickets.filter((ticket) => ticket.id !== id));
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 bg-gray-900 text-white shadow-md rounded">
      {/* <h1 className="text-2xl font-bold mb-4">Загрузить изображение</h1>
      <ImageUpload /> */}
      <h1 className="text-2xl font-bold mb-4">Билеты</h1>
      <AddTodo onTodoAdded={fetchTodos} />
      <TodoList tickets={tickets} onDelete={handleDeleteTodo} />
    </div>
  );
};

export default Home;