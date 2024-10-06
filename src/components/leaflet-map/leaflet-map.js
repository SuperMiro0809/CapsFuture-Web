import { useState } from 'react';

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';

import 'leaflet/dist/leaflet.css';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';

// ----------------------------------------------------------------------

export default function LeafletMap({ center, zoom, children, ...other }) {
  const [init, setInit] = useState(true);

  const GestureHandlingSetter = () => {
    /* eslint-disable */
    const map = useMap();
    map.gestureHandling.enable();
    map.addHandler('gestureHandling', GestureHandling);
    setInit(false);
    /* eslint-enable */
    return null;
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      {...other}
    >
      {init && <GestureHandlingSetter />}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {children}
    </MapContainer>
  );
}