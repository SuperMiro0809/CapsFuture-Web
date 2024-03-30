'use client';

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

export default function CampaignCreateView() {
  const settings = useSettingsContext();

  const { t } = useTranslation();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('create-new', { ns: 'campaign' })}
        links={[
          {
            name: t('dashboard', { ns: 'headers' }),
            href: paths.dashboard.root,
          },
          {
            name: t('campaigns', { ns: 'headers' }),
            href: paths.dashboard.campaign.root,
          },
          { name: t('new', { ns: 'campaign' }) },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CampaignNewEditForm />
    </Container>
  );
}
