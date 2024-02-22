import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import SpeedDial from '@mui/material/SpeedDial';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import SpeedDialAction from '@mui/material/SpeedDialAction';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// locales
import { useTranslate } from 'src/locales';

import { fDate } from 'src/utils/format-time';
//
import { _socials } from 'src/_mock';
import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CampaignDetailsHero({ title, coverUrl, createdAt }) {
  const { t } = useTranslate();

  const theme = useTheme();

  const smUp = useResponsive('up', 'sm');

  return (
    <Box
      sx={{
        height: 480,
        overflow: 'hidden',
        ...bgGradient({
          imgUrl: coverUrl,
          startColor: `${alpha(theme.palette.grey[900], 0.64)} 0%`,
          endColor: `${alpha(theme.palette.grey[900], 0.64)} 100%`,
        }),
      }}
    >
      <Container sx={{ height: 1, position: 'relative' }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            zIndex: 9,
            color: 'common.white',
            position: 'absolute',
            maxWidth: 480,
            pt: { xs: 2, md: 8 },
          }}
        >
          {title}
        </Typography>

        <Stack
          direction='row'
          justifyContent='space-between'
          sx={{
            left: 0,
            width: 1,
            bottom: 0,
            position: 'absolute',
          }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              pb: { xs: 3, md: 8 },
            }}
          >
            <Button variant='contained' color='primary'>{t('participate')}!</Button>
          </Box>

          <SpeedDial
            direction={smUp ? 'left' : 'up'}
            ariaLabel="Share post"
            icon={<Iconify icon="solar:share-bold" />}
            FabProps={{ size: 'medium' }}
            sx={{
              px: { xs: 2, md: 3 },
              pb: { xs: 3, md: 8 },
            }}
          >
            {_socials.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={<Iconify icon={action.icon} sx={{ color: action.color }} />}
                tooltipTitle={action.name}
                tooltipPlacement="top"
                FabProps={{ color: 'default' }}
              />
            ))}
          </SpeedDial>
        </Stack>
      </Container>
    </Box>
  );
}

CampaignDetailsHero.propTypes = {
  author: PropTypes.object,
  coverUrl: PropTypes.string,
  createdAt: PropTypes.string,
  title: PropTypes.string,
};
