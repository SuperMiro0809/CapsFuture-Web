import { MapContainer, TileLayer } from 'react-leaflet';

export default function LeafletMap({ center, zoom, children, ...other }) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      {...other}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {children}
    </MapContainer>
  );
}