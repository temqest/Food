import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Establishment } from '@/data/types';
import { MAPBOX_TOKEN, NAGA_CITY_CENTER, MAPBOX_STYLES } from '@/constants/mapbox';
import { BrandColors } from '@/constants/theme';

interface MapboxMapViewProps {
  establishments: Establishment[];
  selectedId?: string;
  onSelectEstablishment: (establishment: Establishment) => void;
  height?: number;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

export const MapboxMapView: React.FC<MapboxMapViewProps> = ({
  establishments,
  selectedId,
  onSelectEstablishment,
  height = 360,
  onInteractionStart,
  onInteractionEnd,
}) => {
  const webViewRef = useRef<WebView>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMapReadyRef = useRef(false);

  // Send message to WebView or iframe without reloading page
  const postToMap = useCallback((type: string, payload: any) => {
    const message = JSON.stringify({ type, payload });
    if (Platform.OS === 'web') {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(message, '*');
      }
    } else {
      if (webViewRef.current) {
        webViewRef.current.postMessage(message);
      }
    }
  }, []);

  // Sync markers when filtered list changes (0ms reload, purely client-side DOM)
  useEffect(() => {
    if (isMapReadyRef.current) {
      postToMap('UPDATE_MARKERS', {
        establishments: establishments.map((e) => ({
          id: e.id,
          name: e.name,
          type: e.type,
          lat: e.coordinates.latitude,
          lng: e.coordinates.longitude,
        })),
      });
    }
  }, [establishments, postToMap]);

  // Sync selectedId changes to Mapbox (smooth flyTo without reloading)
  useEffect(() => {
    if (selectedId && isMapReadyRef.current) {
      postToMap('SELECT_ID', { id: selectedId });
    }
  }, [selectedId, postToMap]);

  // Handle messages from map
  const onMessage = useCallback(
    (event: any) => {
      try {
        const data =
          typeof event.nativeEvent?.data === 'string'
            ? JSON.parse(event.nativeEvent.data)
            : typeof event.data === 'string'
            ? JSON.parse(event.data)
            : event.data;

        if (data?.type === 'MAP_LOADED') {
          isMapReadyRef.current = true;
          // Sync current establishments & selection
          postToMap('UPDATE_MARKERS', {
            establishments: establishments.map((e) => ({
              id: e.id,
              name: e.name,
              type: e.type,
              lat: e.coordinates.latitude,
              lng: e.coordinates.longitude,
            })),
          });
          if (selectedId) {
            postToMap('SELECT_ID', { id: selectedId });
          }
        } else if (data?.type === 'SELECT_ESTABLISHMENT') {
          const est = establishments.find((e) => e.id === data.payload.id);
          if (est) {
            onSelectEstablishment(est);
          }
        } else if (data?.type === 'TOUCH_START') {
          onInteractionStart?.();
        } else if (data?.type === 'TOUCH_END') {
          onInteractionEnd?.();
        }
      } catch {
        // ignore parse errors
      }
    },
    [establishments, onSelectEstablishment, onInteractionStart, onInteractionEnd, postToMap, selectedId]
  );

  // Listen for web window messages
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWebMessage = (e: MessageEvent) => {
        onMessage({ data: e.data });
      };
      window.addEventListener('message', handleWebMessage);
      return () => window.removeEventListener('message', handleWebMessage);
    }
  }, [onMessage]);

  // Recenter Naga City
  const handleRecenter = () => {
    postToMap('RECENTER', {});
  };

  // Static HTML generated ONCE to avoid re-mounting / WebGL thrashing
  const staticHtmlContent = useMemo(() => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Naga Food Map</title>
  <link href="https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.css" rel="stylesheet" />
  <script src="https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.js"></script>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
    }
    html, body, #map {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: #E8EEF3;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif;
      touch-action: none;
      overscroll-behavior: none;
    }

    /* Marker styling */
    .custom-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
      z-index: 10;
      will-change: transform;
    }
    .custom-marker.selected {
      z-index: 50;
      transform: scale(1.18) translateY(-4px);
    }

    .marker-bubble {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #FFFFFF;
      border: 2px solid #111111;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.22);
      position: relative;
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }

    .custom-marker.selected .marker-bubble {
      background: #D42F13;
      border-color: #FFFFFF;
      box-shadow: 0 6px 16px rgba(212, 47, 19, 0.45);
    }

    .pulse-ring {
      position: absolute;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(212, 47, 19, 0.35);
      top: -7px;
      left: -7px;
      animation: pulseAnim 1.6s infinite ease-out;
      pointer-events: none;
      display: none;
    }
    .custom-marker.selected .pulse-ring {
      display: block;
    }

    @keyframes pulseAnim {
      0% {
        transform: scale(0.65);
        opacity: 0.9;
      }
      100% {
        transform: scale(1.55);
        opacity: 0;
      }
    }

    .marker-label {
      background: rgba(17, 17, 17, 0.88);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: #FFFFFF;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 10px;
      margin-top: 4px;
      white-space: nowrap;
      max-width: 110px;
      overflow: hidden;
      text-overflow: ellipsis;
      box-shadow: 0 2px 6px rgba(0,0,0,0.18);
      border: 0.5px solid rgba(255,255,255,0.2);
      pointer-events: none;
    }
    .custom-marker.selected .marker-label {
      background: #D42F13;
      font-weight: 800;
      border-color: rgba(255,255,255,0.4);
    }

    .mapboxgl-ctrl-bottom-right, .mapboxgl-ctrl-bottom-left {
      transform: scale(0.85);
      transform-origin: bottom left;
    }
    .mapboxgl-ctrl-attrib {
      font-size: 9px !important;
      background: rgba(255, 255, 255, 0.6) !important;
      border-radius: 4px;
    }
    .mapboxgl-ctrl-logo {
      opacity: 0.75;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <script>
    let currentSelectedId = '';
    const markersMap = {};

    mapboxgl.accessToken = '${MAPBOX_TOKEN}';

    const map = new mapboxgl.Map({
      container: 'map',
      style: '${MAPBOX_STYLES.streets}',
      center: [${NAGA_CITY_CENTER.longitude}, ${NAGA_CITY_CENTER.latitude}],
      zoom: 14.5,
      pitch: 28,
      bearing: -5,
      attributionControl: true,
      cooperativeGestures: false,
      trackResize: true
    });

    // Disable double tap zoom delays and enable smooth inertial drag
    map.dragPan.enable({
      linearity: 0.25,
      maxSpeed: 1400,
      deceleration: 2500
    });
    map.touchZoomRotate.enable({ around: 'center' });

    function sendEvent(type, payload) {
      const msg = JSON.stringify({ type, payload });
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(msg);
      } else if (window.parent && window.parent.postMessage) {
        window.parent.postMessage(msg, '*');
      }
    }

    // Capture touch events to notify parent
    window.addEventListener('touchstart', () => sendEvent('TOUCH_START', {}), { passive: true });
    window.addEventListener('touchend', () => sendEvent('TOUCH_END', {}), { passive: true });
    window.addEventListener('touchcancel', () => sendEvent('TOUCH_END', {}), { passive: true });

    function getIconForType(type) {
      switch (type) {
        case 'bakery': return '🥟';
        case 'kinalas-station': return '🍜';
        case 'pasalubong-center': return '🎁';
        case 'carinderia': return '🍲';
        case 'street-stall': return '🍢';
        default: return '🥥';
      }
    }

    function renderEstablishments(items) {
      // Clean previous markers not in new items
      const newIds = new Set(items.map(i => i.id));
      Object.keys(markersMap).forEach(id => {
        if (!newIds.has(id)) {
          markersMap[id].marker.remove();
          delete markersMap[id];
        }
      });

      items.forEach(est => {
        if (markersMap[est.id]) return; // already rendered

        const el = document.createElement('div');
        el.className = 'custom-marker' + (est.id === currentSelectedId ? ' selected' : '');
        el.id = 'marker-' + est.id;

        const pulse = document.createElement('div');
        pulse.className = 'pulse-ring';

        const bubble = document.createElement('div');
        bubble.className = 'marker-bubble';
        bubble.textContent = getIconForType(est.type);

        const label = document.createElement('div');
        label.className = 'marker-label';
        const nameWords = est.name.split(' ');
        label.textContent = nameWords[0] + (nameWords[1] ? ' ' + nameWords[1] : '');

        el.appendChild(pulse);
        el.appendChild(bubble);
        el.appendChild(label);

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          selectMarker(est.id, true);
        });

        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat([est.lng, est.lat])
          .addTo(map);

        markersMap[est.id] = { marker, el, data: est };
      });
    }

    function selectMarker(id, shouldNotify) {
      if (currentSelectedId === id && !shouldNotify) return;

      if (markersMap[currentSelectedId]) {
        markersMap[currentSelectedId].el.classList.remove('selected');
      }

      currentSelectedId = id;

      if (markersMap[id]) {
        markersMap[id].el.classList.add('selected');
        const est = markersMap[id].data;
        map.flyTo({
          center: [est.lng, est.lat],
          zoom: 15.3,
          pitch: 30,
          essential: true,
          duration: 750
        });

        if (shouldNotify) {
          sendEvent('SELECT_ESTABLISHMENT', { id });
        }
      }
    }

    map.on('load', () => {
      sendEvent('MAP_LOADED', { ok: true });
    });

    function handleIncomingMessage(eventData) {
      try {
        const data = typeof eventData === 'string' ? JSON.parse(eventData) : eventData;
        if (data.type === 'UPDATE_MARKERS') {
          renderEstablishments(data.payload.establishments || []);
        } else if (data.type === 'SELECT_ID') {
          selectMarker(data.payload.id, false);
        } else if (data.type === 'RECENTER') {
          map.flyTo({
            center: [${NAGA_CITY_CENTER.longitude}, ${NAGA_CITY_CENTER.latitude}],
            zoom: 14.5,
            pitch: 28,
            duration: 850
          });
        }
      } catch (e) {
        console.error('Error handling message in Mapbox:', e);
      }
    }

    window.addEventListener('message', (e) => handleIncomingMessage(e.data));
    document.addEventListener('message', (e) => handleIncomingMessage(e.data));
  </script>
</body>
</html>`;
  }, []);

  return (
    <View
      style={[styles.container, { height }]}
      onTouchStart={onInteractionStart}
      onTouchEnd={onInteractionEnd}
      onTouchCancel={onInteractionEnd}
    >
      {/* Map Rendering: Native WebView vs Web iframe */}
      {Platform.OS === 'web' ? (
        <iframe
          ref={iframeRef}
          srcDoc={staticHtmlContent}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: 18,
            touchAction: 'none',
          }}
          title="Naga Interactive Map"
        />
      ) : (
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: staticHtmlContent }}
          style={styles.webView}
          onMessage={onMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          bounces={false}
          scrollEnabled={false}
          nestedScrollEnabled={false}
          overScrollMode="never"
          renderLoading={() => (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color={BrandColors.primary} />
              <Text style={styles.loadingText}>Loading Mapbox...</Text>
            </View>
          )}
        />
      )}

      {/* Top Bar: Clean live badge and recenter shortcut */}
      <View style={styles.topBar}>
        <View style={styles.badge}>
          <Ionicons name="location-sharp" size={13} color={BrandColors.primary} />
          <Text style={styles.badgeText}>Live Naga Map</Text>
        </View>

        <Pressable
          onPress={handleRecenter}
          style={({ pressed }) => [styles.controlButton, pressed && styles.pressed]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Recenter Naga City"
        >
          <Ionicons name="locate" size={16} color="#111111" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#E8EEF3',
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  webView: {
    flex: 1,
    backgroundColor: '#E8EEF3',
  },
  loadingOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 10,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  topBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    pointerEvents: 'box-none',
    zIndex: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -0.1,
  },
  controlButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
});
