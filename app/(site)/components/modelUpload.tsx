// STLFileUploader.tsx

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { STLModel } from '@/app/(site)/print3d/components/STLModel';

interface STLFileUploaderProps {}

export const STLFileUploader: React.FC<STLFileUploaderProps> = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<THREE.Vector3 | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile && selectedFile.name.endsWith('.stl')) {
      const url = URL.createObjectURL(selectedFile);

      setFileName(selectedFile.name);
      setModelUrl(url);
    } else {
      alert('Only .stl files are allowed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <input type="file" accept=".stl" onChange={handleFileChange} />
      {fileName && <p>File Name: {fileName}</p>}
      {modelUrl && (
        <div className="w-full h-[50vh]">
          <Canvas camera={{ position: [5, 5, 10], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            <directionalLight position={[-5, -10, 0]} intensity={1} />
            <STLModel url={modelUrl} setDimensions={setDimensions} />
            <OrbitControls />
          </Canvas>
        </div>
      )}
    </div>
  );
};

