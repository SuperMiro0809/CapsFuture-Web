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
import Chip from '@mui/material/Chip';
// react-share
import { FacebookShareButton } from 'react-share';
// routes
import { usePathname } from 'src/routes/hooks';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// locales
import { useTranslate } from 'src/locales';
// components
import Iconify from 'src/components/iconify';
//
import { _socials } from 'src/_mock';
import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

export default function CampaignDetailsHero({ title, date, cities, coverUrl, onParticipate }) {
  const { t } = useTranslate();

  const theme = useTheme();

  const smUp = useResponsive('up', 'sm');

  const pathname = usePathname();

  return (
    <Box
      sx={{
        height: 480,
        overflow: 'hidden',
        ...bgGradient({
          imgUrl: coverUrl,
          startColor: `${alpha(theme.palette.grey[900], 0.54)} 0%`,
          endColor: `${alpha(theme.palette.grey[900], 0.54)} 100%`,
        }),
      }}
    >
      <Container
        sx={{
          height: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          gap={{ xs: 3, md: 0 }}
          justifyContent='space-between'
          alignItems={{ xs: 'center', md: 'flex-end' }}
          sx={{ py: 5 }}
        >
          <Stack
            gap={1}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                zIndex: 9,
                color: 'common.white',
              }}
            >
              {title}
            </Typography>

            <Stack direction='row' spacing={1}>
              {cities.map((city) => (
                <Chip
                  sx={{ borderRadius: 6 }}
                  color='primary'
                  label={city.city}
                  key={city.id}
                />
              ))}
            </Stack>
          </Stack>

          <Stack
            direction='row'
            alignItems='flex-end'
            gap={2}
            sx={{
              maxWidth: 400,
              width: '100%'
            }}
          >
            <Stack
              gap={1}
              alignItems='center'
              sx={{ width: '100%' }}
            >
              <Button
                variant='contained'
                color='primary'
                sx={{
                  width: '100%',
                  height: 48,
                  fontSize: 15
                }}
                onClick={onParticipate}
              >
                {t('participate')}!
              </Button>

              <Typography
                sx={{
                  color: 'common.white',
                }}
              >
                {t('will-take-place-on')}:

                <Box
                  component='span'
                  sx={{
                    color: 'primary.light',
                    fontWeight: 600,
                    pl: 0.5
                  }}
                >
                  {date}
                  {/* 19.02.2024 */}
                </Box>
              </Typography>
            </Stack>
            
            <SpeedDial
              direction={smUp ? 'up' : 'up'}
              ariaLabel="Share post"
              icon={<Iconify icon="solar:share-bold" />}
              FabProps={{ size: 'medium', color: 'secondary' }}
              color='secondary'
              sx={{ mb: 4 }}
            >
              {_socials.map((action) => (
                <SpeedDialAction
                  // component={FacebookShareButton}
                  key={action.name}
                  icon={<Iconify icon={action.icon} sx={{ color: action.color }} />}
                  tooltipTitle={action.name}
                  tooltipPlacement="top"
                  FabProps={{ color: 'default' }}
                />
              ))}
            </SpeedDial>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

CampaignDetailsHero.propTypes = {
  author: PropTypes.object,
  coverUrl: PropTypes.string,
  date: PropTypes.string,
  title: PropTypes.string,
};
