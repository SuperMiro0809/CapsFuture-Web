import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';
// @mui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
// components
import Iconify from 'src/components/iconify';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom
} from 'src/components/table';
import Scrollbar from 'src/components/scrollbar';
// i18n
import { useTranslation } from 'react-i18next';
//
import OptionsDialogTableRow from './options-dialog-table-row';
import OptionsDialogTableToolbar from './options-dialog-table-toolbar';

export default function OptionsDialog({
  title,
  name,
  options,
  selected,
  setSelected,
  open,
  onClose,
  //
  choiceDialog,
  //
  ...other
}) {
  const defaultFilters = {};

  choiceDialog.tableFilters.forEach((filter) => {
    let defaultValue = '';

    if (filter?.type === 'choose-many') {
      defaultValue = [];
    }

    defaultFilters[filter.id] = defaultValue;
  });

  const { t } = useTranslation();

  const table = useTable({ defaultRowsPerPage: 10 });

  const [data, setData] = useState([])

  const [checked, setChecked] = useState(selected);

  const TABLE_FILTERS = choiceDialog.tableFilters;

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    tableFilters: TABLE_FILTERS
  });

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual({}, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const TABLE_HEAD = choiceDialog.tableColumns;

  useEffect(() => {
    if (options.length) {
      setData(options)
    }
  }, [options])

  useEffect(() => {
    const ids = selected.map((x) => x.id);
    table.onSelectAllRows([], ids);
    setChecked(selected);
  }, [selected])

  const handleToggle = (id) => {
    const currentIndex = checked.findIndex(el => el.id === id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      const el = options.find(option => option.id === id);
      newChecked.push(el);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleSelectAll = (ids, rowsChecked) => {
    const newChecked = [];

    if (rowsChecked) {
      ids.forEach((id) => {
        const el = options.find(option => option.id === id);
        newChecked.push(el);
      });
    }

    setChecked(newChecked);
  }

  const handleFilters = useCallback(
    (filterName, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [filterName]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleClose = () => {
    onClose();
    setData(options);
  }

  const handleSave = () => {
    onClose();
    setData(options);
    setSelected(checked);
  }

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      <DialogContent dividers>
        <OptionsDialogTableToolbar
          filters={filters}
          onFilters={handleFilters}
          //
          tableFilters={TABLE_FILTERS}
        />

        <TableContainer>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(rowsChecked) => {
              table.onSelectAllRows(
                rowsChecked,
                dataFiltered.map((row) => row.id)
              );

              handleSelectAll(dataFiltered.map((row) => row.id), rowsChecked)
            }}
          />

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(rowsChecked) => {
                  table.onSelectAllRows(
                    rowsChecked,
                    dataFiltered.map((row) => row.id)
                  );
                  
                  handleSelectAll(dataFiltered.map((row) => row.id), rowsChecked)
                }}
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <OptionsDialogTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => {
                        table.onSelectRow(row.id);
                        handleToggle(row.id);
                      }}
                      //
                      tableColumns={TABLE_HEAD}
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

      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
        >
          {t('save', { ns: 'common' })}
        </Button>

        <Button
          variant="outlined"
          color="inherit"
          onClick={handleClose}
        >
          {t('cancel', { ns: 'common' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

OptionsDialog.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    content: PropTypes.string
  })),
  selected: PropTypes.array,
  setSelected: PropTypes.func,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  choiceDialog: PropTypes.shape({
    tableColumns: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      width: PropTypes.number
    })),
    tableFilters: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
      label: PropTypes.string
    }))
  }),
};

function applyFilter({ inputData, comparator, filters, tableFilters }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  Object.keys(filters).forEach((filter) => {
    const value = filters[filter];
    const {type} = tableFilters.find((f) => f.id === filter);

    switch (type) {
      case 'search':
        if (value) {
          inputData = inputData.filter((el) => el[filter].toLowerCase().indexOf(value.toLowerCase()) !== -1);
        }
        break;
      case 'choose-many':
        if (value.length > 0) {
          const newValue = value.map((x) => x.value);
          inputData = inputData.filter(
            (el) => {
              if (Array.isArray(el[filter])) {
                return el[filter].some(x => newValue.includes(x.id));
              }

              return newValue.includes(el[filter].id);
            }
          );
        }
        break;
      default:
        //
    }
  });

  return inputData;
}
