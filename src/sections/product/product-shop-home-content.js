import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
// date-fns
import { format, parseISO } from 'date-fns';
// locales
import { useTranslate } from 'src/locales';
// routes
import { useRouter, useSearchParams, usePathname } from 'src/routes/hooks';
// components
import { ASSETS } from 'src/config-global';
import Iconify from 'src/components/iconify';
// utils
import { makeQuery } from 'src/utils/url-query';
// components
import { ProductCard } from 'src/components/products';
//
import ProductSort from './product-sort';

// ----------------------------------------------------------------------

const defaultFilters = {
  search: '',
  sort: ''
};

// ----------------------------------------------------------------------

export default function StoreHomeContent({ products, productsCount }) {
  const { t } = useTranslate();

  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const pageLength = Math.ceil(productsCount / 8);

  let defaultPage = searchParams.get('page');

  if (!isNaN(defaultPage)) {
    defaultPage = Number(defaultPage) > pageLength ? pageLength : Number(defaultPage);
  } else {
    defaultPage = 1;
  }

  const [page, setPage] = useState(defaultPage);

  const orderOptions = [{ value: 'asc', label: t('cheapest') }, { value: 'desc', label: t('most-expensive') }];

  defaultFilters.search = searchParams.get('search') || '';

  defaultFilters.sort = orderOptions.find((x) => x.value === searchParams.get('sort') || '')?.value || orderOptions[0].value;

  const [filters, setFilters] = useState(defaultFilters);

  const handleFilters = (name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  useEffect(() => {
    const pagination = {
      page,
      limit: 8
    };

    const filtersData = Object.keys(filters).map((key) => ({ id: key, value: filters[key] }));
    const query = makeQuery(searchParams, pagination, {}, filtersData);

    router.push(`${pathname}${query}`, { scroll: false });
  }, [pathname, router, searchParams, page, filters])

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.pink
      }}
    >
      <Container
        sx={{
          py: { xs: 10, md: 10 },
          maxWidth: '1400px !important'
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems='center'
          spacing={1}
          sx={{
            mb: { xs: 5, md: 6 },
          }}
        >
          <TextField
            sx={{ flexGrow: 1 }}
            value={filters.search}
            onChange={(event) => handleFilters('search', event.target.value)}
            placeholder={`${t('search')}...`}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
            <ProductSort
              sort={filters.sort}
              onSort={(value) => handleFilters('sort', value)}
              sortOptions={orderOptions}
            />
          </Box>
        </Stack>

        <Grid container spacing={2} rowSpacing={4}>
          {products.map((product) => (
            <Grid xs={12} md={6} lg={4} key={product.id}>
              <ProductCard
                id={product.slug}
                slug={product.slug}
                title={product.title}
                price={product.price}
                images={product.files}
              />
            </Grid>
          ))}
        </Grid>

        {productsCount > 8 && (
          <Pagination
            page={page}
            onChange={(_, value) => setPage(value)}
            count={pageLength}
            color='primary'
            sx={{
              mt: 8,
              [`& .${paginationClasses.ul}`]: {
                justifyContent: 'center',
              },
            }}
          />
        )}
      </Container>
    </Box>
  );
}

StoreHomeContent.propTypes = {
  products: PropTypes.array,
  productsCount: PropTypes.number
};
