import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import PaymentButton from './PaymentButton';
import { Ticket } from '@/app/interface/ticket.interface';


interface CatalogListProps {
  products: Ticket[];
}

const CatalogList: React.FC<CatalogListProps> = ({ products }) => {

  const [email, setEmail] = useState('')
  
  useEffect(() => {
  }, [setEmail]);


  return (
    <div>
      <ul className="space-y-4">
        {products.map((product) => (
          <li key={product.id} className="flex flex-col p-4 border border-blue-500 rounded-3xl ">
            <div className="flex flex-col items-center">
              <h3 className="mt-4 mb-8 font-bold text-3xl">{product.title}</h3>
              <div className="flex flex-col items-center">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={`Ticket ${product.title}`}
                      width={400}
                      height={350}
                      className="max-w-full h-auto rounded"
                      priority={true}
                    />
                  ) : (
                    <p>No image available</p> // Заглушка, если нет изображения
                  )}
                </div>
                  


        
              <p className="mt-2 mx-6 w-full max-w-xl text-center">{product.description}</p>
              <div className="flex flex-initial items-center mb-2 ">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value )}
                  required
                  className="border p-1 rounded mx-auto"
                  placeholder="Ваша почта" // Добавляем placeholder
                />
              </div>
              <p className="mt-2 text-xl font-semibold italic border border-blue-500 p-2 rounded-lg" style={{ borderColor: 'rgba(59, 130, 246, 0.5)' }}>
                {product.price}&nbsp;₽
              </p>

            </div>
            <div className="flex items-center justify-center mt-4">
            <PaymentButton {...product} email={email}/>
              {/* <buttononClickproduct{() => handleAddToCart(product.id, product.title, Number(product.price.toFixed(0)))} className="px-4 py-2 text-white bg-blue-500 rounded-xl">
                Оформитьproduct
              </button> */}
            </div>
          </li>
        ))}
      </ul>
      {/* <Modal isOpen={isOpen} setIsOpen={setIsOpen} product={selectedProduct} /> */}
    </div>
  );
};

export default CatalogList;
