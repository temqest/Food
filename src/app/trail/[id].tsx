import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, router } from 'expo-router';
import { getTrailById, FOOD_TRAILS } from '@/data/gamification';
import { ESTABLISHMENTS, FOOD_ITEMS } from '@/data/mockData';
import { useQuest } from '@/context/QuestContext';
import { TrailHeroBanner } from '@/components/trail/TrailHeroBanner';
import { TrailProgressBar } from '@/components/trail/TrailProgressBar';
import { TrailStopStation, TrailStopStatus } from '@/components/trail/TrailStopStation';
import { TrailSteppingBridge } from '@/components/trail/TrailSteppingBridge';
import { TrailFinishCrest } from '@/components/trail/TrailFinishCrest';
import { TrailStopDetailsSheet } from '@/components/trail/TrailStopDetailsSheet';
import { PassportStampModal } from '@/components/gamification/PassportStampModal';
import { Establishment, FoodItem } from '@/data/types';

export default function TrailDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tastingLog } = useQuest();

  // Stop Details Sheet State
  const [selectedStop, setSelectedStop] = useState<{
    stopNumber: number;
    establishment: Establishment;
    foodItem: FoodItem | null;
    isCompleted: boolean;
  } | null>(null);

  // Passport Stamp Modal State
  const [stampTarget, setStampTarget] = useState<{
    foodId: string;
    foodName: string;
    establishmentId: string;
    establishmentName: string;
    image?: string;
  } | null>(null);

  // 1. Resolve Food Trail from param
  const trail = useMemo(() => {
    return getTrailById(id) || FOOD_TRAILS[0];
  }, [id]);

  // 2. Resolve Establishments along this trail in sequence
  const trailEstablishments = useMemo(() => {
    return trail.establishmentIds
      .map((estId) => ESTABLISHMENTS.find((e) => e.id === estId))
      .filter((e): e is Establishment => Boolean(e));
  }, [trail]);

  // 3. Map associated food items
  const trailFoods = useMemo(() => {
    return trail.foodIds
      .map((fId) => FOOD_ITEMS.find((f) => f.id === fId))
      .filter((f): f is FoodItem => Boolean(f));
  }, [trail]);

  // 4. Calculate completed stops based on user's tastingLog for each establishment
  const stopStatuses = useMemo(() => {
    const completedFlags = trailEstablishments.map((est) => {
      return tastingLog.some(
        (entry) =>
          entry.establishmentId === est.id ||
          (entry.establishmentName &&
            entry.establishmentName.toLowerCase().includes(est.name.toLowerCase().slice(0, 8)))
      );
    });

    const firstIncompleteIndex = completedFlags.findIndex((completed) => !completed);

    return completedFlags.map((completed, index) => {
      if (completed) {
        return 'completed' as TrailStopStatus;
      }
      if (index === firstIncompleteIndex) {
        return 'active' as TrailStopStatus;
      }
      return 'locked' as TrailStopStatus;
    });
  }, [trailEstablishments, tastingLog]);

  const completedCount = stopStatuses.filter((s) => s === 'completed').length;
  const isAllCompleted = completedCount === trailEstablishments.length;
  const activeStopIndex = stopStatuses.findIndex((s) => s === 'active');
  const currentActiveIndex = activeStopIndex !== -1 ? activeStopIndex : 0;

  // Handlers
  const handleOpenStopDetails = (index: number) => {
    const est = trailEstablishments[index];
    const food = trailFoods[index] || trailFoods[0] || null;
    const isCompleted = stopStatuses[index] === 'completed';

    setSelectedStop({
      stopNumber: index + 1,
      establishment: est,
      foodItem: food,
      isCompleted,
    });
  };

  const handleOpenStampModal = (index: number) => {
    const est = trailEstablishments[index];
    const food =
      trailFoods[index] ||
      FOOD_ITEMS.find((f) => f.id === est.foodsOffered[0]?.foodId) ||
      trailFoods[0] ||
      FOOD_ITEMS[0];

    setStampTarget({
      foodId: food.id,
      foodName: food.name,
      establishmentId: est.id,
      establishmentName: est.name,
      image: food.image || est.heroImage,
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Full-Bleed Hero Banner (under status bar, y=0) */}
        <TrailHeroBanner
          trail={trail}
          totalStopsCount={trailEstablishments.length}
          onBack={() => router.back()}
        />

        {/* 2. Artisanal Naga Expedition Passport Stamp HUD */}
        <TrailProgressBar
          completedCount={completedCount}
          totalCount={trailEstablishments.length}
          xpBonus={trail.xpBonus}
          establishments={trailEstablishments}
          trailFoods={trailFoods}
          stopStatuses={stopStatuses}
          activeStopIndex={currentActiveIndex}
          onPressStop={handleOpenStopDetails}
          onCheckIn={handleOpenStampModal}
        />

        {/* 3. The Winding S-Curve Food Trail Journey */}
        <View style={styles.journeyTrackContainer}>
          {trailEstablishments.map((est, index) => {
            const status = stopStatuses[index];
            const foodItem = trailFoods[index] || trailFoods[0];
            const distanceMeters = 180 + index * 260;
            const isLast = index === trailEstablishments.length - 1;

            // Winding road alternating entry and departure sides
            const enterSide = index === 0 ? undefined : index % 2 === 1 ? 'right' : 'left';
            const exitSide = index % 2 === 0 ? 'left' : 'right';
            const nextSide = (index + 1) % 2 === 1 ? 'right' : 'left';

            return (
              <React.Fragment key={est.id}>
                {/* Prominent Food Destination Postcard Banner */}
                <TrailStopStation
                  stopNumber={index + 1}
                  establishment={est}
                  foodItem={foodItem}
                  status={status}
                  enterSide={enterSide}
                  exitSide={exitSide}
                  distanceMeters={distanceMeters}
                  onPress={() => handleOpenStopDetails(index)}
                  onNavigate={() => {
                    router.push({
                      pathname: '/map',
                      params: { trailId: trail.id, highlightId: est.id },
                    });
                  }}
                  onCheckIn={() => handleOpenStampModal(index)}
                />

                {/* Curving Winding Road S-Curve directly connecting to next banner */}
                {!isLast && (
                  <TrailSteppingBridge
                    fromSide={exitSide}
                    toSide={nextSide}
                    status={
                      index < completedCount
                        ? 'completed'
                        : index === completedCount
                        ? 'active'
                        : 'upcoming'
                    }
                  />
                )}

                {/* Final Winding Road Segment curving into the Grand Finale Crest */}
                {isLast && (
                  <TrailSteppingBridge
                    fromSide={exitSide}
                    toSide="center"
                    status={
                      isAllCompleted
                        ? 'completed'
                        : completedCount === trailEstablishments.length - 1
                        ? 'active'
                        : 'upcoming'
                    }
                  />
                )}
              </React.Fragment>
            );
          })}

          {/* 4. Grand Finale Finisher Shrine */}
          <TrailFinishCrest
            badgeId={trail.badgeId}
            xpBonus={trail.xpBonus}
            isAllCompleted={isAllCompleted}
            remainingCount={trailEstablishments.length - completedCount}
          />
        </View>
      </ScrollView>

      {/* Stop Details Bottom Sheet */}
      <TrailStopDetailsSheet
        visible={selectedStop !== null}
        onClose={() => setSelectedStop(null)}
        stopNumber={selectedStop?.stopNumber || 1}
        establishment={selectedStop?.establishment || null}
        foodItem={selectedStop?.foodItem || null}
        isCompleted={Boolean(selectedStop?.isCompleted)}
        onLogStamp={() => {
          if (!selectedStop) return;
          const idx = selectedStop.stopNumber - 1;
          setSelectedStop(null);
          handleOpenStampModal(idx);
        }}
        onViewStallDetails={() => {
          if (!selectedStop) return;
          const estId = selectedStop.establishment.id;
          setSelectedStop(null);
          router.push(`/establishment/${estId}`);
        }}
      />

      {/* Passport Tasting Stamp Modal */}
      {stampTarget && (
        <PassportStampModal
          visible={stampTarget !== null}
          onClose={() => setStampTarget(null)}
          foodId={stampTarget.foodId}
          foodName={stampTarget.foodName}
          establishmentId={stampTarget.establishmentId}
          establishmentName={stampTarget.establishmentName}
          image={stampTarget.image}
        />
      )}
    </View>
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
    paddingBottom: 60,
  },
  journeyTrackContainer: {
    width: '100%',
    paddingTop: 8,
  },
});
