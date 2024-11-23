// pages/graffiti.tsx (или .js, если вы используете JavaScript)

import dynamic from 'next/dynamic';

// Импортируйте GraffitiWall динамически и отключите серверный рендеринг
const GraffitiWall = dynamic(() => import('./components/GraffitiWall'), { ssr: false });

const GraffitiPage = () => {
  return (
    <div>
      <GraffitiWall />
    </div>
  );
};

export default GraffitiPage;