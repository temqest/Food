import React, { useMemo, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
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

const WebViewComponent = WebView as any;

export interface MapboxMapViewRef {
  recenter: () => void;
}

interface MapboxMapViewProps {
  establishments: Establishment[];
  selectedId?: string;
  onSelectEstablishment: (establishment: Establishment) => void;
  height?: number | string;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
  showFloatingRecenter?: boolean;
}

export const MapboxMapView = forwardRef<MapboxMapViewRef, MapboxMapViewProps>(({
  establishments,
  selectedId,
  onSelectEstablishment,
  height = '100%',
  onInteractionStart,
  onInteractionEnd,
  showFloatingRecenter = false,
}, ref) => {
  const webViewRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMapReadyRef = useRef(false);

  const onSelectEstablishmentRef = useRef(onSelectEstablishment);
  onSelectEstablishmentRef.current = onSelectEstablishment;

  const onInteractionStartRef = useRef(onInteractionStart);
  onInteractionStartRef.current = onInteractionStart;

  const onInteractionEndRef = useRef(onInteractionEnd);
  onInteractionEndRef.current = onInteractionEnd;

  const establishmentsRef = useRef(establishments);
  establishmentsRef.current = establishments;

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

  // Recenter Naga City
  const handleRecenter = useCallback(() => {
    postToMap('RECENTER', {});
  }, [postToMap]);

  // Expose recenter method via ref
  useImperativeHandle(ref, () => ({
    recenter: handleRecenter,
  }), [handleRecenter]);

  // Sync markers when filtered list changes
  useEffect(() => {
    if (isMapReadyRef.current) {
      postToMap('UPDATE_MARKERS', {
        establishments: establishments.map((e) => ({
          id: e.id,
          name: e.name,
          type: e.type,
          typeLabel: e.typeLabel,
          lat: e.coordinates.latitude,
          lng: e.coordinates.longitude,
          isOpenNow: e.isOpenNow,
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

  // Handle messages from map (stable handler)
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
            establishments: establishmentsRef.current.map((e) => ({
              id: e.id,
              name: e.name,
              type: e.type,
              typeLabel: e.typeLabel,
              lat: e.coordinates.latitude,
              lng: e.coordinates.longitude,
              isOpenNow: e.isOpenNow,
            })),
          });
          if (selectedId) {
            postToMap('SELECT_ID', { id: selectedId });
          }
        } else if (data?.type === 'SELECT_ESTABLISHMENT') {
          const est = establishmentsRef.current.find((e) => e.id === data.payload.id);
          if (est) {
            onSelectEstablishmentRef.current?.(est);
          }
        } else if (data?.type === 'TOUCH_START') {
          onInteractionStartRef.current?.();
        } else if (data?.type === 'TOUCH_END') {
          onInteractionEndRef.current?.();
        }
      } catch {
        // ignore parse errors
      }
    },
    [postToMap, selectedId]
  );

  // Listen for web window messages once
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWebMessage = (e: MessageEvent) => {
        onMessage({ data: e.data });
      };
      window.addEventListener('message', handleWebMessage);
      return () => window.removeEventListener('message', handleWebMessage);
    }
  }, [onMessage]);

  // Static HTML generated ONCE with SVG vector pin markers
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

    /* Bespoke Vector SVG Marker Styling */
    .custom-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      position: relative;
      transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 10;
      will-change: transform;
    }

    .custom-marker.selected {
      z-index: 100;
      transform: translateY(-8px) scale(1.18);
    }

    .marker-pin-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .marker-badge {
      width: 38px;
      height: 38px;
      border-radius: 19px;
      background-color: var(--pin-color, #D42F13);
      border: 2.5px solid #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.24);
      position: relative;
      z-index: 2;
      transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .custom-marker.selected .marker-badge {
      background-color: #D42F13;
      border-color: #FFFFFF;
      box-shadow: 0 8px 22px rgba(212, 47, 19, 0.55);
    }

    .marker-pointer {
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 7px solid var(--pin-color, #D42F13);
      margin-top: -1.5px;
      z-index: 1;
      filter: drop-shadow(0 2px 2px rgba(0,0,0,0.18));
      transition: border-top-color 0.2s ease;
    }

    .custom-marker.selected .marker-pointer {
      border-top-color: #D42F13;
    }

    .pulse-ring {
      position: absolute;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(212, 47, 19, 0.38);
      top: -9px;
      left: -9px;
      animation: pulseAnim 1.6s infinite ease-out;
      pointer-events: none;
      display: none;
      z-index: 0;
    }

    .custom-marker.selected .pulse-ring {
      display: block;
    }

    @keyframes pulseAnim {
      0% {
        transform: scale(0.65);
        opacity: 0.95;
      }
      100% {
        transform: scale(1.6);
        opacity: 0;
      }
    }

    .marker-label {
      background: rgba(18, 18, 18, 0.94);
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 10px;
      margin-top: 3px;
      white-space: nowrap;
      max-width: 125px;
      overflow: hidden;
      text-overflow: ellipsis;
      box-shadow: 0 2px 6px rgba(0,0,0,0.22);
      border: 0.5px solid rgba(255,255,255,0.25);
      pointer-events: none;
      letter-spacing: -0.15px;
    }

    .custom-marker.selected .marker-label {
      background: #111111;
      border-color: #D42F13;
      color: #FFFFFF;
      font-weight: 800;
      box-shadow: 0 4px 10px rgba(0,0,0,0.35);
    }

    .mapboxgl-ctrl-bottom-right, .mapboxgl-ctrl-bottom-left {
      transform: scale(0.85);
      transform-origin: bottom left;
    }
    .mapboxgl-ctrl-attrib {
      font-size: 9px !important;
      background: rgba(255, 255, 255, 0.7) !important;
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
      zoom: 14.3,
      pitch: 28,
      bearing: -5,
      attributionControl: true,
      cooperativeGestures: false,
      trackResize: true
    });

    map.dragPan.enable();
    map.touchZoomRotate.enable({ around: 'center' });

    function sendEvent(type, payload) {
      const msg = JSON.stringify({ type, payload });
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(msg);
      } else if (window.parent && window.parent.postMessage) {
        window.parent.postMessage(msg, '*');
      }
    }

    window.addEventListener('touchstart', () => sendEvent('TOUCH_START', {}), { passive: true });
    window.addEventListener('touchend', () => sendEvent('TOUCH_END', {}), { passive: true });
    window.addEventListener('touchcancel', () => sendEvent('TOUCH_END', {}), { passive: true });

    // Category Color & Vector SVG Map
    function getCategoryConfig(type) {
      switch (type) {
        case 'kinalas-station':
          return {
            color: '#D42F13', // Terracotta Crimson
            svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11c0 5 3.5 8 8 8s8-3 8-8H4z"/><path d="M7 4c0 2-1 3-1 4"/><path d="M12 4c0 2-1 3-1 4"/><path d="M17 4c0 2-1 3-1 4"/><line x1="3" y1="11" x2="21" y2="11"/></svg>'
          };
        case 'carinderia':
          return {
            color: '#2E7D32', // Forest Amber
            svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h16v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8z"/><path d="M2 10h20"/><path d="M9 6h6"/><path d="M12 6V3"/></svg>'
          };
        case 'bakery':
          return {
            color: '#D97706', // Golden Wheat
            svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13c0-3.5 3-7 9-7s9 3.5 9 7-3 5-9 5-9-1.5-9-5z"/><path d="M7 11c1-1 2-2 3-2"/><path d="M14 9c1 0 2 1 3 2"/></svg>'
          };
        case 'restaurant':
          return {
            color: '#C05621', // Warm Ember
            svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v20"/><path d="M21 2c0 3-1.5 5-3 5"/><path d="M3 2v7c0 1.5 1 2.5 2.5 2.5V22"/><path d="M8 2v7c0 1.5-1 2.5-2.5 2.5"/><line x1="5.5" y1="2" x2="5.5" y2="7"/></svg>'
          };
        case 'pasalubong-center':
          return {
            color: '#7C3AED', // Royal Violet
            svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>'
          };
        case 'street-stall':
        default:
          return {
            color: '#0284C7', // Coastal Teal
            svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
          };
      }
    }

    function renderEstablishments(items) {
      const newIds = new Set(items.map(i => i.id));
      Object.keys(markersMap).forEach(id => {
        if (!newIds.has(id)) {
          markersMap[id].marker.remove();
          delete markersMap[id];
        }
      });

      items.forEach(est => {
        if (markersMap[est.id]) return; // already rendered

        const config = getCategoryConfig(est.type);

        const el = document.createElement('div');
        el.className = 'custom-marker' + (est.id === currentSelectedId ? ' selected' : '');
        el.id = 'marker-' + est.id;
        el.style.setProperty('--pin-color', config.color);

        const pulse = document.createElement('div');
        pulse.className = 'pulse-ring';

        const pinBody = document.createElement('div');
        pinBody.className = 'marker-pin-body';

        const badge = document.createElement('div');
        badge.className = 'marker-badge';
        badge.innerHTML = config.svg;

        const pointer = document.createElement('div');
        pointer.className = 'marker-pointer';

        pinBody.appendChild(badge);
        pinBody.appendChild(pointer);

        const label = document.createElement('div');
        label.className = 'marker-label';
        const nameWords = est.name.split(' ');
        label.textContent = nameWords[0] + (nameWords[1] ? ' ' + nameWords[1] : '');

        el.appendChild(pulse);
        el.appendChild(pinBody);
        el.appendChild(label);

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          selectMarker(est.id, true);
        });

        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
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
          duration: 480
        });

        if (shouldNotify) {
          sendEvent('SELECT_ESTABLISHMENT', { id });
        }
      }
    }

    const NAGA_CENTER_LNG = ${NAGA_CITY_CENTER.longitude};
    const NAGA_CENTER_LAT = ${NAGA_CITY_CENTER.latitude};

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
            center: [NAGA_CENTER_LNG, NAGA_CENTER_LAT],
            zoom: 14.3,
            pitch: 28,
            duration: 500
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
      style={[styles.container, typeof height === 'number' ? { height } : styles.flexContainer]}
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
            touchAction: 'none',
          }}
          title="Naga Interactive Map"
        />
      ) : (
        <WebViewComponent
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
              <Text style={styles.loadingText}>Loading Naga Mapbox...</Text>
            </View>
          )}
        />
      )}

      {/* Floating Recenter Shortcut (optional inside MapboxMapView) */}
      {showFloatingRecenter && (
        <View style={styles.recenterWrapper} pointerEvents="box-none">
          <Pressable
            onPress={handleRecenter}
            style={({ pressed }) => [styles.controlButton, pressed && styles.pressed]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Recenter Naga City Map"
          >
            <Ionicons name="locate" size={18} color="#111111" />
          </Pressable>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#E8EEF3',
    overflow: 'hidden',
    position: 'relative',
  },
  flexContainer: {
    flex: 1,
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
  recenterWrapper: {
    position: 'absolute',
    right: 14,
    bottom: 12,
    zIndex: 25,
  },
  controlButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.94 }],
  },
});
