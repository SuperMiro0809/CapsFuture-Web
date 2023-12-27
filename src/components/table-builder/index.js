import isEqual from 'lodash/isEqual';
import { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// i18n
import { useTranslation } from 'react-i18next';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
    TableNoData,
    TableRowCustom,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
    TableToolbar
} from 'src/components/table';

export default function TableBuilder({
    table,
    tableHead,
    tableData,
    tableTotal,
    tableFilters = [],
    defaultFilters = {},
    deleteHandler = () => { }
}) {
    const confirm = useBoolean();

    const { t } = useTranslation();

    const [filters, setFilters] = useState(defaultFilters);

    const [selectedId, setSelectedId] = useState(0);

    const dataFiltered = tableData;

    const canReset = !isEqual(defaultFilters, filters);

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    return (
        <>
            {tableFilters.length > 0 && (
                <TableToolbar
                    table={table}
                    filters={tableFilters}
                />
            )}

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <TableSelectedAction
                    dense={table.dense}
                    numSelected={table.selected.length}
                    rowCount={tableData.length}
                    onSelectAllRows={(checked) =>
                        table.onSelectAllRows(
                            checked,
                            tableData.map((row) => row.id)
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
                            headLabel={tableHead}
                            rowCount={tableData.length}
                            numSelected={table.selected.length}
                            onSort={table.onSort}
                            onSelectAllRows={(checked) =>
                                table.onSelectAllRows(
                                    checked,
                                    tableData.map((row) => row.id)
                                )
                            }
                            tableOptions={table.options}
                        />

                        <TableBody>
                            {dataFiltered
                                .map((row) => (
                                    <TableRowCustom
                                        key={row.id}
                                        row={row}
                                        tableHead={tableHead}
                                        selected={table.selected.includes(row.id)}
                                        onSelectRow={() => table.onSelectRow(row.id)}
                                        tableOptions={table.options}
                                        confirm={confirm}
                                        setSelectedId={setSelectedId}
                                    />
                                ))}

                            <TableNoData notFound={notFound} />
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
                count={tableTotal || tableData.length}
                page={table.page}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                onRowsPerPageChange={table.onChangeRowsPerPage}
                //
                dense={table.dense}
                onChangeDense={table.onChangeDense}
            />

            <ConfirmDialog
                open={confirm.value}
                onClose={() => {
                    confirm.onFalse();
                    setSelectedId(0);
                }}
                title={t('delete.word')}
                content={
                    <>
                        {(selectedId || table.selected.length === 1) ? (
                            <>{t('delete.single-modal')}</>
                        ) : (
                            <>
                                {t('delete.multiple-modal')} <strong> {table.selected.length} </strong> {t('items')}?
                            </>
                        )}
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            if (selectedId) {
                                deleteHandler([selectedId]);
                            }else {
                                deleteHandler(table.selected);
                            }

                            confirm.onFalse();
                            setSelectedId(0);
                        }}
                    >
                        {t('delete.action')}
                    </Button>
                }
            />
        </>
    );
}

TableBuilder.propTypes = {
    table: PropTypes.object,
    tableHead: PropTypes.array,
    tableData: PropTypes.array,
    tableTotal: PropTypes.number,
    tableFilters: PropTypes.array,
    defaultFilters: PropTypes.object,
    deleteHandler: PropTypes.func
}