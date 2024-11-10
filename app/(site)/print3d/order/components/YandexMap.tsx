'use client';

import React, { useEffect, useState } from 'react';
import { YMaps, Map, Placemark } from 'react-yandex-maps-no-default-props';
import { RegionData } from '../../interface/RegionData.interface';
import { DeliveryPoint } from '../../interface/DeliveryPoint.interface';

interface RegionCoord {
  lat: string;
  lon: string;
}

interface SelectedRegionProps {
  selectedRegion: RegionCoord;
  onDeliverySumChange: (sum: number) => void;
  deliveryPoints: DeliveryPoint[];
  onDeliveryPointClick: (point: DeliveryPoint) => void;
}

const apiKey = process.env.NEXT_PUBLIC_YMAPS_API_KEY;

const defaultCenter: [number, number] = [55.76, 37.64];

const YandexMap: React.FC<SelectedRegionProps> = ({ selectedRegion, onDeliverySumChange, deliveryPoints, onDeliveryPointClick }) => {
  const [coordinates, setCoordinates] = useState<[number, number]>(defaultCenter);

  useEffect(() => {
    if (selectedRegion.lat && selectedRegion.lon) {
      const newCoordinates: [number, number] = [
        parseFloat(selectedRegion.lat),
        parseFloat(selectedRegion.lon)
      ];

      if (coordinates[0] !== newCoordinates[0] || coordinates[1] !== newCoordinates[1]) {
        setCoordinates(newCoordinates);
      }
    }
  }, [selectedRegion]);

  // Вычисляем границы для всех точек доставки
  const calculateBounds = () => {
    if (deliveryPoints.length === 0) return null;

    let minX = deliveryPoints[0].location.latitude;
    let minY = deliveryPoints[0].location.longitude;
    let maxX = deliveryPoints[0].location.latitude;
    let maxY = deliveryPoints[0].location.longitude;

    deliveryPoints.forEach(point => {
      const lat = point.location.latitude;
      const lon = point.location.longitude;

      if (lat < minX) minX = lat;
      if (lat > maxX) maxX = lat;
      if (lon < minY) minY = lon;
      if (lon > maxY) maxY = lon;
    });

    // Немного расширяем верхнюю границу для учета высоты маркера
    const markerHeightBuffer = 0.001; // Подберите значение в зависимости от масштаба карты
    maxX += markerHeightBuffer;

    return [[minX, minY], [maxX, maxY]];
  };

  const bounds = calculateBounds();

  return (
    <YMaps query={{ load: 'package.full', apikey: apiKey }}>
      <div style={{ width: '100%', height: '100%' }}>
        <Map
          defaultState={{
            zoom: 9,
            controls: [],
          }}
          state={{
            bounds: bounds || undefined,
          }}
          width="100%"
          height="100%"
        >
          {deliveryPoints.map((point) => (
            <Placemark
              key={point.uuid}
              geometry={[point.location.latitude, point.location.longitude]}
              properties={{
                balloonContent: `<strong>${point.name}</strong><br>${point.location.address}`
              }}
              modules={['geoObject.addon.balloon']}
              onClick={() => onDeliveryPointClick(point)}
            />
          ))}
        </Map>
      </div>
    </YMaps>
  );
};

export default YandexMap;
