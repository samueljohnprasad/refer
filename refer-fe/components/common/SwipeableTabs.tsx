import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

interface Route {
  key: string;
  title: string;
}

interface TabDefinition extends Route {
  component: React.ReactNode;
}

interface SwipeableTabsProps {
  tabs: TabDefinition[];
  initialTab?: number;
}

export const SwipeableTabs: React.FC<SwipeableTabsProps> = ({ tabs, initialTab = 0 }) => {
  const layout = Dimensions.get('window');
  const [index, setIndex] = useState<number>(initialTab);
  const [routes] = useState<Route[]>(
    tabs.map(({ key, title }) => ({ key, title }))
  );

  const renderScene = SceneMap(
    Object.fromEntries(
      tabs.map(tab => [tab.key, () => <View style={{ flex: 1 }}>{tab.component}</View>])
    )
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={props => (
        <StyledTabBar
          {...props}
          indicatorStyle={{ backgroundColor: '#2563eb', height: 3, borderRadius: 2 }}
          style={{ backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 }}
          tabStyle={{ backgroundColor: 'transparent' }}
          activeColor="#2563eb"
          inactiveColor="#888"
          options={undefined}
        />
      )}
    />
  );
};

const StyledTabBar = styled(TabBar)`
  background-color: transparent;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.mode === 'dark' ? '#333' : '#eee'};
`;

export default SwipeableTabs;
