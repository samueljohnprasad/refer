import React, { lazy } from 'react';
import SuspensLoader from '@/src/components/SuspensLoader';

const ThoughtReframingScreen = lazy(
  () => import('@/src/screens/ThoughtReframingScreen/ThoughtReframingScreen')
);

export default function ThoughtReframingRoute() {
  return (
    <SuspensLoader>
      <ThoughtReframingScreen />
    </SuspensLoader>
  );
}
