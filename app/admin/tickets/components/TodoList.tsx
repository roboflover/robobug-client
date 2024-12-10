import React from 'react';
import { Ticket } from '@/app/interface/ticket.interface';
import Image from 'next/image';

interface TodoListProps {
  tickets: Ticket[];
  onDelete: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ tickets, onDelete }) => {
  // console.log(tickets)
  return (
    <ul className="space-y-2">
      {tickets.map((todo) => (
        <li key={todo.id} className="flex items-center justify-between p-2 border rounded bg-gray-800 text-white">
          <div className="flex-grow">
           <span
              className={`block  'line-through' }`}
            > 
              {todo.title}
            </span>
            {todo.description && (
              <span
                className={`block text-gray-400 'line-through'  ''}`}
              >
                {todo.description}
              </span>
  
            )}
            {todo.price && (
              <span
                className={`block text-gray-400 'line-through'  ''}`}
              >
                {todo.price}
              </span>
  
            )}
            {todo.imageUrl && (
                <div className="flex flex-col items-center">
                  <Image
                    src={todo.imageUrl}
                    alt={`Exhibition ${todo.title}`}
                    width={800}
                    height={600}
                    className="max-w-full h-auto rounded"
                    priority={true}
                  />
                </div>
              )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onDelete(todo.id)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;