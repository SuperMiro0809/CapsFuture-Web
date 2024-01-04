import { useState, useCallback } from 'react';
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

export default function useTable(props) {
  const [dense, setDense] = useState(!!props?.defaultDense);

  const [page, setPage] = useState(props?.defaultCurrentPage || 0);

  const [orderBy, setOrderBy] = useState(props?.defaultOrderBy || 'name');

  const [rowsPerPage, setRowsPerPage] = useState(props?.defaultRowsPerPage || 5);

  const [order, setOrder] = useState(props?.defaultOrder || 'asc');

  const [selected, setSelected] = useState(props?.defaultSelected || []);

  const [filters, setFilters] = useState(props?.filters ?
    props.filters.map((filter) => {
      const filterObj = {
        id: filter?.id || filter.name
      }

      if (filter?.type === 'select' && filter?.multiple) {
        filterObj.value = filter?.value || [];
      } else if (filter?.type === 'date') {
        filterObj.value = filter?.value || null;
      } else {
        filterObj.value = filter?.value || '';
      }

      return filterObj;
    }) : []
  )

  const checkboxOption = useBoolean(props?.options?.checkbox ?? true);

  const addOption = useBoolean(props?.options?.add ?? true);

  const deleteOption = useBoolean(props?.options?.delete ?? true);

  const editOption = useBoolean(props?.options?.edit ?? true);

  const options = {
    checkbox: checkboxOption,
    add: addOption,
    delete: deleteOption,
    edit: editOption
  }

  const onSort = useCallback(
    (id) => {
      const isAsc = orderBy === id && order === 'asc';
      if (id !== '') {
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id);
      }
    },
    [order, orderBy]
  );

  const onSelectRow = useCallback(
    (inputValue) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onChangeRowsPerPage = useCallback((event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const onChangeDense = useCallback((event) => {
    setDense(event.target.checked);
  }, []);

  const onSelectAllRows = useCallback((checked, inputValue) => {
    if (checked) {
      setSelected(inputValue);
      return;
    }
    setSelected([]);
  }, []);

  const onChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onUpdatePageDeleteRow = useCallback(
    (totalRowsInPage) => {
      setSelected([]);
      if (page) {
        if (totalRowsInPage < 2) {
          setPage(page - 1);
        }
      }
    },
    [page]
  );

  const onUpdatePageDeleteRows = useCallback(
    ({ totalRows, totalRowsInPage, totalRowsFiltered }) => {
      const totalSelected = selected.length;

      setSelected([]);

      if (page) {
        if (totalSelected === totalRowsInPage) {
          setPage(page - 1);
        } else if (totalSelected === totalRowsFiltered) {
          setPage(0);
        } else if (totalSelected > totalRowsInPage) {
          const newPage = Math.ceil((totalRows - totalSelected) / rowsPerPage) - 1;
          setPage(newPage);
        }
      }
    },
    [page, rowsPerPage, selected.length]
  );

  const onChangeFilters = useCallback((key, newValue) => {
    const newFilters = filters.map((filter) => {
      if (filter.id === key) {
        return {
          ...filter,
          value: newValue
        };
      }

      return filter;
    });

    setFilters(newFilters);
    setPage(0);
  }, [filters]);

  return {
    dense,
    order,
    page,
    orderBy,
    rowsPerPage,
    //
    options,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangePage,
    onChangeDense,
    onResetPage,
    onChangeRowsPerPage,
    onUpdatePageDeleteRow,
    onUpdatePageDeleteRows,
    //
    setPage,
    setDense,
    setOrder,
    setOrderBy,
    setSelected,
    setRowsPerPage,
    //
    filters,
    onChangeFilters
  };
}
