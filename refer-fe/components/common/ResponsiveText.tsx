import React, { useState, useEffect } from 'react';
import { Text, TextProps, TextStyle, ViewStyle, StyleProp } from 'react-native';
import { useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../context/ThemeContext';

interface ResponsiveTextProps extends TextProps {
  content: string;
  baseSize: number;
  minSize?: number;
  maxSize?: number;
  scaleRatio?: number;
  numberOfLines?: number;
  customStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  bold?: boolean;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  selectable?: boolean;
  adjustsHeight?: boolean;
}

const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  content,
  baseSize,
  minSize = 10, // Minimum font size
  maxSize, // Maximum font size (defaults to baseSize)
  scaleRatio = 0.08, // How much to reduce font size per character
  numberOfLines,
  customStyle = {},
  containerStyle = {},
  bold = false,
  ellipsizeMode = 'tail',
  selectable = false,
  adjustsHeight = true,
  ...props
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const { theme } = useTheme();
  const [fontSize, setFontSize] = useState<number>(baseSize);
  const [mounted, setMounted] = useState<boolean>(false);
  
  const maxFontSize = maxSize || baseSize;

  useEffect(() => {
    // Set mounted state to true after initial render
    setMounted(true);
  }, []);

  useEffect(() => {
    // Calculate font size based on content length
    if (!content) return;

    const contentLength = content.length;
    let calculatedSize: number;
    
    // Different scaling approaches based on content characteristics
    
    // For very short content (titles, headings)
    if (contentLength < 20) {
      calculatedSize = baseSize;
    }
    // For medium-length content
    else if (contentLength < 50) {
      calculatedSize = Math.max(
        minSize,
        baseSize - (contentLength - 20) * (scaleRatio / 2)
      );
    }
    // For long content
    else if (contentLength < 100) {
      calculatedSize = Math.max(
        minSize,
        baseSize - (contentLength / 10) * scaleRatio
      );
    }
    // For very long content
    else {
      calculatedSize = Math.max(
        minSize,
        baseSize - 10 * scaleRatio
      );
    }
    
    // Cap at max size
    calculatedSize = Math.min(calculatedSize, maxFontSize);
    
    // Scale according to screen width (for responsiveness across devices)
    const scaleFactor = screenWidth / 375; // Base scale for iPhone X width
    calculatedSize = Math.round(calculatedSize * scaleFactor);
    
    setFontSize(calculatedSize);
  }, [content, baseSize, minSize, maxFontSize, scaleRatio, screenWidth]);

  // Only apply adjustable height if specified
  const heightStyle: ViewStyle = adjustsHeight ? 
    { height: numberOfLines ? undefined : 'auto' as any } : {};

  return (
    <Container style={[heightStyle, containerStyle]}>
      <StyledText
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        selectable={selectable}
        style={[
          {
            fontSize: fontSize,
            fontWeight: bold ? 'bold' : 'normal',
            opacity: mounted ? 1 : 0, // Hide text until properly sized
            color: theme.colors.text
          },
          customStyle
        ]}
        {...props}
      >
        {content}
      </StyledText>
    </Container>
  );
};

const Container = styled.View`
  overflow: hidden;
`;

const StyledText = styled.Text`
  flex-shrink: 1;
`;

export default ResponsiveText;
