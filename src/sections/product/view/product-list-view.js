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
import { deleteProduct, deleteProducts, editProduct } from 'src/api/product';
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

  const titleFilterValue = searchParams.get('title');

  const tableFilters = [
    { type: 'search', name: 'title', placeholder: 'Търси по Заглавие', value: titleFilterValue },
    // { type: 'select', name: 'city', placeholder: 'Град', options: CITIES, value: cityFilterValue },
    // { type: 'date', name: 'date', placeholder: 'Дата', value: dateFilterValue }
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
    files: product.files,
    short_description: product.short_description,
    price: `${product.price} ${t('lv.', { ns: 'common' })}`,
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

  const handleEditActive = async (event, id) => {
    const data = new FormData();
    data.append('active', Number(event.target.checked));
    // :)
    // <3
    
    startTransition(async () => {
      try {
        await editProduct(id, data);

        enqueueSnackbar(t('edit-success', { ns: 'messages' }));
        router.refresh();
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    });
  }

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

  const TABLE_HEAD = [
    { id: 'title', type: 'text-with-image', label: t('title', { ns: 'forms' }), imageSelector: 'files' },
    { id: 'short_description', label: t('short_description', { ns: 'forms' }), width: 180 },
    { id: 'price', label: t('price', { ns: 'forms' }), width: 140 },
    { id: 'active', type: 'switch', label: t('active', { ns: 'forms' }), width: 100, handler: handleEditActive },
  ];

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('products', { ns: 'headers' })}
          links={[
            { name: t('dashboard', { ns: 'headers' }), href: paths.dashboard.root },
            { name: t('products', { ns: 'headers' }) }
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.product.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              color='secondary'
            >
              {t('new-product', { ns: 'ecommerce' })}
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
