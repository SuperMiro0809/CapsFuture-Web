'use client';

import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// auth
import { useAuthContext } from 'src/auth/hooks';
// locales
import { useTranslate } from 'src/locales';
//
import { SeoIllustration } from 'src/assets/illustrations';
// components
import { useSettingsContext } from 'src/components/settings';
//
import AppWelcome from '../app-welcome';
import AppWidgetSummary from '../app-widget-summary';
import Logo from 'src/components/logo';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function OverviewAppView({ info }) {
  const { t } = useTranslate();

  const { user } = useAuthContext();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <AppWelcome
            title={`${t('welcome-back')} 👋 \n ${user?.profile.display_name}`}
            description={t('dashboard-description')}
            img={<SeoIllustration />}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <Stack spacing={3}>
            <AppWidgetSummary
              title={t('campaigns', { ns: 'headers' })}
              total={info?.campaignCount}
              buttonHref={paths.dashboard.campaign.root}
              iconName='ic_campaign'
            />

            <AppWidgetSummary
              title={t('products', { ns: 'headers' })}
              total={info?.productCount}
              buttonHref={paths.dashboard.product.root}
              iconName='ic_product'
            />
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <Logo
            sx={{
              width: 180,
              height: 160.24,
              position: 'relative',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <Stack spacing={3}>
            <AppWidgetSummary
              title={t('posts', { ns: 'headers' })}
              total={info?.postCount}
              buttonHref={paths.dashboard.post.root}
              iconName='ic_blog'
            />

            <AppWidgetSummary
              title={t('locations', { ns: 'headers' })}
              total={info?.locationCount}
              buttonHref={paths.dashboard.station.locations.root}
              iconName='ic_station'
            />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

OverviewAppView.propTypes = {
  info: PropTypes.object
}
