import { m } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
// locales
import { useTranslate } from 'src/locales';
// theme
import { textGradient } from 'src/theme/css';
// routes
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
//
import { _mock } from 'src/_mock';
// components
import { varFade, varBounce, MotionViewport } from 'src/components/animate';

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
  fontSize: `${64 / 16}rem`,
  fontFamily: theme.typography.fontSecondaryFamily,
  [theme.breakpoints.up('md')]: {
    fontSize: `${64 / 16}rem`,
  },
}));

// ----------------------------------------------------------------------

export default function HomeAboutUs() {
  const { t } = useTranslate();

  const mdUp = useResponsive('up', 'md');

  const StyledEllipseBottom = styled('div')(({ theme }) => ({
    height: 1100,
    bottom: -200,
    left: '20%',
    right: '10%',
    borderRadius: '50%',
    position: 'absolute',
    filter: 'blur(100px)',
    WebkitFilter: 'blur(100px)',
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
  }));

  const content = (
    <m.div
      variants={varFade().inUp}
      style={{ position: 'relative', textAlign: 'center' }}
    >
      {mdUp && (
        <m.div variants={varFade().inUp} style={{ zIndex: 1, position: 'relative', width: '100%' }}>
          <img src='/assets/images/home/about-us/big_heart.svg' />
        </m.div>
      )}

      <StyledEllipseBottom />

      <Grid
        container
        justifyContent='center'
        sx={{
          position: { xs: 'relative', md: 'absolute' },
          top: '12%',
          zIndex: 2,
        }}
      >
        <Grid md={12} lg={5}>
          <Box sx={{ px: 4 }}>
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
                {t('about-us', { ns: 'headers' })}
              </StyledTextGradient>
            </m.div>

            <m.div variants={varFade().inUp}>
              <Typography variant='body1'>{t('about-us-text', { ns: 'home' })}</Typography>
            </m.div>

            <Box sx={{ mt: 4 }}>
              <m.div variants={varFade().in}>
                <Button
                  component={RouterLink}
                  href='/about-us'
                  variant='outlined'
                  color='primary'
                  sx={{ fontSize: 16 }}
                >
                  {t('see-more', { ns: 'common' })}
                </Button>
              </m.div>
            </Box>
          </Box>
        </Grid>
        <Grid md={12} lg={5} >
          <Box sx={{ mt: 6 }}>
            <m.div variants={varFade().inUp}>
              <Swiper
                effect={'cards'}
                grabCursor={true}
                modules={[EffectCards]}
                className="about-us-card-swiper"
              >
                {[...Array(5)].map((_, index) => (
                  <SwiperSlide
                    style={{
                      backgroundImage: `url('/assets/images/about/${index + 1}.jpeg')`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat'
                    }}
                    key={index}
                  />
                ))}
              </Swiper>
            </m.div>
          </Box>
        </Grid>
      </Grid>

      <Box
        sx={{
          position: 'absolute',
          top: '80%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          display: { xs: 'none', lg: 'block' }
        }}
      >
        <m.div variants={varBounce().in}>
          <img src='/assets/images/home/about-us/foot.png' />
        </m.div>
      </Box>
    </m.div>
  );

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
        maxWidth: '1400px !important'
      }}
    >
      {content}
    </Container>
  );
}
