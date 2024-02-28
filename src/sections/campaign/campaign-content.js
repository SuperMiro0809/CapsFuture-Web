import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
// date-fns
import { format, parseISO } from 'date-fns';
// locales
import { useTranslate } from 'src/locales';
// routes
import { useRouter, useSearchParams, usePathname } from 'src/routes/hooks';
// components
import Label from 'src/components/label';
import { CampaignCard } from 'src/components/campaigns';
import { ASSETS } from 'src/config-global';
import Iconify from 'src/components/iconify';
// utils
import { makeQuery } from 'src/utils/url-query';
//
import CITIES from 'src/data/cities';

// ----------------------------------------------------------------------

const defaultFilters = {
  search: '',
  city: null,
  active: 'all'
};

// ----------------------------------------------------------------------

export default function CampaignContent({ campaigns, campaignsCount }) {
  const { t } = useTranslate();

  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const pageLength = Math.ceil(campaignsCount / 8);

  const activeFilterOptions = ['all', 'upcoming', 'past'];

  defaultFilters.search = searchParams.get('search') || '';
  defaultFilters.city = searchParams.get('city') || null;
  defaultFilters.active = searchParams.get('active') || activeFilterOptions[0];

  let defaultPage = searchParams.get('page');

  if(!isNaN(defaultPage)) {
    defaultPage = Number(defaultPage) > pageLength ? pageLength : Number(defaultPage);
  } else {
    defaultPage = 1;
  }

  const [page, setPage] = useState(defaultPage);

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
          spacing={1}
          sx={{
            mb: { xs: 1, md: 2 },
          }}
        >
          <TextField
            fullWidth
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

          <Autocomplete
            fullWidth
            value={filters.city}
            placeholder={t('city')}
            options={CITIES}
            onChange={(_, newValue) => handleFilters('city', newValue)}
            isOptionEqualToValue={(option, value) => option === value}
            renderOption={(props, option) => (
              <li {...props} key={option?.value || option}>
                {option?.label || option}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                placeholder={t('city')}
                {...params}
              />
            )}
          />
        </Stack>

        <Tabs
          value={filters.active}
          onChange={(_, newValue) => handleFilters('active', newValue)}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {activeFilterOptions.map((tab) => (
            <Tab
              key={tab}
              iconPosition="end"
              value={tab}
              label={t(tab)}
              icon={
                <Label
                  variant={((tab === 'all' || tab === filters.active) && 'filled') || 'soft'}
                  color={(tab === 'upcoming' && 'primary') || (tab === 'past' && 'secondary') || 'default'}
                >
                  {tab === 'all' && <Iconify icon="material-symbols:done-all" sx={{ color: 'inherit' }} />}

                  {tab === 'upcoming' && <Iconify icon="material-symbols:event-upcoming-outline" sx={{ color: 'inherit' }} />}

                  {tab === 'past' && <Iconify icon="wpf:past" sx={{ color: 'inherit' }} />}
                </Label>
              }
              sx={{ textTransform: 'capitalize' }}
            />
          ))}
        </Tabs>

        <Grid container spacing={2} rowSpacing={4}>
          {campaigns.map((campaign) => (
            <Grid xs={12} md={6} lg={4} key={campaign.id}>
              <CampaignCard
                id={campaign.id}
                slug={campaign.id}
                title={campaign.title}
                shortDescription={campaign.short_description}
                date={format(parseISO(campaign.date), 'dd.MM.yyyy')}
                cities={campaign.cities}
                imageSrc={`${ASSETS}/${campaign.title_image_path}`}
                attendances={campaign.attendances}
              />
            </Grid>
          ))}
        </Grid>

        {campaignsCount > 8 && (
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

CampaignContent.propTypes = {
  campaigns: PropTypes.array,
  campaignsCount: PropTypes.number
};
