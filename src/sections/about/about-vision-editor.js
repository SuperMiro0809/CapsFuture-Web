import { m } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, styled, useTheme } from '@mui/material/styles';
// locales
import { useTranslate } from 'src/locales';
// theme
import { textGradient } from 'src/theme/css';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';
//
import AboutContentEditFab from './about-content-edit-fab';

// ----------------------------------------------------------------------

const StyledTextGradient = styled(m.h3)(({ theme }) => ({
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
  fontSize: `${48 / 16}rem`,
  fontFamily: theme.typography.fontSecondaryFamily,
  [theme.breakpoints.up('md')]: {
    fontSize: `${48 / 16}rem`,
  },
}));

// ----------------------------------------------------------------------

export default function AboutVisionEditor() {
  const { t } = useTranslate();

  const theme = useTheme();

  const renderImg = (
    <Image
      src="/assets/images/about/2.jpeg"
      alt="about-vision"
      overlay={alpha(theme.palette.grey[900], 0.48)}
    />
  );

  return (
    <Box
      sx={{
        pb: 10,
        position: 'relative',
        bgcolor: 'primary.lighter',
        '&:before': {
          top: 0,
          left: 0,
          width: 1,
          content: "''",
          position: 'absolute',
          height: { xs: 80, md: 120 },
          bgcolor: 'background.default',
        },
      }}
    >
      <Container component={MotionViewport}>
        <Box
          sx={{
            mb: 10,
            borderRadius: 2,
            display: 'flex',
            // overflow: 'hidden',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ position: 'relative' }}>
            {renderImg}

            <AboutContentEditFab />
          </Box>
        </Box>

        <m.div variants={varFade().inUp} style={{ position: 'relative' }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              overflow: 'hidden',
              border: (theme) => `dashed 1px ${theme.palette.grey[400]}`
            }}
          >
            <StyledTextGradient>
              {t('help-too', { ns: 'home' })}!
            </StyledTextGradient>
          </Box>

          <AboutContentEditFab />
        </m.div>
      </Container>
    </Box>
  );
}
