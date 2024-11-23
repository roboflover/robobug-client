
'use client';

import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

const GraffitiWall = () => {
  const sketchRef = useRef<HTMLDivElement | null>(null);
  const brushColorRef = useRef('#000000');
  const brushSizeRef = useRef(5);

  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  const handleChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBrushColor(event.target.value);
    brushColorRef.current = event.target.value;
  };

  const handleChangeSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBrushSize(Number(event.target.value));
    brushSizeRef.current = Number(event.target.value);
  };

  useEffect(() => {
    const sketch = (p: p5) => {
      let painting = false;

      p.setup = () => {
        if (sketchRef.current) {
          const container = sketchRef.current.parentNode as HTMLElement;
          const style = getComputedStyle(container);
          const width = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
          const height = width / 2;

          p.createCanvas(width, height).parent(sketchRef.current);
          p.background(255);
        }
      };

      p.draw = () => {
        if (painting) {
          p.stroke(p.color(brushColorRef.current));
          p.strokeWeight(brushSizeRef.current);
          p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
        }
      };

      p.mousePressed = () => {
        painting = true;
      };

      p.mouseReleased = () => {
        painting = false;
      };
    };

    const p5Instance = new p5(sketch);

    return () => {
      p5Instance.remove();
    };
  }, []); // useEffect вызывается только один раз при монтировании компонента

  return (
    <div>
      <div className="color-selector">
        <label htmlFor="color">Цвет: </label>
        <input
          type="color"
          id="color"
          value={brushColor}
          onChange={handleChangeColor}
        />
      </div>
      <div className="size-selector">
        <label htmlFor="size">Размер кисти: </label>
        <input
          type="range"
          id="size"
          min="0"
          max="100"
          value={brushSize}
          onChange={handleChangeSize}
        />
        <span>{brushSize}</span>
      </div>
      <div ref={sketchRef} className="w-full h-full"></div>
    </div>
  );
};

export default GraffitiWall;