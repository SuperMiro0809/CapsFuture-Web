'use client';

import { useState, useCallback, useTransition } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// locales
import { useTranslate } from 'src/locales';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// api
import { deleteAttendance, deleteAttendances } from 'src/api/campaign-attendances';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';
//
import CampaignParticipationsTableRow from '../campaign-participations-table-row';
import CampaignParticipationsTableToolbar from '../campaign-participations-table-toolbar';
import OrderTableFiltersResult from '../campaign-participations-table-filter-results';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'all' }, { value: 'registered', label: 'registered' }, { value: 'guests', label: 'guests' }];

const defaultFilters = {
  name: '',
  status: 'all'
};

// ----------------------------------------------------------------------

export default function CampaignParticipationsListView({ participations, campaign }) {
  const { t } = useTranslate();

  const TABLE_HEAD = [
    { id: 'name', label: t('user', { ns: 'forms' }) },
    { id: 'createdAt', label: t('phone', { ns: 'forms' }) },
    { id: 'status', label: t('type', { ns: 'forms' }), width: 110 },
    { id: '', width: 88 },
  ];

  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  // const [tableData, setTableData] = useState(participations);

  const [filters, setFilters] = useState(defaultFilters);

  const [isPending, startTransition] = useTransition();

  const { enqueueSnackbar } = useSnackbar();

  const dataFiltered = applyFilter({
    inputData: participations,
    comparator: getComparator(table.order, table.orderBy),
    filters
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.name || filters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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

  const handleDeleteRow = useCallback(
    (id) => {
      startTransition(async () => {
        try {
          const { error } = await deleteAttendance(id);

          if (error) throw error;

          enqueueSnackbar(t('delete-success'));
          router.refresh();

          table.onUpdatePageDeleteRow(dataInPage.length)
        } catch (error) {
          enqueueSnackbar(error, { variant: 'error' })
        }
      });
    },
    []
  );

  const handleDeleteRows = () => {
    startTransition(async () => {
      try {
        const { error } = await deleteAttendances(table.selected);

        if (error) throw error;

        enqueueSnackbar(t('delete-success'));
        router.refresh();

        table.onUpdatePageDeleteRows({
          totalRows: participations.length,
          totalRowsInPage: dataInPage.length,
          totalRowsFiltered: dataFiltered.length,
        });
      } catch (error) {
        enqueueSnackbar(error, { variant: 'error' })
      }
    });
  }

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('participations')}
          links={[
            {
              name: t('dashboard', { ns: 'headers' }),
              href: paths.dashboard.root,
            },
            {
              name: t('campaigns', { ns: 'headers' }),
              href: paths.dashboard.campaign.root,
            },
            {
              name: campaign.title,
              href: paths.dashboard.campaign.edit(campaign.id)
            },
            { name: t('participations') },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={t(tab.label)}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'registered' && 'primary') ||
                      (tab.value === 'guests' && 'secondary') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && participations.length}
                    {tab.value === 'registered' &&
                      participations.filter((participation) => participation.user).length}

                    {tab.value === 'guests' &&
                      participations.filter((participation) => !participation.user).length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <CampaignParticipationsTableToolbar
            participations={participations}
            //
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
          />

          {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={participations.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  participations.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
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
                  rowCount={participations.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      participations.map((row) => row.id)
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
                      <CampaignParticipationsTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, participations.length)}
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
        title={t('delete.action', { ns: 'common' })}
        content={
          <>
            {t('delete.multiple-modal', { ns: 'common' })} <strong> {table.selected.length} </strong> {t('items', { ns: 'common' })}?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            {t('delete.word', { ns: 'common' })}
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { status, name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (participation) => {
        if (participation.user) {
          return participation.user.profile.display_name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
            participation.user.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
        }

        const displayName = `${participation.first_name} ${participation.last_name}`;
        return displayName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
          participation.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
      }
    );
  }

  if (status === 'registered') {
    inputData = inputData.filter((participation) => participation.user);
  }

  if (status === 'guests') {
    inputData = inputData.filter((participation) => !participation.user);
  }

  return inputData;
}
