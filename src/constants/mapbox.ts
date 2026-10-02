export const MAPBOX_TOKEN =
  process.env.EXPO_PUBLIC_MAPBOX_TOKEN ||
  process.env.PUBLIC_MAPBOX_TOKEN ||
  '';

export const NAGA_CITY_CENTER = {
  latitude: 13.626,
  longitude: 123.19,
  zoom: 14.3,
  pitch: 35,
  bearing: -10,
};

export const MAPBOX_STYLES = {
  streets: 'mapbox://styles/mapbox/streets-v12',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  light: 'mapbox://styles/mapbox/light-v11',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  dark: 'mapbox://styles/mapbox/dark-v11',
};
