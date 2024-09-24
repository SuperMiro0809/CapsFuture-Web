'use client';

import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { useState, useCallback, useTransition } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import LoadingButton from '@mui/lab/LoadingButton';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// api
import { deleteProduct, deleteProducts, editProduct } from 'src/api/product';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
// locales
import { useTranslate } from 'src/locales';
//
import ProductTableRow from '../product-table-row';
import ProductTableToolbar from '../product-table-toolbar';
import ProductTableFiltersResult from '../product-table-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  active: [],
  showOnHome: []
}

// ----------------------------------------------------------------------

export default function ProductListView({ products = [] }) {
  const { t } = useTranslate();

  const table = useTable({
    defaultRowsPerPage: 10,
    defaultOrderBy: 'title'
  });

  const [filters, setFilters] = useState(defaultFilters);

  const [isDeletePending, startDeleteTransition] = useTransition();

  const [isPending, startTransition] = useTransition();

  const dataFiltered = applyFilter({
    inputData: products,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const router = useRouter();

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const TABLE_HEAD = [
    { id: 'title', label: t('title', { ns: 'forms' }) },
    { id: 'short_description', label: t('short_description', { ns: 'forms' }), width: 580 },
    { id: 'price', label: t('price', { ns: 'forms' }), width: 140 },
    { id: 'active', label: t('active', { ns: 'forms' }), width: 100, sort: false },
    { id: 'show_on_home_page', label: t('show-on-home-page', { ns: 'forms' }), width: 180, sort: false },
    { id: '', width: 88 },
  ];

  const ACTIVE_OPTIONS = [
    { label: t('active', { ns: 'common' }), value: 1 },
    { label: t('inactive', { ns: 'common' }), value: 0 }
  ];

  const SHOW_ON_HOME_OPTIONS = [
    { label: t('shown', { ns: 'common' }), value: 1 },
    { label: t('not-shown', { ns: 'common' }), value: 0 }
  ];

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

  const handleEditShowOnHome = async (event, id) => {
    const data = new FormData();
    data.append('show_on_home_page', Number(event.target.checked));
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
    startDeleteTransition(async () => {
      try {
        if (ids.length === 1) {
          const id = ids[0];

          await deleteProduct(id);
        } else {
          await deleteProducts(ids);
        }

        enqueueSnackbar(t('delete-success', { ns: 'messages' }));
        router.refresh();
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    });
  }

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

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
          <ProductTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            activeOptions={ACTIVE_OPTIONS}
            showOnHomeOptions={SHOW_ON_HOME_OPTIONS}
          />

          {canReset && (
            <ProductTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              activeOptions={ACTIVE_OPTIONS}
              showOnHomeOptions={SHOW_ON_HOME_OPTIONS}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title={t('delete.action', { ns: 'common' })}>
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <ProductTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        deleteLoading={isDeletePending}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDelete([row.id])}
                        onEditRow={() => router.push(paths.dashboard.product.edit(row.id))}
                        onViewRow={() => router.push(paths.dashboard.product.details(row.id))}
                        onEditActive={handleEditActive}
                        onEditShowOnHome={handleEditShowOnHome}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('delete.word', { ns: 'common' })}
        content={
          <>
            {table.selected.length > 1 ?
              <>
                {t('delete.multiple-modal', { ns: 'common' })} <strong> {table.selected.length} </strong> {t('items', { ns: 'common' })}?
              </> :
              <>
                {t('delete.single-modal', { ns: 'common' })}
              </>
            }
          </>
        }
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={() => {
              handleDelete(table.selected);
              confirm.onFalse();
            }}
            loading={isDeletePending}
          >
            {t('delete.action', { ns: 'common' })}
          </LoadingButton>
        }
      />
    </>
  );
}

ProductListView.propTypes = {
  products: PropTypes.array
};

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, active, showOnHome } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (product) => product.title.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        product.short_description.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (active.length > 0) {
    inputData = inputData.filter((product) => active.includes(product.active));
  }

  if (showOnHome.length > 0) {
    inputData = inputData.filter((product) => showOnHome.includes(product.show_on_home_page));
  }

  return inputData;
}
