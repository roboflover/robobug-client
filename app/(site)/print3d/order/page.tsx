
'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import RegionSelector from '../components/RegionSelector';
import PointSelector from '../components/PointSelector';
import Calculator from '../components/Calculator';
import axios from 'axios';
import PaymentButton from '../components/PaymentButton';
import { OrderPrint3dProps } from '../interface/zakazProps.interface';
import { updateAdress, updateCity, updateDeliveryPoint } from '../utils/update';
import { changeColorName } from '../utils/color';
import { regionStarter } from '../utils/config';
import { useOrder } from '@/app/context/OrderContext'; // Правильный импорт
import Modal from './components/Modal';
import YandexMap from './components/YandexMap';
import { RegionData } from '../interface/RegionData.interface';
import { DeliveryPoint } from '../interface/DeliveryPoint.interface';
import { Checkbox } from "@/components/ui/checkbox"

const host = process.env.NEXT_PUBLIC_SERVER;
const api = axios.create({
  baseURL: host,
});

type ValidationResult = {
  valid: boolean;
  reason?: string;
};

type Model3dDetail = {
  fileName: string;
  volume: number;
  color?: string;
  material: string;
  dimensions: string;
};

export interface DataProps {
  dimensions: THREE.Vector3 | null;
  volume: number;
  material: string;
  color: string;
  email: string;
  fileName: string;
  summa: number;
  quantity: number;
}

const initialData: DataProps = {
  dimensions: null,
  volume: 0,
  material: 'PLA',
  color: '#8A8D8F',
  email: '',
  fileName: '',
  summa: 0,
  quantity: 1,
};

interface RegionCoord {
  lat: string;
  lon: string;
}

const Order = () => {
  const { file, currentOrder, setCurrentOrder } = useOrder();
  const [selectedRegion, setSelectedRegion] = useState<RegionData>(regionStarter);
  const [regionCoord, setRegionCoord] = useState<RegionCoord>({ lat: '', lon: '' });
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [deliverySum, setDeliverySum] = useState<number>(0);
  const formRef = useRef<HTMLFormElement>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deliveryPoints, setDeliveryPoints] = useState<DeliveryPoint[]>([]);
  const [selfPickup, setSelfPickup] = useState<boolean>(false);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const checkFormValidity = useCallback(() => {

    const { customerName, customerEmail, customerPhone } = currentOrder;
    if (
      !selfPickup &&
      customerName.trim() !== '' &&
      customerEmail.trim() !== '' &&
      customerPhone.trim() !== '' &&
      (selectedAddress.trim() !== '' || selectedDeliveryPoint !== '')
    ) {
      setDeliverySum(400)
      setIsFormValid(true);
    } else if(
      customerName.trim() !== '' &&
      customerEmail.trim() !== '' &&
      customerPhone.trim() !== '' &&
      selfPickup
    ) {
      setDeliverySum(0)
      setIsFormValid(true);
    } else {setIsFormValid(false); } 
    
  }, [currentOrder, selectedAddress, selfPickup]);

  useEffect(() => {
    checkFormValidity();
  }, [
    currentOrder.customerName,
    currentOrder.customerEmail,
    currentOrder.customerPhone,
    selectedAddress,
    checkFormValidity,
    selfPickup
  ]);

  useEffect(() => {
    const totalSum = calculateSummaAndPrice(currentOrder.volume, currentOrder.quantity);
    setCurrentOrder(prevOrder => ({ ...prevOrder, summa: totalSum }));
  }, [currentOrder.volume, currentOrder.quantity]);

  useEffect(() => {
    handleRegionSelect(regionStarter);
  }, []);

  useEffect(() => {
    if (!areDimensionsFilled) {
      window.location.href = '/print3d';
    }
  }, []);

  const handleRegionSelect = (region: RegionData) => {
    updateCity(region.region, setCurrentOrder);
    setSelectedRegion(region);
    handleGeocode(region.region);
  };

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
  };

  const handleDeliveryPointSelect = (deliveryPoint: string) => {
    updateDeliveryPoint(deliveryPoint, setCurrentOrder);
    updateAdress(deliveryPoint, setCurrentOrder);
    setSelectedDeliveryPoint(deliveryPoint);
  };

  const handleGeocode = async (region: string) => {
    try {
      const response = await axios.get('/api/geocode', { params: { region } });
      const obj = {
        lat: response.data.lat,
        lon: response.data.lon,
      };
      setRegionCoord(obj);
    } catch (err) {
      console.error('Произошла ошибка при геокодировании', err);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setCurrentOrder({ ...currentOrder, customerEmail: email });
  };

  const handleDeliveryPointsChange = (points: DeliveryPoint[]) => {
    setDeliveryPoints(points);
  };

  const handleDeliveryPointClick = (point: DeliveryPoint) => {
    const address = point.code; // `${point.code}, ${point.location.address}`;
    setSelectedDeliveryPoint(address);
    updateAdress(`${point.code}, ${point.location.address}`, setCurrentOrder);
    setIsModalVisible(false);
  };

  // const model3dDetail: Model3dDetail = {
  //   fileName: currentOrder.fileName,
  //   volume: currentOrder.volume,
  //   color: changeColorName(currentOrder.color),
  //   material: currentOrder.material,
  //   dimensions: JSON.stringify(1),
  // };

  const areDimensionsFilled = currentOrder.width && currentOrder.length && currentOrder.height;

  return (
    <div className="flex flex-col mx-auto p-4">
      {areDimensionsFilled ? (
        <>
          <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
            Оформление заказа
          </h2>
          <form ref={formRef} className="flex flex-col items-center">
            <div className="max-w-xs mx-auto my-2 pb-5 pt-2 px-5 rounded-lg border border-gray-500 shadow-lg overflow-hidden">
              <h2 className="text-1xl font-bold italic text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
                Описание
              </h2>
              <ul className="mb-2">
                <li>
                  Размер: {(currentOrder.width)?.toFixed()} х {(currentOrder.length)?.toFixed()} х {(currentOrder.height)?.toFixed()} (мм)
                </li>
                <li>Материал: {currentOrder.material}</li>
                <li>Цвет: {changeColorName(currentOrder.color)}</li>
                <li>Количество: {currentOrder.quantity} шт</li>
                <li className="font-semibold relative p-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-pink-500 rounded"></div>
                  <div className="relative">Сумма заказа: {`${currentOrder.summa.toFixed(0)}₽`}</div>
                </li>
              </ul>
              <h2 className="text-1xl font-bold italic text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
                Получатель
              </h2>
              <ul className="mb-2">
                <li className="flex flex-initial items-center mb-2">
                  <input
                    type="text"
                    id="fullName"
                    value={currentOrder.customerName}
                    onChange={(e) => setCurrentOrder({ ...currentOrder, customerName: e.target.value })}
                    required
                    className="border p-1 rounded mx-auto w-full"
                    placeholder="ФИО"
                  />
                </li>
                <li className="flex flex-initial items-center mb-2">
                  <input
                    type="email"
                    id="email"
                    value={currentOrder.customerEmail}
                    onChange={handleEmailChange}
                    required
                    className="border p-1 rounded mx-auto w-full"
                    placeholder="Ваша почта"
                  />
                </li>
                <li className="flex flex-initial items-center mb-2">
                  <input
                    type="text"
                    id="phone"
                    value={currentOrder.customerPhone}
                    onChange={(e) => setCurrentOrder({ ...currentOrder, customerPhone: e.target.value })}
                    required
                    className="border p-1 rounded mx-auto w-full"
                    placeholder="Телефон"
                  />
                </li>
                <li className="flex flex-initial items-center mb-2">
                  <input
                    type="text"
                    id="comment"
                    value={currentOrder.comment}
                    onChange={(e) => setCurrentOrder({ ...currentOrder, comment: e.target.value })}
                    className="border p-1 rounded mx-auto w-full"
                    placeholder="Комментарий"
                  />
                </li>
              </ul>
              <h2 className="text-1xl font-bold italic text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
                Самовывоз
              </h2>
              <div className="flex items-center justify-center">
              <input 
                type="checkbox" 
                checked={selfPickup}
                onChange={() => setSelfPickup(prev => !prev)} 
                id="terms1" 
      />
                  <label htmlFor="terms1" className="ml-2 text-center">
                  </label>
              </div>
                <p className="mb-5 text-sm text-muted-foreground text-center mt-2">
                  По адресу: Московское шоссе, 25к1В
                </p>

              <div className="items-top flex space-x-2">
              <div className="flex flex-col items-center">

</div>
    </div>
              {!selfPickup && (
                <>
                  <h2 className="text-1xl font-bold italic text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
                    Доставка
                  </h2>
                  <ul className="mb-2">
                    <li className='m-auto text-center'><label htmlFor="email">Оператор доставки: CDEK</label></li>
                    <RegionSelector onRegionSelect={handleRegionSelect} />
                    <li className='m-auto text-center my-4'><label htmlFor="email">Выберите пункт выдачи заказа из списка либо на карте</label></li>
                    <PointSelector
                      selectedRegion={selectedRegion}
                      onAddressSelect={handleAddressSelect}
                      onDeliveryPointSelect={handleDeliveryPointSelect}
                      onDeliveryPointsChange={handleDeliveryPointsChange}
                    />
                    <div className="inline-block text-center w-full">
                      <p className='mt-2'>или</p>
                      <button type="button" onClick={openModal} className="border w-full border-blue-300 hover:border-blue-800 rounded p-3 my-3 items-center">
                        <p>Выберите ПВЗ на карте</p>
                      </button>
                      <Modal isVisible={isModalVisible} onClose={closeModal}>
                        <YandexMap
                          selectedRegion={regionCoord}
                          onDeliverySumChange={setDeliverySum}
                          deliveryPoints={deliveryPoints}
                          onDeliveryPointClick={handleDeliveryPointClick}
                        />
                      </Modal>
                      {selectedDeliveryPoint !== '' && (
                        <p className='mb-2 font-bold border border-red-500 rounded animation-blink p-2 '>
                          Ваш ПВЗ: {selectedDeliveryPoint}
                        </p>
                      )}
                    </div>
                    <li className="font-semibold relative p-1">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-pink-500 rounded"></div>
                      <Calculator selectedRegion={selectedRegion} onDeliverySumChange={setDeliverySum} />
                    </li>
                  </ul>
                </>
              )}
              <div>
                <PaymentButton
                  formRef={formRef}
                  currentOrder={currentOrder}
                  value={currentOrder.summa + deliverySum}
                  isFormValid={isFormValid}
                  file={file}
                  deliverySum={deliverySum}
                  toLocationCode={selectedRegion.country_code}
                  selectedDeliveryPoint={selectedDeliveryPoint}
                  selfPickup={selfPickup}
                />
              </div>
            </div>
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center ">
          <div>
            <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
              Перенаправление...
            </h2>
          </div>
          <button
            onClick={() => {
              window.location.href = '/print3d/my-orders';
            }}
            className="inline-block text-center m-10 px-6 py-3 h-10 text-sm font-semibold text-gray-500 border border-gray-500 rounded hover:bg-blue-700 hover:text-white transition duration-300 ease-in-out"
          >
            Проверить статус заказа
          </button>
        </div>
      )}
    </div>
  );
};

const calculateSummaAndPrice = (volume: number, quantity: number): number => {
  const pricePerCm3 = 20; // Цена за кубический сантиметр
  let newprice = volume * pricePerCm3;
  if (newprice < 45) {
    newprice = 45;
  }
  return newprice * quantity;
};

export default Order;