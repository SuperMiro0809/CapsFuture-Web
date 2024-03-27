import PropTypes from 'prop-types';
import { useMemo } from 'react';

import { m } from 'framer-motion';
import dynamic from 'next/dynamic';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';


import { textGradient } from 'src/theme/css';

import { varFade, varBounce, MotionViewport } from 'src/components/animate';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

const StyledTextGradient = styled(m.h2)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.light} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.light} 75%, ${theme.palette.primary.main} 100%`
  ),
  padding: 0,
  marginTop: 8,
  lineHeight: 1.15,
  fontWeight: 900,
  marginBottom: 24,
  letterSpacing: 8,
  textAlign: 'center',
  backgroundSize: '400%',
  fontSize: `${40 / 16}rem`,
  fontFamily: theme.typography.fontSecondaryFamily,
  [theme.breakpoints.up('md')]: {
    fontSize: `${64 / 16}rem`,
  },
}));

// ----------------------------------------------------------------------

export default function HomeMap({ locations }) {
  const { t } = useTranslate();

  const LeafletMap = useMemo(() => dynamic(
    () => import('src/components/leaflet-map').then(module => module.LeafletMap),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), []);

  const LocationMarker = useMemo(() => dynamic(
    () => import('src/components/leaflet-map').then(module => module.LocationMarker),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), []);

  const position = [42.7249925, 25.4833039];
  const zoom = 7;

  // iloveyou<3

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
        maxWidth: '1400px !important'
      }}
    >
      <Stack
        spacing={3}
        sx={{
          textAlign: 'center',
          mb: { xs: 5, md: 15 },
          position: 'relative',
          zIndex: 1
        }}
      >
        <m.div variants={varFade().inUp}>
          <StyledTextGradient
            animate={{ backgroundPosition: '200% center' }}
            transition={{
              repeatType: 'reverse',
              ease: 'linear',
              duration: 20,
              repeat: Infinity,
            }}
          >
            {t('where-to-transmit-caps')}?
          </StyledTextGradient>
        </m.div>
      </Stack>

      <Grid container spacing={1} justifyContent='space-between' alignItems='center'>
        <Grid xs={0} md={4}>
          <m.div variants={varBounce().in}>
            <img src='/assets/images/home/map/illustration-map.svg' />
          </m.div>
        </Grid>
        <Grid xs={12} md={7}>
          {/* <m.div variants={varFade().inRight}> */}
            <LeafletMap center={position} zoom={zoom} style={{ height: '600px', width: '100%', borderRadius: 16 }}>
              {locations.splice(1, 100).map((location, index) => (
                  <LocationMarker
                    id={location.id}
                    latitude={location.latitude}
                    longitude={location.longitude}
                    address={location.address}
                    type={location.location_type_name}
                    type_display_name={location.location_type_display_name}
                    name={location.name}
                    collects_caps={!!location.collects_caps}
                    collects_bottles={!!location.collects_bottles}
                    collects_cans={!!location.collects_cans}
                    working_time={location.working_time}
                    user={location.information.user}
                    first_name={location.first_name}
                    last_name={location.last_name}
                    email={location.email}
                    phone={location.phone}
                    actions={false}
                    key={index}
                  />
              ))}
            </LeafletMap>
          {/* </m.div> */}
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <m.div variants={varFade().in}>
          <Button
            component={RouterLink}
            href='/map'
            variant='outlined'
            color='primary'
            sx={{ fontSize: 16 }}
          >
            {t('see-more', { ns: 'common' })}
          </Button>
        </m.div>
      </Box>

    </Container>
  );
}

HomeMap.propTypes = {
  locations: PropTypes.array
};
