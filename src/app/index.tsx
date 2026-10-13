import React from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { NavBar } from '@/components/common/NavBar';
import { MascotHero } from '@/components/home/MascotHero';
import { CravingDialWidget } from '@/components/home/CravingDialWidget';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header, Greeting & Naga Quest Infinite Postcard Carousel */}
        <MascotHero />

        {/* Interactive Craving Dial (Discovery Widget) */}
        <CravingDialWidget />
      </ScrollView>

      {/* iOS Translucent Floating Tab Bar */}
      <NavBar currentTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    paddingBottom: 110,
  },
});
