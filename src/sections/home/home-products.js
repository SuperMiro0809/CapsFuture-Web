import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { textGradient } from 'src/theme/css';

import { varFade, MotionViewport } from 'src/components/animate';

import { ProductCard } from 'src/components/products';

import { RouterLink } from 'src/routes/components';

import { _mock } from 'src/_mock';

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

export default function HomeProducts({ products }) {
  const values = [
    ...products,
    ...products,
    ...products,
    ...products,
  ];

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
            Нашите продукти
          </StyledTextGradient>
        </m.div>
      </Stack>

      <Grid container spacing={5}>
        {values.map((product, index) => (
          <Grid item md={6} lg={3} sx={{ width: '100%' }} key={index}>
            <m.div variants={varFade().inUp} key={'test'} style={{ width: '100%' }}>
              <ProductCard
                title={product.title}
                price={product.price}
                images={product.files}
                imageSrc='https://images.prismic.io/carwow/65cbb34b-b61c-48af-b34e-5bd785e95a28_2023+Porsche+911+front+quarter+moving.jpg?fit=clip&q=60&w=750&cs=tinysrgb&auto=format'
              />
            </m.div>
          </Grid>
        ))}
      </Grid>


      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <m.div variants={varFade().in}>
          <Button
            component={RouterLink}
            href='/products'
            variant='outlined'
            color='primary'
            sx={{ fontSize: 16 }}
          >
            Виж повече
          </Button>
        </m.div>
      </Box>
    </Container>
  );
}
