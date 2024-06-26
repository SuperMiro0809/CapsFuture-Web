'use client'

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// locales
import { useTranslate } from 'src/locales';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// components
import Iconify from 'src/components/iconify';
import BottleCapsMainCover from 'src/components/animate/bottle-caps/main-cover';
import LoginButton from 'src/layouts/common/login-button';
//
import CampaignParticipateForm from '../campaign-participate-form';

// ----------------------------------------------------------------------

export default function CampaignParticipateView({ slug }) {
  const { t } = useTranslate();

  const mdUp = useResponsive('up', 'md');

  const renderHead = (
    <Stack spacing={1} sx={{ mb: 5, position: 'relative', zIndex: 1 }}>
      <Button
        component={RouterLink}
        href={paths.campaign.details(slug)}
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        sx={{ maxWidth: 70 }}
      >
        {t('back', { ns: 'common' })}
      </Button>
      <Typography variant="h3" color='primary'>{t('participate-modal.title', { ns: 'campaign' })}</Typography>
    </Stack>
  );

  const renderContent = (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      alignItems='center'
      justifyContent='center'
      spacing={3}
      sx={{
        width: 1,
        ml: 'auto',
        position: 'relative',
        zIndex: 1
      }}
    >
      <Box>
        <Stack spacing={1} sx={{ mb: 5 }}>
          <Typography variant="h4">{t('already-have-account', { ns: 'auth' })}?</Typography>
          <Typography variant="body1">{t('login-prompt', { ns: 'campaign' })}:</Typography>
          <ul>
            <li>{t('benefits.easier-campaign-signup', { ns: 'campaign' })}</li>
            <li>{t('benefits.campaign-save', { ns: 'campaign' })}</li>
            <li>{t('benefits.feedback-opportunity', { ns: 'campaign' })}</li>
            <li>{t('benefits.unsubscribe-anytime', { ns: 'campaign' })}</li>
          </ul>
          <LoginButton returnTo={`/campaigns/${slug}`} />
        </Stack>
      </Box>

      <Typography
        variant='subtitle2'
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: { xs: '50%', md: '-500%' },
            left: { xs: '-600%', md: '50%' },
            width: { xs: 250, md: '1px' },
            height: { xs: '1px', md: 150 },
            backgroundColor: (theme) => theme.palette.text.primary,
            transform: 'translate(-50%, -50%)'
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            top: { xs: '50%', md: '600%' },
            right: { xs: '-1600%', md: '50%' },
            width: { xs: 250, md: '1px' },
            height: { xs: '1px', md: 150 },
            backgroundColor: (theme) => theme.palette.text.primary,
            transform: 'translate(-50%, -50%)'
          }
        }}
      >
        {t('or', { ns: 'common' })}
      </Typography>

      <Box sx={{ height: 370 }}>
        <CampaignParticipateForm slug={slug} />
      </Box>
    </Stack>
  );

  return (
    <Container
      sx={{
        maxWidth: '1400px !important',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
        pt: { xs: 15, md: 25 },
        pb: { xs: 15, md: 20 }
      }}
    >
      {renderHead}

      {mdUp && <BottleCapsMainCover />}

      {renderContent}
    </Container>
  );
}

CampaignParticipateView.propTypes = {
  slug: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
