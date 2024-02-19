import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Mail';
import TextField from '@mui/material/TextField';

import { textGradient } from 'src/theme/css';

import { varFade, varBounce, MotionViewport } from 'src/components/animate';

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

export default function HomeContacts() {
  const { t } = useTranslate();

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
            {t('contact-us')}
          </StyledTextGradient>
        </m.div>
      </Stack>

      <Grid container spacing={8} justifyContent='space-between' alignItems='center'>
        <Grid xs={12} md={6}>
          <m.div variants={varFade().inLeft}>
            <Stack spacing={3}>
              <Typography variant='h4'>Ще се радваме да се чуем с вас!</Typography>
              <Typography variant='body1'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <PhoneIcon color='primary' />
                <Typography variant='body1'>087 600 4708</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <MailIcon color='primary' />
                <Typography variant='body1'>kapachkibg@gmail.com</Typography>
              </Box>
            </Stack>
          </m.div>
        </Grid>
        <Grid xs={12} md={6}>
          <m.div variants={varFade().inRight}>
            <Stack spacing={3}>
              <TextField
                name='email'
                label={t('email')}
                fullWidth
              />
              <TextField
                name='message'
                label={t('message')}
                rows={3}
                fullWidth
                multiline
              />
              <Button
                color='secondary'
                variant='contained'
              >
                Изпрати
              </Button>
            </Stack>
          </m.div>
        </Grid>
      </Grid>
    </Container>
  );
}

