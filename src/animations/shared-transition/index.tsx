import React, { useState } from 'react';
import { View, Button } from 'react-native';

import { DetailsScreen } from './screens/details';
import { HomeScreen } from './screens/home';

export const SharedTransitions = React.memo(() => {
  const [selectedRoute, setSelectedRoute] = useState<any>(null);

  if (selectedRoute) {
    return (
      <View style={{ flex: 1 }}>
        <Button title="Back" onPress={() => setSelectedRoute(null)} />
        <DetailsScreen route={selectedRoute} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <HomeScreen onNavigate={(route) => setSelectedRoute(route)} />
    </View>
  );
});
