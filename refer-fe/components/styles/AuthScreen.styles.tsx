import { ThemeInterface } from "@/constants/theme";
import Button from "@/styles/components/Button";
import Typography from "@/styles/components/Typography";
import { SafeAreaView } from "react-native";
import styled from 'styled-components/native';

// Styled components
export const LogoContainer = styled.View<{ theme: ThemeInterface }>`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

export const LogoText = styled.Text<{ theme: ThemeInterface }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl + 8}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

export const StyledSafeAreaView = styled(SafeAreaView)<{ theme: ThemeInterface }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const FormContainer = styled.View<{ theme: ThemeInterface }>`
  width: 100%;
  max-width: 400px;
  align-self: center;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.card};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const TabsContainer = styled.View<{ theme: ThemeInterface }>`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => 
    theme.mode === 'dark' ? theme.colors.card : '#f2f2f2'};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  overflow: hidden;
  position: relative;
`;

export const Tab = styled.TouchableOpacity<{ active: boolean; theme: ThemeInterface }>`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: 2px;
  border-bottom-color: ${({ active, theme }) =>
    active ? theme.colors.primary : 'transparent'};
`;

export const TabText = styled.Text<{ active: boolean; theme: ThemeInterface }>`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ active }) => (active ? '700' : '600')};
  color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.mode === 'dark' ? '#BBBBBB' : '#666'};
`;

export const ErrorText = styled.Text<{ theme: ThemeInterface }>`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  text-align: center;
`;

export const ActionButton = styled(Button)<{ fullWidth?: boolean; theme: ThemeInterface }>`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

export const ForgotPasswordLink = styled.TouchableOpacity<{ theme: ThemeInterface }>`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

export const LegalText = styled(Typography)<{ theme: ThemeInterface }>`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  color: ${({ theme }) => theme.mode === 'dark' ? '#BBBBBB' : '#888'};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  text-align: center;
`;

export const LinkText = styled.Text<{ theme: ThemeInterface }>`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration-line: underline;
`;