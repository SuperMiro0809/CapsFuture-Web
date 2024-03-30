import { m } from 'framer-motion';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

import { bgBlur, bgGradient, textGradient } from 'src/theme/css';

import { varFade, MotionViewport } from 'src/components/animate';

import { useTranslate } from 'src/locales';

import AmbulanceIcon from 'public/assets/icons/achievements/ic_ambulance.svg';
import BabyIcon from 'public/assets/icons/achievements/ic_baby.svg';
import HeartIcon from 'public/assets/icons/achievements/ic_heart.svg';
import RecycleSignIcon from 'public/assets/icons/achievements/ic_recycle-sign.svg';

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

export default function HomeAchievements() {
  const { t } = useTranslate();

  const caps = [
    '/assets/images/home/achievements/bottle_cap_pink.svg',
    '/assets/images/home/achievements/bottle_cap_peach.svg',
    '/assets/images/home/achievements/bottle_cap_green.svg',
    '/assets/images/home/achievements/bottle_cap_purple.svg',
  ];

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
            {t('our-achievements', { ns: 'home' })}
          </StyledTextGradient>
        </m.div>
      </Stack>

      <Grid
        container
        spacing={10}
        sx={{
          justifyContent: 'center',
        }}
      >
        {caps.map((cap, index) => {
          let animation;

          switch (index) {
            case 0: animation = varFade().inLeft; break;
            case 1: animation = varFade().inUp; break;
            case 2: animation = varFade().inDown; break;
            case 3: animation = varFade().inRight; break;
          }

          return (
            <Grid
              item
              xs={12}
              sm={6}
              lg={3}
              sx={{
                mt: {
                  md: index % 2 == 0 ? 5 : 20
                }
              }}
              key={index}
            >
              <m.div
                variants={animation}
                style={{
                  backgroundImage: `url(${cap})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100%',
                  width: '100%',
                  aspectRatio: '4/5',
                  position: 'relative'
                }}
              >
                {index === 0 && (
                  <Stack
                    sx={{
                      alignItems: 'center',
                      position: 'relative',
                      top: '10%'
                    }}
                  >
                    <AmbulanceIcon />
                    <Typography component='div' variant='h2'>5</Typography>
                    <Typography component='div' variant='body1' sx={{ fontSize: '1.5rem' }}>{t('ambulances', { ns: 'common' })}</Typography>
                  </Stack>
                )}

                {index === 1 && (
                  <Stack
                    sx={{
                      alignItems: 'center',
                      position: 'relative',
                      top: '10%'
                    }}
                  >
                    <BabyIcon />
                    <Typography component='div' variant='h2'>22</Typography>
                    <Typography component='div' variant='body1' sx={{ fontSize: '1.5rem' }}>{t('incubators', { ns: 'common' })}</Typography>
                  </Stack>
                )}

                {index === 2 && (
                  <Stack
                    sx={{
                      alignItems: 'center',
                      position: 'relative',
                      top: '10%'
                    }}
                  >
                    <HeartIcon />
                    <Typography component='div' variant='h2'>100</Typography>
                    <Typography component='div' variant='body1' sx={{ fontSize: '1.5rem' }}>{t('children-lives', { ns: 'common' })}</Typography>
                  </Stack>
                )}

                {index === 3 && (
                  <Stack
                    sx={{
                      alignItems: 'center',
                      position: 'relative',
                      top: '10%'
                    }}
                  >
                    <RecycleSignIcon />
                    <Typography component='div' variant='h2'>1 {t('mil', { ns: 'common' })}</Typography>
                    <Typography component='div' variant='body1' sx={{ fontSize: '1.5rem' }}>{t('plastic', { ns: 'common' })}</Typography>
                  </Stack>
                )}
              </m.div>
            </Grid>
          )
        })}
      </Grid>

    </Container>
  );
}

