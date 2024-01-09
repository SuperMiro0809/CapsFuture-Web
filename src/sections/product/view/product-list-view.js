'use client';

import isEqual from 'lodash/isEqual';
import { useState, useEffect, useTransition } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// api
import { deleteProduct, deleteProducts } from 'src/api/product';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useTable } from 'src/components/table';
import TableBuilder from 'src/components/table-builder';
import { useSnackbar } from 'src/components/snackbar';
// locales
import { useTranslate } from 'src/locales';
// utils
import { makeQuery } from 'src/utils/url-query';

export default function ProductListView({ products = [], productsCount = 0 }) {
  const { t } = useTranslate();

  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const [isPending, startTransition] = useTransition();

  const tableFilters = [

  ];

  let defaultCurrentPage = 0;
  if (Number(searchParams.get('page'))) {
    defaultCurrentPage = Number(searchParams.get('page')) === 0 ? Number(searchParams.get('page')) : Number(searchParams.get('page')) - 1;
  }

  const defaultRowsPerPage = Number(searchParams.get('limit')) || 5;
  const defaultOrderBy = searchParams.get('orderBy') || 'title';
  const defaultOrder = searchParams.get('direction') || 'asc';

  const table = useTable({
    filters: tableFilters,
    defaultCurrentPage,
    defaultRowsPerPage,
    defaultOrderBy,
    defaultOrder
  });

  const productsList = products.map((product) => ({
    id: product.id,
    title: product.title,
    title_image_path: product.files[0].filepath,
    short_description: product.short_description,
    price: `${product.price} ${t('lv.')}`,
    active: product.active
  }));

  useEffect(() => {
    const pagination = {
      page: table.page + 1,
      limit: table.rowsPerPage
    }

    const order = {
      orderBy: table.orderBy,
      direction: table.order
    }

    const query = makeQuery(searchParams, pagination, order, table.filters);

    router.push(`${pathname}${query}`);
  }, [pathname, router, searchParams, table.page, table.rowsPerPage, table.orderBy, table.order, table.filters])

  const TABLE_HEAD = [
    { id: 'title', type: 'text-with-image', label: t('title'), imageSelector: 'title_image_path' },
    { id: 'short_description', label: t('short_description'), width: 180 },
    { id: 'price', label: t('price'), width: 140 },
    { id: 'active', label: t('active'), width: 110 },
  ];

  const handleDelete = async (ids) => {
    startTransition(async () => {
      try {
        if (ids.length === 1) {
          const id = ids[0];

          await deleteProduct(id);
        } else {
          await deleteProducts(ids);
        }

        enqueueSnackbar(t('delete-success'));
        router.refresh();
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    });
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('products')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            { name: t('products') }
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.product.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              color='secondary'
            >
              {t('new-product')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <TableBuilder
            table={table}
            tableHead={TABLE_HEAD}
            tableData={productsList}
            tableTotal={productsCount}
            tableFilters={tableFilters}
            deleteHandler={handleDelete}
          />
        </Card>
      </Container>
    </>
  );
}
