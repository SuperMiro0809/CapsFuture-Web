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

export default function StationLocationsCreateView({ locationTypes, users }) {
  const settings = useSettingsContext();

  const { t } = useTranslation();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('create-new-location')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('locations'),
            href: paths.dashboard.station.locations.root,
          },
          { name: t('new-location') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

     <StationLocationsNewEditForm locationTypes={locationTypes} users={users} />
    </Container>
  );
}

StationLocationsCreateView.propTypes = {
  locationTypes: PropTypes.array,
  users: PropTypes.array
};
