'use client'

import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

const GraffitiWall = () => {
  const sketchRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const brushColorRef = useRef('#000000');
  const brushSizeRef = useRef(5);

  const [brushColor, setBrushColor] = useState({ r: 0, g: 0, b: 0 });
  const [brushSize, setBrushSize] = useState(5);

  const updateBrushColor = (color: { r: number; g: number; b: number }) => {
    setBrushColor(color);
    brushColorRef.current = `rgb(${color.r}, ${color.g}, ${color.b})`;
  };

  const handleChangeSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBrushSize(Number(event.target.value));
    brushSizeRef.current = Number(event.target.value);
  };

  const handleChangeRGB = (channel: 'r' | 'g' | 'b') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(255, Math.max(0, Number(event.target.value)));
    updateBrushColor({ ...brushColor, [channel]: value });
  };

  useEffect(() => {
    const sketch = new p5((p) => {
      let painting = false;

      const startPainting = () => {
        painting = true;
      };

      const stopPainting = () => {
        painting = false;
      };

      p.setup = () => {
        if (sketchRef.current) {
          const container = sketchRef.current.parentNode as HTMLElement;
          const width = Math.min(window.innerWidth, container.clientWidth);
          const height = width / 2;

          p.createCanvas(width, height).parent(sketchRef.current);
          p.background(255);
          p.noCursor();
        }
      };

      p.draw = () => {
        if (painting) {
          p.stroke(p.color(brushColorRef.current));
          p.strokeWeight(brushSizeRef.current);
          p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
        }
      };

      p.mouseMoved = () => {
        if (isMouseInsideCanvas() && indicatorRef.current) {
          indicatorRef.current.style.left = `${p.mouseX}px`;
          indicatorRef.current.style.top = `${p.mouseY}px`;
        }
      };

      const isMouseInsideCanvas = () => {
        return (
          p.mouseX >= 0 &&
          p.mouseX <= p.width &&
          p.mouseY >= 0 &&
          p.mouseY <= p.height
        );
      };

      p.mousePressed = () => {
        if (isMouseInsideCanvas()) {
          startPainting();
        }
      };

      p.mouseReleased = () => {
        stopPainting();
      };

      p.touchStarted = () => {
        if (isMouseInsideCanvas()) {
          startPainting();
          return false;
        }
      };

      p.touchEnded = () => {
        stopPainting();
        return false;
      };
    });

    return () => {
      sketch.remove();
    };
  }, []);

  return (
    <div>
      <div className="color-selector">
        <label>Цвет:</label>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column', // Ползунки в столбик
            alignItems: 'flex-start',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: `rgb(${brushColor.r}, ${brushColor.g}, ${brushColor.b})`,
              border: '1px solid #000',
            }}
          ></div>
          <div>
            <label htmlFor="red">R:</label>
            <input
              type="range"
              id="red"
              min="0"
              max="255"
              value={brushColor.r}
              onChange={handleChangeRGB('r')}
            />
            <span>{brushColor.r}</span>
          </div>
          <div>
            <label htmlFor="green">G:</label>
            <input
              type="range"
              id="green"
              min="0"
              max="255"
              value={brushColor.g}
              onChange={handleChangeRGB('g')}
            />
            <span>{brushColor.g}</span>
          </div>
          <div>
            <label htmlFor="blue">B:</label>
            <input
              type="range"
              id="blue"
              min="0"
              max="255"
              value={brushColor.b}
              onChange={handleChangeRGB('b')}
            />
            <span>{brushColor.b}</span>
          </div>
        </div>
      </div>
      <div className="size-selector" style={{ marginTop: '20px' }}>
        <label htmlFor="size">Размер кисти: </label>
        <input
          type="range"
          id="size"
          min="1"
          max="100"
          value={brushSize}
          onChange={handleChangeSize}
        />
        <span>{brushSize}</span>
      </div>
      <div ref={sketchRef} className="w-full h-full" style={{ position: 'relative' }}>
        <div
          ref={indicatorRef}
          className="brush-indicator"
          style={{
            position: 'absolute',
            width: `${brushSize}px`,
            height: `${brushSize}px`,
            borderRadius: '50%',
            backgroundColor: `rgba(${brushColor.r}, ${brushColor.g}, ${brushColor.b}, 0.5)`,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
          }}
        />
      </div>
    </div>
  );
};

export default GraffitiWall;
