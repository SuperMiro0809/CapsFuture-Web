import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';

import BottleCapPink from 'public/assets/illustrations/bottle_caps/bottle_cap_pink.svg';
import BottleCapBlue from 'public/assets/illustrations/bottle_caps/bottle_cap_blue.svg';
import BottleCapGreen from 'public/assets/illustrations/bottle_caps/bottle_cap_green.svg';
import BottleCapYellow from 'public/assets/illustrations/bottle_caps/bottle_cap_yellow.svg';

import { RotatingBottleCap } from 'src/components/animate/bottle-caps/rotate';

import Header from 'src/layouts/main/header';

import BottleCapsAuthCover from 'src/components/animate/bottle-caps/auth-cover';

// ----------------------------------------------------------------------

export default function AuthClassicLayout({ children, image, title }) {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const renderLogo = (
    <Header />
    // <Logo
    //   sx={{
    //     zIndex: 9,
    //     position: 'absolute',
    //     m: { xs: 2, md: 5 },
    //   }}
    // />
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mr: 'auto',
        maxWidth: 640,
        px: { xs: 2, md: 0 },
        pt: { xs: 15, md: 50 },
        pb: { xs: 15, md: 0 },
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={0.75}
      spacing={10}
      alignItems="center"

      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94
          ),
          // imgUrl: '/assets/background/overlay_2.jpg',
        }),
      }}
    >
      {/* <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
        {title || 'Hi, Welcome back'}
      </Typography> */}

      {/* <RotatingBottleCap style={{ left: 160, height: '190px' }} delay={0} rotationDuration={3000}>
        <BottleCapPink />
      </RotatingBottleCap>

      <RotatingBottleCap style={{ left: 720, height: '220px' }} delay={200} rotationDuration={3200}>
        <BottleCapBlue />
      </RotatingBottleCap>

      <RotatingBottleCap style={{ left: 440, height: '190px' }} delay={400} rotationDuration={3400}>
        <BottleCapGreen />
      </RotatingBottleCap>

      <RotatingBottleCap style={{ left: 1000, height: '190px' }} delay={600} rotationDuration={3600}>
        <BottleCapYellow />
      </RotatingBottleCap> */}

      <BottleCapsAuthCover />

      {/* <RotatingBottleCap style={{ left: 1000, height: '190px' }} delay={600} rotationDuration={3800}>
        <BottleCapYellow />
      </RotatingBottleCap>

      <RotatingBottleCap style={{ left: 1000, height: '190px' }} delay={600} rotationDuration={4000}>
        <BottleCapYellow />
      </RotatingBottleCap> */}
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        height: '100vh',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {renderLogo}

      {mdUp && renderSection}

      {renderContent}
    </Stack>
  );
}

AuthClassicLayout.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string,
  title: PropTypes.string,
};
