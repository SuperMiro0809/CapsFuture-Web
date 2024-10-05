import PropTypes from 'prop-types';

import { m, useScroll } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { alpha, styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { HEADER } from 'src/layouts/config-layout';
import { bgBlur, bgGradient, textGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { varFade, MotionContainer } from 'src/components/animate';
import Image from 'src/components/image';

import HomeCampaignsSwiper from './home-campaigns-swiper';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  ...bgGradient({
    // color: alpha(theme.palette.background.default, theme.palette.mode === 'light' ? 0.9 : 0.94),
    // imgUrl: '/assets/background/overlay_3.jpg',
  }),
  width: '100%',
  height: '100vh',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    position: 'fixed',
  },
}));

const StyledWrapper = styled('div')(({ theme }) => ({
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  marginTop: 100,
  // ...bgGradient({
  //   // color: alpha(theme.palette.gradient.pink, theme.palette.mode === 'light' ? 0.9 : 0.94),
  //   color: theme.palette.gradient.pink
  //   // imgUrl: '/assets/background/overlay_3.jpg',
  // }),
  background: theme.palette.gradient.pink,
  [theme.breakpoints.up('md')]: {
    marginTop: HEADER.H_DESKTOP_OFFSET,
  },
}));

const StyledTextGradient = styled(m.h1)(({ theme }) => ({
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
  [theme.breakpoints.up('lg')]: {
    fontSize: `${80 / 16}rem`,
  },
}));

const StyledSubheaderText = styled(m.h3)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 25%, ${theme.palette.secondary.dark} 50%, ${theme.palette.secondary.light} 75%, ${theme.palette.primary.main} 100%`
  ),
  padding: 0,
  marginTop: 8,
  lineHeight: 1.15,
  fontWeight: 900,
  marginBottom: 24,
  letterSpacing: 6,
  textAlign: 'left',
  backgroundSize: '400%',
  fontSize: `${24 / 16}rem`,
  fontFamily: theme.typography.fontSecondaryFamily,
  [theme.breakpoints.up('md')]: {
    fontSize: `${30 / 16}rem`,
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: `${40 / 16}rem`,
  },
}));

const StyledEllipseTop = styled('div')(({ theme }) => ({
  top: -80,
  width: 480,
  right: -80,
  height: 480,
  borderRadius: '50%',
  position: 'absolute',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  // backgroundColor: alpha(theme.palette.primary.main, 0.12),
}));

const StyledEllipseBottom = styled('div')(({ theme }) => ({
  height: 400,
  bottom: -200,
  left: '10%',
  right: '10%',
  borderRadius: '50%',
  position: 'absolute',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  // backgroundColor: alpha(theme.palette.primary.main, 0.12),
}));

const StyledPolygon = styled('div')(({ opacity = 1, anchor = 'left', theme }) => ({
  ...bgBlur({
    opacity,
    color: theme.palette.secondary.lighter,
  }),
  zIndex: 9,
  bottom: 0,
  height: 80,
  width: '50%',
  position: 'absolute',
  clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
  ...(anchor === 'left' && {
    left: 0,
    ...(theme.direction === 'rtl' && {
      transform: 'scale(-1, 1)',
    }),
  }),
  ...(anchor === 'right' && {
    right: 0,
    transform: 'scaleX(-1)',
    ...(theme.direction === 'rtl' && {
      transform: 'scaleX(1)',
    }),
  }),
}));

// ----------------------------------------------------------------------

export default function HomeHero({ campaigns }) {
  const { t } = useTranslate();

  const mdUp = useResponsive('up', 'md');

  const theme = useTheme();

  const heroRef = useRef(null);

  const { scrollY } = useScroll();

  const [percent, setPercent] = useState(0);

  const lightMode = theme.palette.mode === 'light';

  const matchesHeight = useMediaQuery('(min-height:1000px)');

  const getScroll = useCallback(() => {
    let heroHeight = 0;

    if (heroRef.current) {
      heroHeight = heroRef.current.offsetHeight;
    }

    scrollY.on('change', (scrollHeight) => {
      const scrollPercent = (scrollHeight * 100) / heroHeight;

      setPercent(Math.floor(scrollPercent));
    });
  }, [scrollY]);

  useEffect(() => {
    getScroll();
  }, [getScroll]);

  const transition = {
    repeatType: 'loop',
    ease: 'linear',
    duration: 60 * 4,
    repeat: Infinity,
  };

  const opacity = 1 - percent / 100;

  const hide = percent > 120;

  const renderDescription = (
    <Stack
      alignItems="center"
      justifyContent="flex-start"
      sx={{
        // height: 1,
        mx: 'auto',
        maxWidth: 1400,
        opacity: opacity > 0 ? opacity : 0,
        mt: {
          md: `${80 + percent * 2.5}px`,
        },
      }}
    >
      <m.div variants={varFade().in}>
        <StyledTextGradient
          animate={{ backgroundPosition: '200% center' }}
          transition={{
            repeatType: 'reverse',
            ease: 'linear',
            duration: 20,
            repeat: Infinity,
          }}
        >
          {t('upcoming', { ns: 'campaign' })}
        </StyledTextGradient>
      </m.div>
    </Stack>
  );

  const renderSwiper = (
    <Stack
      sx={{
        height: { xs: '700px', lg: '770px' },
        mx: 'auto',
        maxWidth: 1400,
        width: '100%',
        opacity: {
          md: opacity > 0 ? opacity : 0
        },
        mt: {
          xs: 30,
          lg: matchesHeight ? `${2 * HEADER.H_DESKTOP + 50 + percent * 2.5}px` : 30,
        },
      }}
    >
      <HomeCampaignsSwiper campaigns={campaigns} />
    </Stack>
  );

  const renderNoUpcomingCampaigns = (
    <Grid
      container
      sx={{
        height: 1,
        opacity: {
          md: opacity > 0 ? opacity : 0
        },
        mt: {
          xs: 5,
          md: 15,
          lg: matchesHeight ? `${HEADER.H_DESKTOP + 50 + percent}px` : 30,
        },
      }}
    >
      <Grid xs={12} md={6}>
        <StyledSubheaderText
        //  animate={{ backgroundPosition: '200% center' }}
        //  transition={{
        //    repeatType: 'reverse',
        //    ease: 'linear',
        //    duration: 20,
        //    repeat: Infinity,
        //  }}
        >
          {t('no-upcoming-campaigns.title', { ns: 'home' })}
        </StyledSubheaderText>

        <Typography
          variant='body1'
          sx={(theme) => ({
            color: theme.palette.grey[600]
          })}
        >
          {t('no-upcoming-campaigns.description', { ns: 'home' })} &#128522;
        </Typography>

        <Typography
          variant='body1'
          sx={(theme) => ({
            my: 4,
            color: theme.palette.grey[600]
          })}
        >
          {t('no-upcoming-campaigns.additional-info', { ns: 'home' })}
        </Typography>

        <Stack direction='row' spacing={1.5} sx={{ flexWrap: 'wrap' }}>
          <Button
            component={RouterLink}
            variant='contained'
            color='primary'
            href={paths.map}
            startIcon={<SvgColor src='/assets/icons/navbar/ic_station.svg' />}
          >
            {t('to-map', { ns: 'common' })}
          </Button>
          <Button
            component={RouterLink}
            variant='outlined'
            color='secondary'
            href={paths.post.root}
            startIcon={<SvgColor src='/assets/icons/navbar/ic_blog.svg' />}
          >
            {t('to-posts', { ns: 'common' })}
          </Button>
          <Button
            component={RouterLink}
            variant='outlined'
            color='primary'
            href={paths.store.root}
            startIcon={<SvgColor src='/assets/icons/navbar/ic_ecommerce.svg' />}
          >
            {t('to-store', { ns: 'common' })}
          </Button>
        </Stack>
      </Grid>

      <Grid xs={0} sm={12} md={6}>
        <Box
          sx={{
            textAlign: {
              sm: 'center',
              md: 'right'
            }
          }}
        >
          <Image src='/assets/images/home/campaigns/illustration-campaigns.svg' />
        </Box>
      </Grid>
    </Grid>
  );

  const renderSlides = (
    <Stack
      direction="row"
      alignItems="flex-start"
      sx={{
        height: '150%',
        position: 'absolute',
        opacity: opacity > 0 ? opacity : 0,
        transform: `skew(${-16 - percent / 24}deg, ${4 - percent / 16}deg)`,
        ...(theme.direction === 'rtl' && {
          transform: `skew(${16 + percent / 24}deg, ${4 + percent / 16}deg)`,
        }),
      }}
    >
      <Stack
        component={m.div}
        variants={varFade().in}
        sx={{
          width: 344,
          position: 'relative',
        }}
      >
        <Box
          component={m.img}
          animate={{ y: ['0%', '100%'] }}
          transition={transition}
          alt={lightMode ? 'light_1' : 'dark_1'}
          src={
            lightMode
              ? `/assets/images/home/hero/light_1.webp`
              : `/assets/images/home/hero/dark_1.webp`
          }
          sx={{ position: 'absolute', mt: -5 }}
        />
        <Box
          component={m.img}
          animate={{ y: ['-100%', '0%'] }}
          transition={transition}
          alt={lightMode ? 'light_1' : 'dark_1'}
          src={
            lightMode
              ? `/assets/images/home/hero/light_1.webp`
              : `/assets/images/home/hero/dark_1.webp`
          }
          sx={{ position: 'absolute' }}
        />
      </Stack>

      <Stack
        component={m.div}
        variants={varFade().in}
        sx={{ width: 720, position: 'relative', ml: -5 }}
      >
        <Box
          component={m.img}
          animate={{ y: ['100%', '0%'] }}
          transition={transition}
          alt={lightMode ? 'light_2' : 'dark_2'}
          src={
            lightMode
              ? `/assets/images/home/hero/light_2.webp`
              : `/assets/images/home/hero/dark_2.webp`
          }
          sx={{ position: 'absolute', mt: -5 }}
        />
        <Box
          component={m.img}
          animate={{ y: ['0%', '-100%'] }}
          transition={transition}
          alt={lightMode ? 'light_2' : 'dark_2'}
          src={
            lightMode
              ? `/assets/images/home/hero/light_2.webp`
              : `/assets/images/home/hero/dark_2.webp`
          }
          sx={{ position: 'absolute' }}
        />
      </Stack>
    </Stack>
  );

  const renderPolygons = (
    <>
      <StyledPolygon />
      <StyledPolygon anchor="right" opacity={0.48} />
      <StyledPolygon anchor="right" opacity={0.48} sx={{ height: 48, zIndex: 10 }} />
      <StyledPolygon anchor="right" sx={{ zIndex: 11, height: 24 }} />
    </>
  );

  const renderEllipses = (
    <>
      {mdUp && <StyledEllipseTop />}
      <StyledEllipseBottom />
    </>
  );

  return (
    <>
      <StyledRoot
        ref={heroRef}
        sx={{
          ...(hide && {
            opacity: 0,
          }),
        }}
      >
        <StyledWrapper>

          {renderDescription}

          {campaigns.length > 0 ?
            renderSwiper :
            <Container component={MotionContainer} sx={{ height: 1, maxWidth: '1400px !important' }}>
              {renderNoUpcomingCampaigns}
            </Container>
          }

          {/* <Container component={MotionContainer} sx={{ height: 1 }}>
            {renderDescription}
            <Grid container columnSpacing={{ md: 10 }} sx={{ height: 1 }}>
              <Grid xs={12} md={6}>
                {renderDescription}
              </Grid>

              {mdUp && <Grid md={6}>{renderSlides}</Grid>}
            </Grid>
          </Container> */}

          {renderEllipses}


        </StyledWrapper>
        {/* <HomeCampaignsSwiper /> */}
      </StyledRoot>

      {mdUp && renderPolygons}


      <Box sx={{ height: { md: '100vh' }, backgroundColor: 'white' }} />
    </>
  );
}

HomeHero.propTypes = {
  campaigns: PropTypes.array
};
