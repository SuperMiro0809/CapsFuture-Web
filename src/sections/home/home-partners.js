import { m } from 'framer-motion';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha, styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { bgGradient, textGradient } from 'src/theme/css';

import { varFade, MotionViewport } from 'src/components/animate';

import Carousel, { useCarousel } from 'src/components/carousel';

export default function HomePartners() {

  const carousel = useCarousel({
    autoplay: true,
    autoplaySpeed: 4000,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    speed: 2000,
    cssEase: "linear"
  });

  return (
    <Box
      sx={(theme) => ({
        ...bgGradient({
          startColor: `${theme.palette.secondary.lighter} 0%`,
          endColor: `${alpha(theme.palette.background.pink, 0)} 70%`,
        }),
      })}
    >
      <Container
        component={MotionViewport}
        sx={{
          py: 10,
          maxWidth: '1400px !important'
        }}
      >
        <Stack
          spacing={3}
          sx={{
            textAlign: 'center',
            mb: { xs: 5, md: 10 },
          }}
        >
          <m.div variants={varFade().inUp}>
            <Typography variant='h2' sx={{ mb: 8 }}>
              Партньори
            </Typography>
            
            <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
              {[...Array(10).keys()].map((campaign) => (
                <Paper sx={{ backgroundColor: 'transparent' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1
                    }}
                  >
                    <img width='100' src='https://upload.wikimedia.org/wikipedia/commons/1/1d/Lidl_logo.png' />
                    <Typography component='div' variant='h5'>Lidl</Typography>
                  </Box>
                </Paper>
              ))}
            </Carousel>
          </m.div>
        </Stack>
      </Container>
    </Box>
  );
}
