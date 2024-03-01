import { m } from 'framer-motion';
// @mui
import Fab from '@mui/material/Fab';
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

export default function AboutVision() {
  const { t } = useTranslate();

  const theme = useTheme();

  const renderImg = (
    <Image
      src="/assets/images/about/2.jpeg"
      alt="about-vision"
      overlay={alpha(theme.palette.grey[900], 0.48)}
    />
  );

  // const renderLogo = (
  //   <Stack
  //     direction="row"
  //     flexWrap="wrap"
  //     alignItems="center"
  //     justifyContent="center"
  //     sx={{
  //       width: 1,
  //       zIndex: 9,
  //       bottom: 0,
  //       opacity: 0.48,
  //       position: 'absolute',
  //       py: { xs: 1.5, md: 2.5 },
  //     }}
  //   >
  //     {['ibm', 'lya', 'spotify', 'netflix', 'hbo', 'amazon'].map((logo) => (
  //       <Box
  //         component={m.img}
  //         key={logo}
  //         variants={varFade().in}
  //         alt={logo}
  //         src={`/assets/icons/brands/ic_brand_${logo}.svg`}
  //         sx={{
  //           m: { xs: 1.5, md: 2.5 },
  //           height: { xs: 20, md: 32 },
  //         }}
  //       />
  //     ))}
  //   </Stack>
  // );

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
            overflow: 'hidden',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderImg}

          {/* {renderLogo} */}

          {/* <Fab sx={{ position: 'absolute', zIndex: 9 }}>
            <Iconify icon="solar:play-broken" width={24} />
          </Fab> */}
        </Box>

        <m.div variants={varFade().inUp}>
          <StyledTextGradient>
            {t('help-too')}!
          </StyledTextGradient>
        </m.div>
      </Container>
    </Box>
  );
}
