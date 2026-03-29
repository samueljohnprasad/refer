import React, { lazy } from 'react';
import SuspensLoader from '@/src/components/SuspensLoader';

const GratitudeReframeScreen = lazy(
  () => import('@/src/screens/GratitudeReframeScreen/GratitudeReframeScreen')
);

export default function GratitudeReframeRoute() {
  return (
    <SuspensLoader>
      <GratitudeReframeScreen />
    </SuspensLoader>
  );
}
