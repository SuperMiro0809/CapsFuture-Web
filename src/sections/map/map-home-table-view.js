'use client';

import PropTypes from 'prop-types';
// @mui
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import {
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import Scrollbar from 'src/components/scrollbar';
// locales
import { useTranslate } from 'src/locales';
//
import MapHomeTableRow from './map-home-table-row';

// ----------------------------------------------------------------------

export default function MapHomeTableView({
  table,
  locations = []
}) {
  const { t } = useTranslate();

  const dataFiltered = applyFilter({
    inputData: locations,
    comparator: getComparator(table.order, table.orderBy)
  });

  const confirm = useBoolean();

  const denseHeight = table.dense ? 52 : 72;

  const notFound = !dataFiltered.length;

  const TABLE_HEAD = [
    { id: 'name', label: t('name', { ns: 'forms' }), width: 300 },
    { id: 'type', label: t('type', { ns: 'forms' }), width: 100 },
    { id: 'address', label: t('address', { ns: 'location' }) },
    { id: 'working_time', label: t('working-time', { ns: 'forms' }), width: 200 },
    { id: 'collects', label: t('collects', { ns: 'forms' }), width: 200, sort: false },
    { id: '', width: 88 },
  ];

  return (
    <>
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
                  <MapHomeTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
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
    </>
  );
}

MapHomeTableView.propTypes = {
  table: PropTypes.object,
  locations: PropTypes.array
};

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
