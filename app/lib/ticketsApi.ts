import axios from 'axios';
import { Ticket } from '@/app/interface/ticket.interface';

const host = process.env.NEXT_PUBLIC_SERVER;
const api = axios.create({
  baseURL: host, // замените на ваш URL сервера
});

export const getTickets = async (): Promise<Ticket[]> => {
  try {
    const response = await api.get('/tickets');
    return response.data;
  } catch (error) {
    // console.error('Error fetching tickets:', error);
    throw error;
  }
};

export const createTickets = async (data: Ticket): Promise<Ticket> => {
  const response = await api.post('/tickets', { data });
  return response.data;
};

export const updateTickets = async (id: number, data: Ticket): Promise<Ticket> => {
  const response = await api.patch(`/tickets/${id}`, data);
  return response.data;
};

export const deleteTickets = async (id: number): Promise<void> => {
  await api.delete(`/tickets/${id}`);
};
