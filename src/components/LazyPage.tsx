// src/components/LazyPage.tsx
import React, { Suspense } from 'react';
import Loader from './Loader';

interface LazyPageProps {
  component: React.LazyExoticComponent<React.FC>;
}

const LazyPage: React.FC<LazyPageProps> = ({ component: Component }) => {
  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  );
};

export default LazyPage;
