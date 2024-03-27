import { m } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
// locales
import { useTranslate } from 'src/locales';
// theme
import { textGradient } from 'src/theme/css';
// component
import { varFade, MotionViewport } from 'src/components/animate';
import { ProductCard } from 'src/components/products';
import { RouterLink } from 'src/routes/components';
//
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
  const { t } = useTranslate();

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
            {t('our-products')}
          </StyledTextGradient>
        </m.div>
      </Stack>

      <Grid container spacing={5} justifyContent='center'>
        {products.map((product, index) => (
          <Grid md={6} lg={3} sx={{ width: '100%' }} key={index}>
            <m.div variants={varFade().inUp} key={'test'} style={{ width: '100%' }}>
              <ProductCard
                id={product.id}
                slug={product.slug}
                title={product.title}
                price={product.price}
                images={product.files}
              />
            </m.div>
          </Grid>
        ))}
      </Grid>


      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <m.div variants={varFade().in}>
          <Button
            component={RouterLink}
            href='/store'
            variant='outlined'
            color='primary'
            sx={{ fontSize: 16 }}
          >
            {t('see-more', { ns: 'common' })}
          </Button>
        </m.div>
      </Box>
    </Container>
  );
}
