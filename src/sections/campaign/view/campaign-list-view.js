'use client';

import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { useState, useCallback, useTransition } from 'react';
// @mui
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
// api
import { deleteCampaign, deleteCampaigns } from 'src/api/campaign';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// locales
import { useTranslate, useLocales } from 'src/locales';
// utils
import { fTimestamp } from 'src/utils/format-time';
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
//
import CampaignTableRow from '../campaign-table-row';
import CampaignTableToolbar from '../campaign-table-toolbar';
import CampaignFiltersResult from '../campaign-table-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  title: '',
  startDate: null,
  endDate: null
}

// ----------------------------------------------------------------------

export default function CampaignListView({ campaigns = [] }) {
  const { t } = useTranslate();

  const { currentLang } = useLocales();

  const campaignsList = campaigns.map((campaign) => ({
    ...campaign,
    address: (currentLang.value === 'bg' ? campaign.location?.address_bg : campaign.location?.address_en) || '-'
  }));

  const table = useTable({
    defaultRowsPerPage: 10,
    defaultOrderBy: 'title'
  });

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: campaignsList,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError
  });

  const router = useRouter();

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const [isDeletePending, startDeleteTransition] = useTransition();

  const TABLE_HEAD = [
    { id: 'title', type: 'text-with-image', label: t('title', { ns: 'forms' }), imageSelector: 'title_image_path' },
    { id: 'short_description', label: t('short_description', { ns: 'forms' }), width: 480 },
    { id: 'address', label: t('address', { ns: 'location' }), width: 400 },
    { id: 'date', label: t('date', { ns: 'forms' }), width: 180 },
    { id: '', width: 88 },
  ];

  const handleDelete = async (ids) => {
    startDeleteTransition(async () => {
      try {
        if (ids.length === 1) {
          const id = ids[0];

          await deleteCampaign(id);
        } else {
          await deleteCampaigns(ids);
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
          heading={t('campaigns', { ns: 'headers' })}
          links={[
            { name: t('dashboard', { ns: 'headers' }), href: paths.dashboard.root },
            { name: t('campaigns', { ns: 'headers' }) }
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.campaign.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              color='secondary'
            >
              {t('new', { ns: 'campaign' })}
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <CampaignTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            dateError={dateError}
          />

          {canReset && (
            <CampaignFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              //
              totalResults={dataFiltered.length}
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
                      <CampaignTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDelete([row.id])}
                        onEditRow={() => router.push(paths.dashboard.campaign.edit(row.id))}
                        onOpenParticipations={() => router.push(paths.dashboard.campaign.participations(row.id))}
                        onViewRow={() => router.push(paths.dashboard.campaign.details(row.id))}
                        deleteLoading={isDeletePending}
                      />
                    ))
                  }
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

CampaignListView.propTypes = {
  campaigns: PropTypes.array
};

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { title, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (title) {
    inputData = inputData.filter(
      (campaign) => campaign.title.toLowerCase().indexOf(title.toLowerCase()) !== -1 ||
        campaign.short_description.toLowerCase().indexOf(title.toLowerCase()) !== -1 ||
        campaign.address.toLowerCase().indexOf(title.toLowerCase()) !== -1
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (campaign) =>
          fTimestamp(campaign.date) >= fTimestamp(startDate) &&
          fTimestamp(campaign.date) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
