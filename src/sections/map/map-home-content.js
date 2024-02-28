'use client'

import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
// locales
import { useTranslate } from 'src/locales';
// routes
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';
// utils
import { makeQuery } from 'src/utils/url-query';
// api
import { forwardGeocode } from 'src/api/google-maps';
import { GOOGLE_MAPS } from 'src/config-global';
// components
import Iconify from 'src/components/iconify';
//
import { Loader } from '@googlemaps/js-api-loader';

// ----------------------------------------------------------------------

const defaultFilters = {
  search: '',
  address: ''
};

// ----------------------------------------------------------------------

export default function MapHomeContent({ locations }) {
  const { t } = useTranslate();

  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const [filters, setFilters] = useState(defaultFilters);

  const [options, setOptions] = useState([]);

  const [mapCenter, setMapCenter] = useState([42.7249925, 25.4833039]);
  const [mapZoom, setMapZoom] = useState(8);

  const LeafletMap = useMemo(() => dynamic(
    () => import('src/components/leaflet-map').then(module => module.LeafletMap),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [mapCenter]);

  const LocationMarker = useMemo(() => dynamic(
    () => import('src/components/leaflet-map').then(module => module.LocationMarker),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), []);

  const handleFilters = (name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS.key,
    });
    

    loader.importLibrary('places').then(() => {
      let autocompleteService = new google.maps.places.AutocompleteService();

      if (filters.address === '') {
        setOptions([]);
        setMapCenter([42.7249925, 25.4833039]);
        setMapZoom(8);
        return undefined;
      }

      autocompleteService.getPlacePredictions({ input: filters.address }, (results) => {
        setOptions(results || []);
      });
    });
  }, [filters.address]);

  useEffect(() => {
    const filtersData = Object.keys(filters).map((key) => ({ id: key, value: filters[key] }));
    const query = makeQuery(searchParams, {}, {}, filtersData);

    router.push(`${pathname}${query}`, { scroll: false });
  }, [pathname, router, searchParams, filters])


  return (
    <Container
      sx={{
        py: { xs: 10, md: 10 },
        maxWidth: '1400px !important'
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems='center'
        spacing={1}
        sx={{
          mb: { xs: 1, md: 2 },
        }}
      >
        <TextField
          fullWidth
          value={filters.search}
          onChange={(event) => handleFilters('search', event.target.value)}
          placeholder={`${t('search')}...`}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <Autocomplete
          freeSolo
          fullWidth
          disableClearable
          options={options.map((option) => option.description)}
          value={filters.address}
          onInputChange={async (_, newInputValue) => {
            handleFilters('address', newInputValue);

            const coordinates = await forwardGeocode(newInputValue);

            if (coordinates) {
              setMapCenter([coordinates.lat, coordinates.lng]);
              setMapZoom(10);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={t('enter-address')}
              variant='outlined'
              InputProps={{ ...params.InputProps, type: 'search' }}
            />
          )}
        />
      </Stack>

      <LeafletMap center={mapCenter} zoom={mapZoom} style={{ height: '800px', width: '100%', borderRadius: 16 }}>
        {locations.map((location, index) => (
          <LocationMarker
            id={location.id}
            latitude={location.latitude}
            longitude={location.longitude}
            address={location.address}
            type={location.location_type_name}
            type_display_name={location.location_type_display_name}
            name={location.name}
            collects_caps={!!location.collects_caps}
            collects_bottles={!!location.collects_bottles}
            collects_cans={!!location.collects_cans}
            working_time={location.working_time}
            user={location.information.user}
            first_name={location.first_name}
            last_name={location.last_name}
            email={location.email}
            phone={location.phone}
            actions={false}
            key={index}
          />
        ))}
      </LeafletMap>

    </Container>
  );
};

MapHomeContent.propTypes = {
  locations: PropTypes.array
};
