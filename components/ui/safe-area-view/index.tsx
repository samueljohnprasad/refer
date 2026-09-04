'use client';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { cssInterop } from 'nativewind';

cssInterop(RNSafeAreaView, { className: 'style' });

export const SafeAreaView = RNSafeAreaView;
