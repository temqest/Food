import React from 'react';
import { Establishment } from '@/data/types';
import { MapboxMapView } from './MapboxMapView';

interface NagaMapCanvasProps {
  establishments: Establishment[];
  selectedId?: string;
  onSelectEstablishment: (establishment: Establishment) => void;
  height?: number;
}

/**
 * NagaMapCanvas now renders the live, interactive Mapbox map with real coordinates across Naga City.
 */
export const NagaMapCanvas: React.FC<NagaMapCanvasProps> = (props) => {
  return <MapboxMapView {...props} />;
};

export default NagaMapCanvas;
