import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavBar } from '@/components/common/NavBar';
import { MascotHero } from '@/components/home/MascotHero';
import { CravingDialWidget } from '@/components/home/CravingDialWidget';
import { FoodShowcaseBox } from '@/components/home/FoodShowcaseBox';

export default function HomeScreen() {
  const [selectedCravingId, setSelectedCravingId] = useState<string>('heritage-noodles');

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header, Greeting & Naga Quest Infinite Postcard Carousel */}
        <MascotHero />

        {/* Interactive Craving Dial (Carousel of themes & flavors) */}
        <CravingDialWidget
          selectedId={selectedCravingId}
          onSelectCraving={(id) => setSelectedCravingId(id)}
        />

        {/* Food Showcase Box (Directly below the carousel, synced to selected craving) */}
        <FoodShowcaseBox activeCravingId={selectedCravingId} />
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
    paddingBottom: 80,
  },
});
