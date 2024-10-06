'use client'

import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@googlemaps/js-api-loader';
// @mui
import Container from '@mui/material/Container';
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// locales
import { useTranslate, useLocales } from 'src/locales';
// routes
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';
// utils
import { makeQuery } from 'src/utils/url-query';
// api
import { forwardGeocode } from 'src/api/google-maps';
import { GOOGLE_MAPS } from 'src/config-global';
// components
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useTable } from 'src/components/table';
//
import MapHomeTableView from './map-home-table-view';
import StationLocationsFilters from '../station/locations/station-locations-filters';
import StationLocationsFiltersResult from '../station/locations/station-locations-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  address: '',
  name: '',
  type: [],
  collects: []
};

// ----------------------------------------------------------------------

export default function MapHomeContent({ locations }) {
  const { t } = useTranslate();

  const { currentLang } = useLocales();

  const locationsData = locations.map((location) => ({ ...location, address: currentLang.value === 'bg' ? location.address_bg : location.address_en }));

  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const table = useTable({ defaultRowsPerPage: 10 })

  const [filters, setFilters] = useState(defaultFilters);

  const [view, setView] = useState('map');

  const [options, setOptions] = useState([]);

  const [mapCenter, setMapCenter] = useState([42.7249925, 25.4833039]);
  const [mapZoom, setMapZoom] = useState(8);

  const locationsFiltered = applyFilter({
    inputData: locationsData,
    filters,
  });

  const canReset =
    !!filters.name ||
    filters.type.length > 0 ||
    filters.collects.length > 0;

  const LOCATION_TYPES_OPTIONS = [
    { label: t('heart', { ns: 'location' }), value: 1, icon: <SvgColor src='/assets/icons/map/ic_heart.svg' sx={{ width: 32, height: 32, color: 'primary.main' }} /> },
    { label: t('station', { ns: 'location' }), value: 2, icon: <SvgColor src='/assets/icons/map/ic_station.svg' sx={{ width: 32, height: 32, color: 'primary.main' }} /> },
  ];

  const LOCATION_COLLECTS_OPTIONS = [
    { label: t('caps', { ns: 'common' }), value: 'caps', icon: <SvgColor src='/assets/icons/app/bottle_cap.svg' sx={{ width: 32, height: 32, color: 'secondary.dark' }} /> },
    { label: t('bottles', { ns: 'common' }), value: 'bottles', icon: <Iconify icon="solar:bottle-bold-duotone" width={32} height={32} sx={{ color: 'secondary.dark' }} /> },
    { label: t('cans', { ns: 'common' }), value: 'cans', icon: <Iconify icon="pepicons-print:can" width={32} height={32} sx={{ color: 'secondary.dark' }} /> },
  ];

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

  const handleChangeView = useCallback((event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  }, []);

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

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

  // useEffect(() => {
  //   const filtersData = Object.keys(filters).map((key) => ({ id: key, value: filters[key] }));
  //   const query = makeQuery(searchParams, {}, {}, filtersData);

  //   router.push(`${pathname}${query}`, { scroll: false });
  // }, [pathname, router, searchParams, filters])


  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <StationLocationsFilters
        filters={filters}
        onFilters={handleFilters}
        //
        typeOptions={LOCATION_TYPES_OPTIONS}
        collectsOptions={LOCATION_COLLECTS_OPTIONS}
      />

      {/* <Autocomplete
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
            placeholder={t('enter-address', { ns: 'location' })}
            variant='outlined'
            InputProps={{ ...params.InputProps, type: 'search' }}
          />
        )}
      /> */}

      <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
        <ToggleButton value="map">
          <Iconify icon="solar:map-point-wave-linear" />
        </ToggleButton>

        <ToggleButton value="list">
          <Iconify icon="solar:list-bold" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );

  const renderResults = (
    <StationLocationsFiltersResult
      filters={filters}
      onFilters={handleFilters}
      onResetFilters={handleResetFilters}
      onResetPage={table.onResetPage}
      //
      typeOptions={LOCATION_TYPES_OPTIONS}
      collectsOptions={LOCATION_COLLECTS_OPTIONS}
      //
      totalResults={locationsFiltered.length}
    />
  );

  return (
    <Container
      sx={{
        py: { xs: 10, md: 10 },
        maxWidth: '1400px !important'
      }}
    >

      <Stack
        spacing={2.5}
        sx={{
          my: { xs: 3, md: 3 },
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      <Card>
        {view === 'map' ? (
          <LeafletMap center={mapCenter} zoom={mapZoom} style={{ height: '800px', width: '100%', borderRadius: 16 }}>
            {locationsFiltered.map((location, index) => (
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
        ) : (
          <MapHomeTableView
            table={table}
            locations={locationsFiltered}
          />
        )}
      </Card>

    </Container>
  );
};

MapHomeContent.propTypes = {
  locations: PropTypes.array
};

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters }) {
  const { name, type, collects } = filters;

  if (name) {
    inputData = inputData.filter(
      (location) => location.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        location.address.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (collects.includes('caps')) {
    inputData = inputData.filter((location) => !!location.collects_caps);
  }

  if (collects.includes('bottles')) {
    inputData = inputData.filter((location) => !!location.collects_bottles);
  }

  if (collects.includes('cans')) {
    inputData = inputData.filter((location) => !!location.collects_cans);
  }

  if (type.length > 0) {
    inputData = inputData.filter((location) => type.includes(location.type_id));
  }

  return inputData;
}
