import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import SpeedDial from '@mui/material/SpeedDial';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import SpeedDialAction from '@mui/material/SpeedDialAction';
// react-share
import { FacebookShareButton, FacebookMessengerShareButton, InstapaperShareButton, TwitterShareButton, ViberShareButton } from 'react-share';
// routes
import { usePathname } from 'src/routes/hooks';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Iconify from 'src/components/iconify';
//
import { bgGradient } from 'src/theme/css';
import { ORIGIN } from 'src/config-global';

// ----------------------------------------------------------------------

export default function PostDetailsHero({ title, coverUrl, createdAt }) {
  const theme = useTheme();

  const smUp = useResponsive('up', 'sm');

  const pathname = usePathname();

  const socials = [
    {
      name: 'Facebook',
      icon: 'eva:facebook-fill',
      component: FacebookShareButton,
      color: '#1877F2'
    },
    {
      name: 'Facebook Messenger',
      icon: 'logos:messenger',
      component: FacebookMessengerShareButton,
      color: '#1877F2'
    },
    {
      name: 'Instagram',
      icon: 'skill-icons:instagram',
      component: InstapaperShareButton,
      color: '#E02D69'
    },
    {
      name: 'X',
      icon: 'bi:twitter-x',
      component: TwitterShareButton,
      color: 'black'
    },
    {
      name: 'Viber',
      icon: 'jam:viber',
      component: ViberShareButton,
      color: '#8f5db7'
    },
  ];

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
          <Stack gap={1}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                zIndex: 9,
                color: 'common.white',
                maxWidth: 480,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                zIndex: 9,
                color: 'text.disabled',
                maxWidth: 480,
              }}
            >
              {createdAt}
            </Typography>
          </Stack>

          <SpeedDial
            direction={smUp ? 'up' : 'up'}
            ariaLabel="Share post"
            icon={<Iconify icon="solar:share-bold" />}
            FabProps={{ size: 'medium', color: 'secondary' }}
            sx={{ mb: 2 }}
          >
            {socials.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={<Iconify icon={action.icon} sx={{ color: action.color }} />}
                tooltipTitle={action.name}
                tooltipPlacement="top"
                FabProps={{
                  color: 'default',
                  style: { backgroundColor: 'white !important' },
                  component: action.component,
                  url: `${ORIGIN}${pathname}`
                }}
              />
            ))}
          </SpeedDial>
        </Stack>
      </Container>
    </Box>
  );
}

PostDetailsHero.propTypes = {
  coverUrl: PropTypes.string,
  createdAt: PropTypes.string,
  title: PropTypes.string,
};
