'use client';

import PropTypes from 'prop-types';
import { useState, useEffect, useTransition } from 'react';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
// locales
import { useTranslate } from 'src/locales';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// api
import { getUserAttendances } from 'src/api/campaign-attendances';
// components
import { CampaignCard } from 'src/components/campaigns';
import { ASSETS } from 'src/config-global';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ProfileCampaigns() {
  const { t } = useTranslate();

  const [campaigns, setCampaigns] = useState([]);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const { data, error } = await getUserAttendances('bg', 2);

        if (error) throw error;

        setCampaigns(data);
      } catch (error) {
        console.log(error);
      }
    })
  }, [])

  return (
    <>
      <Card>
        <CardHeader title={t('campaigns', { ns: 'headers' })} />

        {(campaigns.length === 0 && !isPending) && (
          <Box sx={{ position: 'relative', height: 150 }}>
            <Box
              sx={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                left: '50%',
                top: '50%',
                zIndex: 1,
                textAlign: 'center'
              }}
            >
              <Typography variant='subtitle1'>{t('profile-no-campaigns-activity')}.</Typography>
              <Typography variant='body2'>{t('campaigns-active-overview')}:</Typography>
              <Button
                component={RouterLink}
                href={paths.campaign.root}
                color='primary'
                endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                sx={{ mt: 2 }}
              >
                {t('to-campaigns', { ns: 'common' })}
              </Button>
            </Box>
          </Box>
        )}

        {(isPending && campaigns.length === 0) && (
          <Box sx={{ position: 'relative', height: 150 }}>
            <Box
              sx={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                left: '50%',
                top: '50%',
                zIndex: 1,
                textAlign: 'center'
              }}
            >
              <CircularProgress color='primary' />
            </Box>
          </Box>
        )}

        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
          sx={{ p: 3 }}
        >
          {campaigns.map((campaignAttendance) => (
            <CampaignCard
              id={campaignAttendance.campaign.id}
              slug={campaignAttendance.campaign.id}
              date={campaignAttendance.campaign.date}
              imageSrc={`${ASSETS}/${campaignAttendance.campaign.title_image_path}`}
              title={campaignAttendance.campaign.title}
              shortDescription={campaignAttendance.campaign.short_description}
              cities={campaignAttendance.campaign.cities}
              attendances={campaignAttendance.campaign.attendances}
              key={campaignAttendance.id}
            />
          ))}
        </Box>
      </Card>
    </>
  );
}

ProfileCampaigns.propTypes = {
  campaigns: PropTypes.array,
};
