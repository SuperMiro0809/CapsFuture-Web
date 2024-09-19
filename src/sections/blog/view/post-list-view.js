'use client';

import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
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
// locales
import { useTranslate } from 'src/locales';
// utils
import { orderBy } from 'src/utils/helper';
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
  search: ''
};

const defaultSortBy = 'latest';

// ----------------------------------------------------------------------

export default function PostListView({ posts }) {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const [page, setPage] = useState(1);

  const perPage = 8;

  const [sortBy, setSortBy] = useState(defaultSortBy);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: posts,
    filters,
    sortBy
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

  const handleSearch = useCallback(
    (inputValue) => {
      handleFilters('search', inputValue);
    },
    [handleFilters]
  );

  const handleFilterPublish = useCallback(
    (event, newValue) => {
      handleFilters('active', newValue);
    },
    [handleFilters]
  );

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
            {t('new', { ns: 'post' })}
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
          value={filters.search}
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
            label={t(tab, { ns: 'common' })}
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
        posts={
          dataFiltered.slice(
            (page - 1) * perPage,
            (page - 1) * perPage + perPage
          )
        }
        postsCount={posts.length}
        page={page}
        handlePageChange={handlePageChange}
        perPage={perPage}
        loading={false}
      />
    </Container>
  );
}

PostListView.propTypes = {
  posts: PropTypes.array
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, filters, sortBy }) => {
  const { active, search } = filters;

  if (sortBy === 'latest') {
    inputData = orderBy(inputData, ['created_at'], ['desc']);
  }

  if (sortBy === 'oldest') {
    inputData = orderBy(inputData, ['created_at'], ['asc']);
  }

  if (active !== 'all') {
    inputData = inputData.filter((post) => post.active === (active === 'published' ? 1 : 0));
  }

  if (search) {
    inputData = inputData.filter(
      (post) =>
        post.title.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
        post.short_description.toLowerCase().indexOf(search.toLowerCase()) !== -1
    );
  }

  return inputData;
};
