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
import Image from 'src/components/image';

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

  const partners = [
    {
      logo: 'https://mfd.jabulgaria.org/wp-content/uploads/wpjobboard/company/99/company-logo/econt_logo.png',
      name: ''
    },
    {
      logo: 'https://worktalent.com/web/uploads/site_users_company/7/logo/thumb_314x132_Lidl_Logo_Basis.png',
      name: ''
    },
    {
      logo: 'https://karchershop.bg/wp-content/uploads/2019/11/logo_karcher_2015.svg',
      name: ''
    },
    {
      logo: 'https://mfd.jabulgaria.org/wp-content/uploads/wpjobboard/company/99/company-logo/econt_logo.png',
      name: ''
    },
    {
      logo: 'https://mfd.jabulgaria.org/wp-content/uploads/wpjobboard/company/99/company-logo/econt_logo.png',
      name: ''
    },

  ]

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
              {partners.map((partner, index) => (
                <Paper sx={{ backgroundColor: 'transparent' }} key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1
                    }}
                  >
                    <Image sx={{ width: '100px' }} src={partner.logo} /> 
                    <Typography component='div' variant='h5'>{partner.name}</Typography>
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
