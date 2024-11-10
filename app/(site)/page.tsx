'use client'
import { getTodos, updateTodo, deleteTodo, Todo } from '../lib/projectsApi';
import { useEffect, useState } from 'react';
import TodoList from './components/TodoList';

export default function Exhibitions() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [message, setMessage] = useState<string>('')

    useEffect(() => {
        // Переадресация на страницу /print3d
        // window.location.href = '/print3d';
        
        // Если вы хотите сначала загрузить данные, а затем переадресовать
        fetchTodos();
    }, []);
    
    const fetchTodos = async () => {
        const data = await getTodos();
        setTodos(data);
    };

    return (
        <div>
            <p>Мы создаем робото-скульптуры из цивилизации про Галактику Кибернетическую </p>
            
            <p><a href='/print3d' className='underline'>А также печатаем детали на 3д принтере, которые вы можете заказать тут</a></p>

            <p><a href='https://vk.com/robojuk' className='underline'>Группа вконтакте</a></p>
            <TodoList todos={todos}  />
        </div>
    )
}
