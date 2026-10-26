import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/context/AuthContext';
import { SavedProvider } from '@/context/SavedContext';
import { BasketProvider } from '@/context/BasketContext';
import { BusinessProvider } from '@/context/BusinessContext';
import { QuestProvider } from '@/context/QuestContext';
import { SocialFeedProvider } from '@/context/SocialFeedContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SavedProvider>
          <QuestProvider>
            <BasketProvider>
              <BusinessProvider>
                <SocialFeedProvider>
                  <StatusBar style="dark" />
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      contentStyle: { backgroundColor: '#F2F2F7' },
                    }}
                  >
                    <Stack.Screen name="index" />
                    <Stack.Screen name="welcome" />
                    <Stack.Screen name="login" />
                    <Stack.Screen name="signup" />
                    <Stack.Screen name="onboarding" />
                    <Stack.Screen name="forgot-password" />
                    <Stack.Screen name="explore" />
                    <Stack.Screen name="map" />
                    <Stack.Screen name="saved" />
                    <Stack.Screen name="feed" />
                    <Stack.Screen name="basket" />
                    <Stack.Screen name="payment" />
                    <Stack.Screen name="profile" />
                    <Stack.Screen name="search" />
                    <Stack.Screen name="business" />
                    <Stack.Screen name="food/[id]" />
                    <Stack.Screen name="establishment/[id]" />
                    <Stack.Screen name="trail/[id]" />
                    <Stack.Screen name="streak" />
                  </Stack>
                </SocialFeedProvider>
              </BusinessProvider>
            </BasketProvider>
          </QuestProvider>
        </SavedProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
