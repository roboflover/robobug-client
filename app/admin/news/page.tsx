'use client'
import React, { useEffect, useState } from 'react';
import { getTodos, updateTodo, deleteTodo, Todo } from '../../lib/projectsApi';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';

const Home: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const data = await getTodos();
    setTodos(data);
  };

  const handleDeleteTodo = async (id: number) => {
    await deleteTodo(id);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 bg-gray-900 text-white shadow-md rounded">
      {/* <h1 className="text-2xl font-bold mb-4">Загрузить изображение</h1>
      <ImageUpload /> */}
      <h1 className="text-2xl font-bold mb-4">Новости</h1>
      <AddTodo onTodoAdded={fetchTodos} />
      <TodoList todos={todos} onDelete={handleDeleteTodo} />
    </div>
  );
};

export default Home;