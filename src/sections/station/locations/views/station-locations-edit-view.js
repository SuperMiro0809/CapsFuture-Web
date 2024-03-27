'use client';

import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// i18
import { useTranslation } from 'react-i18next';
//
import StationLocationsNewEditForm from '../station-locations-new-edit-form';

// ----------------------------------------------------------------------

export default function StationLocationsEditView({ location, locationTypes, users }) {
  const settings = useSettingsContext();

  const { t } = useTranslation();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('edit', { ns: 'common' })}
        links={[
          {
            name: t('dashboard', { ns: 'headers' }),
            href: paths.dashboard.root,
          },
          {
            name: t('locations', { ns: 'headers' }),
            href: paths.dashboard.station.locations.root,
          },
          { name: location?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

     <StationLocationsNewEditForm currentLocation={location} locationTypes={locationTypes} users={users} />
    </Container>
  );
}

StationLocationsEditView.propTypes = {
  location: PropTypes.object,
  locationTypes: PropTypes.array,
  users: PropTypes.array
};
