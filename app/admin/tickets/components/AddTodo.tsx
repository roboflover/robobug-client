import React, { useRef, useState } from 'react';
import axios from 'axios';

interface AddTodoProps {
  onTodoAdded: () => void; // Callback функция для обновления списка заданий после добавления нового
}

const AddTodo: React.FC<AddTodoProps> = ({ onTodoAdded }) => {
  const host = process.env.NEXT_PUBLIC_SERVER
  const [selectedPrice, setPrice] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedTitle, setTitle] = useState<string>('');
  const [selectedDescription, setDescription] = useState<string>('');

  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {

    event.preventDefault();
    setError(null);
    setUploadProgress(null);
    setSuccessMessage(null);
  
    if (!selectedFile) {
      setError('Пожалуйста, выберите изображение');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', selectedFile); // Ключ 'file' для файла
    formData.append('title', selectedTitle); // Ключ 'title' для заголовка
    formData.append('description', selectedDescription); // Ключ 'title' для заголовка
    formData.append('price', selectedPrice); // Ключ 'title' для заголовка


    try {
      await axios.post(`${host}/tickets/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });
  
      setSelectedFile(null);
      setUploadProgress(null);
      setSuccessMessage('Задание успешно добавлено');
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Очистка поля ввода
      }
      setTitle('');
      setDescription('');
      onTodoAdded(); // Вызов callback функции после успешного добавления
    } catch (error) {
      console.log(error)
      setError('Ошибка при добавлении задания или загрузке изображения');
    }
  };
  
  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="border p-2 rounded bg-gray-800 text-white placeholder-gray-500"
        />
        {uploadProgress !== null && (
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4 flex-grow">
            <div
              className="bg-blue-700 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }} // Используем шаблонную строку
            ></div>
          </div>
        )}
        <input
          type="text"
          value={selectedTitle}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите новое задание"
          required
          className="border p-2 rounded w-full bg-gray-800 text-white placeholder-gray-500"
        />
        <textarea
          value={selectedDescription}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Введите описание"
          required
          rows={4} // Количество строк по умолчанию
          className="border p-2 rounded w-full bg-gray-800 text-white placeholder-gray-500"
        ></textarea>
        <input
          type="number"
          value={selectedPrice} // Добавляем состояние для цены
          onChange={(e) => setPrice(e.target.value)} // Обновляем состояние при изменении
          placeholder="Введите цену"
          required
          className="border p-2 rounded w-full bg-gray-800 text-white placeholder-gray-500"
        />
        <button type="submit" className="bg-blue-700 text-white p-2 rounded hover:bg-blue-900">
          Добавить
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
    </div>
  );
  
};

export default AddTodo;