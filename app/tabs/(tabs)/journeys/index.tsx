import SuspensLoader from '@/src/components/SuspensLoader';
import React, { lazy } from 'react';

const JourneyCatalogScreen = lazy(
    () => import('@/app/tabs/screens/JourneyCatalogScreen/JourneyCatalogContainer'),
);

export default function JourneysTab(): React.JSX.Element {
    return (
        <SuspensLoader>
            <JourneyCatalogScreen />
        </SuspensLoader>
    );
}
