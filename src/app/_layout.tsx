import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SavedProvider } from '@/context/SavedContext';
import { BasketProvider } from '@/context/BasketContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <SavedProvider>
      <BasketProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#F2F2F7' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="explore" />
          <Stack.Screen name="map" />
          <Stack.Screen name="saved" />
          <Stack.Screen name="basket" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="search" />
          <Stack.Screen name="food/[id]" />
          <Stack.Screen name="establishment/[id]" />
        </Stack>
      </BasketProvider>
    </SavedProvider>
  );
}
