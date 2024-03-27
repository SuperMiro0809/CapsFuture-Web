'use client';

import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';
// locales
import { useTranslate } from 'src/locales';
// utils
import { makeQuery } from 'src/utils/url-query';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import PostSort from '../post-sort';
import PostListHorizontal from '../post-list-horizontal';

// ----------------------------------------------------------------------

const defaultFilters = {
  active: 'all',
};

// ----------------------------------------------------------------------

export default function PostListView({ posts, postsCount }) {
  const { t } = useTranslate();

  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const settings = useSettingsContext();

  let defaultPageValue = 1;
  if(Number(searchParams.get('page'))) {
    defaultPageValue = Number(searchParams.get('page')) <= 0 ? 1 : Number(searchParams.get('page'));
  }

  const [page, setPage] = useState(defaultPageValue);

  const perPage = 8;

  const sortByDefaultValue = searchParams.get('direction') === 'desc' ? 'oldest' : 'latest';
  const [sortBy, setSortBy] = useState(sortByDefaultValue);

  const [filters, setFilters] = useState(defaultFilters);

  const searchValueFilterValue = searchParams.get('title');
  const [searchValue, setSearchValue] = useState(searchValueFilterValue);

  const dataFiltered = applyFilter({
    inputData: posts,
    filters,
  });

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSearch = useCallback((inputValue) => {
    setSearchValue(inputValue);
  }, []);

  const handleFilterPublish = useCallback(
    (event, newValue) => {
      handleFilters('active', newValue);
    },
    [handleFilters]
  );

  useEffect(() => {
    const pagination = {
      page: page,
      limit: perPage
    };

    const order = {
      orderBy: 'created_at',
      direction: sortBy === 'latest' ? 'asc' : 'desc'
    };

    const filters = [{ id: 'title', value: searchValue }];

    const query = makeQuery(searchParams, pagination, order, filters);

    router.push(`${pathname}${query}`);
  }, [page, sortBy, searchValue]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('posts', { ns: 'headers' })}
        links={[
          {
            name: t('dashboard', { ns: 'headers' }),
            href: paths.dashboard.root,
          },
          {
            name: t('posts', { ns: 'headers' })
          }
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.post.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            color='secondary'
          >
            {t('new-post')}
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >

        <TextField
          value={searchValue}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder={t('search', { ns: 'common' })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <PostSort sort={sortBy} onSort={handleSortBy} sortOptions={[
          { value: 'latest', label: t('latest', { ns: 'common' }) },
          { value: 'oldest', label: t('oldest', { ns: 'common' }) },
        ]} />
      </Stack>

      <Tabs
        value={filters.active}
        onChange={handleFilterPublish}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {['all', 'published', 'draft'].map((tab) => (
          <Tab
            key={tab}
            iconPosition="end"
            value={tab}
            label={t(tab)}
            icon={
              <Label
                variant={((tab === 'all' || tab === filters.publish) && 'filled') || 'soft'}
                color={(tab === 'published' && 'primary') || (tab === 'draft' && 'secondary') || 'default'}
              >
                {tab === 'all' && posts.length}

                {tab === 'published' && posts.filter((post) => post.active).length}

                {tab === 'draft' && posts.filter((post) => !post.active).length}
              </Label>
            }
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </Tabs>

      <PostListHorizontal
        posts={dataFiltered}
        postsCount={postsCount}
        page={page}
        handlePageChange={handlePageChange}
        perPage={perPage}
        loading={false}
      />
    </Container>
  );
}

PostListView.propTypes = {
  posts: PropTypes.array,
  postsCount: PropTypes.number
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, filters }) => {
  const { active } = filters;

  if (active !== 'all') {
    inputData = inputData.filter((post) => post.active === (active === 'published' ? 1 : 0));
  }

  return inputData;
};
