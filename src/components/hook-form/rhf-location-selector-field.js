import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import TextField from '@mui/material/TextField';
// leaflet
import { LeafletMap, mapIcons } from 'src/components/leaflet-map';
import { Marker, useMapEvents } from 'react-leaflet';
// api
import { forwardGeocode, reverseGeocode } from 'src/api/google-maps';

// ----------------------------------------------------------------------

const LocationMarker = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });

  return null;
};

function SelectableMap({ center, zoom, markerPosition, onLocationSelect }) {

  return (
    <LeafletMap center={center} zoom={zoom} style={{ height: '400px', width: '100%' }}>
      {markerPosition && <Marker position={markerPosition} icon={mapIcons.heartIcon} />}
      <LocationMarker onLocationSelect={onLocationSelect} />
    </LeafletMap>
  );
};

SelectableMap.propTypes = {
  center: PropTypes.object,
  zoom: PropTypes.number,
  markerPosition: PropTypes.object,
  onLocationSelect: PropTypes.func
};

// ----------------------------------------------------------------------

export default function RHFLocationSelectorField({ name, helperText, ...other }) {
  const { control } = useFormContext();

  const zoom = 8;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <TextField
            {...field}
            fullWidth
            value={field.value?.address || ''}
            onChange={async (event) => {
              const newAddress = event.target.value;

              const coordinates = await forwardGeocode(newAddress);
              if(coordinates) {
                field.onChange({ address: newAddress, lat: coordinates.lat, lng: coordinates.lng })
              }
            }}
            error={!!error}
            helperText={error ? error?.message : helperText}
            {...other}
          />

          <SelectableMap
            center={(field.value?.lat && field.value?.lng) ? { lat: field.value.lat, lng: field.value.lng } : { lat: 42.698334, lng: 23.319941 }}
            zoom={zoom}
            markerPosition={(field.value?.lat && field.value?.lng) && { lat: field.value.lat, lng: field.value.lng }} 
            onLocationSelect={async (latlng) => {
              const newAddress = await reverseGeocode(latlng.lat, latlng.lng);
              if(newAddress) {
                field.onChange({ address: newAddress, lat: latlng.lat, lng: latlng.lng })
              }
            }} 
          />
        </>

      )}
    />
  );
}

RHFLocationSelectorField.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.string
};
