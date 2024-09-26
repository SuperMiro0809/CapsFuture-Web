'use client';

import PropTypes from 'prop-types';
import { useState, useCallback, useTransition } from 'react';
// @mui
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// api
import { deleteLocation } from 'src/api/location';
// components
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSnackbar } from 'src/components/snackbar';
import { LeafletMap, LocationMarker } from 'src/components/leaflet-map';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable } from 'src/components/table';
// i18
import { useTranslate, useLocales } from 'src/locales';
//
import StationLocationsTable from '../station-locations-table';
import StationLocationsFilters from '../station-locations-filters';
import StationLocationsFiltersResult from '../station-locations-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  type: [],
  collects: []
};

// ----------------------------------------------------------------------

export default function StationLocationsListView({ locations }) {
  const { t } = useTranslate();

  const { currentLang } = useLocales();

  const table = useTable({ defaultRowsPerPage: 10 });

  const router = useRouter();

  const confirm = useBoolean();

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const [filters, setFilters] = useState(defaultFilters);

  const [selectedId, setSelectedId] = useState(0);

  const [view, setView] = useState('map');

  const [isDeletePending, startDeleteTransition] = useTransition();

  const locationsData = locations.map((location) => ({ ...location, address: currentLang.value === 'bg' ? location.address_bg : location.address_en }));

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

  const position = [42.7249925, 25.4833039];

  const zoom = 8;

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

  const handleDelete = async (id) => {
    startDeleteTransition(async () => {
      try {
        const res = await deleteLocation(id);

        if (res?.error) throw res.error;

        enqueueSnackbar(t('delete-success', { ns: 'messages' }));
        router.refresh();
      } catch (error) {
        enqueueSnackbar(error, { variant: 'error' });
      }
    });
  }

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
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('locations', { ns: 'headers' })}
        links={[
          { name: t('dashboard', { ns: 'headers' }), href: paths.dashboard.root },
          { name: t('locations', { ns: 'headers' }) }
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.station.locations.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            color='secondary'
          >
            {t('new', { ns: 'location' })}
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

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
          <LeafletMap center={position} zoom={zoom} style={{ height: '800px', width: '100%' }}>
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
                deleteHandler={handleDelete}
                key={index}
              />
            ))}
          </LeafletMap>
        ) : (
          <StationLocationsTable
            table={table}
            locations={locationsFiltered}
            //
            handleDelete={handleDelete}
            deleteLoading={isDeletePending}
          />
        )}
      </Card>

      <ConfirmDialog
        open={confirm.value}
        onClose={() => {
          confirm.onFalse();
          setSelectedId(0);
        }}
        title={t('delete.word', { ns: 'common' })}
        content={t('delete.single-modal', { ns: 'common' })}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDelete(selectedId);

              confirm.onFalse();
              setSelectedId(0);
            }}
          >
            {t('delete.action', { ns: 'common' })}
          </Button>
        }
      />
    </Container>
  );
}

StationLocationsListView.propTypes = {
  locations: PropTypes.array
}

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
