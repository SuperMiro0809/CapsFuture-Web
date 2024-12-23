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
import CampaignNewEditForm from '../campaign-new-edit-form';

// ----------------------------------------------------------------------

export default function CampaignDetailsView({ campaign }) {
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
            name: t('campaigns', { ns: 'headers' }),
            href: paths.dashboard.campaign.root,
          },
          { name: campaign && campaign.title },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* <CampaignNewEditForm currentCampaign={campaign} /> */}
    </Container>
  );
}

CampaignDetailsView.propTypes = {
  campaign: PropTypes.object,
};
