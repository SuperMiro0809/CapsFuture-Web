import { m } from 'framer-motion';
import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// locales
import { useTranslate } from 'src/locales';
// components
import { varFade, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function MapHomeHero() {
  const { t } = useTranslate();

  return (
    <Box
      sx={{
        height: { md: 560 },
        py: { xs: 10, md: 0 },
        overflow: 'hidden',
        position: 'relative',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        backgroundImage:
          'url(/assets/background/overlay_9.svg), url(/assets/images/map/hero.webp)',
      }}
    >
      <Container
        component={MotionContainer}
        sx={{
          py: { xs: 10, md: 15 },
          maxWidth: '1400px !important'
        }}
      >
        <Box
          sx={{
            bottom: { md: 80 },
            position: { md: 'absolute' },
            textAlign: {
              xs: 'center',
              md: 'unset',
            },
          }}
        >
          <TextAnimate text={t('map')} variants={varFade().inRight} sx={{ color: 'primary.main' }} />

          <br />

          {/* <Stack spacing={2} display="inline-flex" direction="row" sx={{ color: 'common.white' }}>
            <TextAnimate text="we" />
            <TextAnimate text="are?" />
          </Stack> */}

          <m.div variants={varFade().inRight}>
            <Typography
              variant="h4"
              sx={{
                mt: 3,
                // color: 'common.white',
                fontWeight: 'fontWeightSemiBold',
              }}
            >
              {/* {t('map-hero-text')} */}
              {/* Let&apos;s work together and
              <br /> make awesome site easily */}
            </Typography>
          </m.div>
        </Box>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

function TextAnimate({ text, variants, sx, ...other }) {
  return (
    <Box
      component={m.div}
      sx={{
        typography: 'h1',
        overflow: 'hidden',
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      {text.split('').map((letter, index) => (
        <m.span key={index} variants={variants || varFade().inUp}>
          {letter}
        </m.span>
      ))}
    </Box>
  );
}

TextAnimate.propTypes = {
  sx: PropTypes.object,
  text: PropTypes.string,
  variants: PropTypes.object,
};
