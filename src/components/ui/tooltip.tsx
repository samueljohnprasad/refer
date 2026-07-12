import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export const Tooltip = ({
  children,
  placement,
  trigger
}: {
  children: React.ReactNode;
  placement?: string;
  trigger: (props: any) => React.ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={[styles.container, { zIndex: isVisible ? 100 : 1 }]}>
      {trigger({
        onPress: () => setIsVisible(!isVisible),
        onLongPress: () => setIsVisible(true),
        onPressOut: () => setIsVisible(false)
      })}
      {isVisible && (
        <View style={styles.tooltipBox}>
          {children}
        </View>
      )}
    </View>
  );
};

export const TooltipContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <View style={styles.content}>
      {children}
    </View>
  );
};

export const TooltipText = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <Text style={styles.text}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tooltipBox: {
    position: 'absolute',
    top: '100%',
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 8,
    padding: 8,
    zIndex: 1000,
    minWidth: 120,
    alignItems: 'center'
  },
  content: {
    flex: 1
  },
  text: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center'
  }
});
