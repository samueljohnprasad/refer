import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

export interface TextProps extends RNTextProps {
  className?: string;
}

export const Text: React.FC<TextProps> = ({ children, ...rest }) => {
  return <RNText {...rest}>{children}</RNText>;
};

export default Text;
