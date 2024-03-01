'use client';

import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// locales
import { useTranslate } from 'src/locales';
// components
import Iconify from 'src/components/iconify';
import { CampaignCard } from 'src/components/campaigns';
import { ASSETS } from 'src/config-global';

// ----------------------------------------------------------------------

export default function ProfileCampaigns({ campaigns }) {
  const { t } = useTranslate();

  const _mockFollowed = campaigns.slice(4, 8).map((i) => i.id);

  const [followed, setFollowed] = useState(_mockFollowed);

  const handleClick = useCallback(
    (item) => {
      const selected = followed.includes(item)
        ? followed.filter((value) => value !== item)
        : [...followed, item];

      setFollowed(selected);
    },
    [followed]
  );

  return (
    <>
      <Typography variant="h4" sx={{ my: 5 }}>
        {t('campaigns')}
      </Typography>

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {campaigns.map((campaignAttendance) => (
          <CampaignCard
            id={campaignAttendance.campaign.id}
            slug={campaignAttendance.campaign.id}
            date={campaignAttendance.campaign.date}
            imageSrc={`${ASSETS}/${campaignAttendance.campaign.title_image_path}`}
            title={'test'}
            shortDescription='test'
            cities={campaignAttendance.campaign.cities}
            attendances={campaignAttendance.campaign.attendances}
            // campaign={campaignAttendance.campaign}
            // selected={followed.includes(campaignAttendance.id)}
            // onSelected={() => handleClick(campaignAttendance.id)}
            key={campaignAttendance.id}
          />
        ))}
      </Box>
    </>
  );
}

ProfileCampaigns.propTypes = {
  campaigns: PropTypes.array,
};
