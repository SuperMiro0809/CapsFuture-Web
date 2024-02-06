'use client'

import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
// @mui
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Loader } from '@googlemaps/js-api-loader';
// leaflet
import { LeafletMap, mapIcons } from 'src/components/leaflet-map';
import { Marker, useMapEvents } from 'react-leaflet';
// api
import { forwardGeocode, reverseGeocode } from 'src/api/google-maps';
import { GOOGLE_MAPS } from 'src/config-global';

// ----------------------------------------------------------------------

const LocationMarker = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });

  return null;
};

function SelectableMap({ center, zoom, markerPosition, onLocationSelect, iconName }) {

  return (
    <LeafletMap center={center} zoom={zoom} style={{ height: '400px', width: '100%' }}>
      {markerPosition && <Marker position={markerPosition} icon={mapIcons[iconName]} />}
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

export default function RHFLocationSelectorField({ name, placeholder, helperText, iconName }) {
  const { control, watch } = useFormContext();

  const value = watch(name);

  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS.key,
    });
    

    loader.importLibrary('places').then(() => {
      let autocompleteService = new google.maps.places.AutocompleteService();

      if (inputValue === '') {
        setOptions([]);
        return undefined;
      }

      autocompleteService.getPlacePredictions({ input: inputValue }, (results) => {
        setOptions(results || []);
      });
    });
  }, [inputValue]);

  useEffect(() => {
    if (value?.lat && value?.lng) {
      reverseGeocode(value.lat, value.lng).then((newAddress) => {
        if (newAddress) {
          setInputValue(newAddress);
        }
      }).catch((error) => {
        console.error('Error reverse geocoding:', error);
      });
    }
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <Autocomplete
            freeSolo
            disableClearable
            options={options.map((option) => option.description)}
            value={inputValue}
            onInputChange={async (_, newInputValue) => {
              setInputValue(newInputValue);

              const coordinates = await forwardGeocode(newInputValue);
              if(coordinates) {
                field.onChange({ lat: coordinates.lat, lng: coordinates.lng })
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder}
                margin='normal'
                variant='outlined'
                helperText={error ? error?.message : helperText}
                InputProps={{ ...params.InputProps, type: 'search' }}
                error={!!error}
              />
            )}
          />

          <SelectableMap
            iconName={iconName || 'heartIcon'}
            center={(field.value?.lat && field.value?.lng) ? { lat: field.value.lat, lng: field.value.lng } : { lat: 42.7249925, lng: 25.4833039 }}
            zoom={7}
            markerPosition={(field.value?.lat && field.value?.lng) && { lat: field.value.lat, lng: field.value.lng }}
            onLocationSelect={async (latlng) => {
              const newAddress = await reverseGeocode(latlng.lat, latlng.lng);
              if (newAddress) {
                setInputValue(newAddress)
                field.onChange({ lat: latlng.lat, lng: latlng.lng })
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
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  iconName: PropTypes.oneOf(['heartIcon', 'stationIcon'])
};
