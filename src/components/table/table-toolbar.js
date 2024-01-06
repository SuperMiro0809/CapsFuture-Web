import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// date-fns
import { format, isValid } from 'date-fns';
import bg from 'date-fns/locale/bg';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function TableToolbar({ table, filters }) {

  const handleFilterChange = (key) => (event) => {
    table.onChangeFilters(key, event.target.value);
  }

  const handleSelectFilterChange = (key) => (event, newValue) => {
    if(Array.isArray(newValue)) {
      // handle array
    }else {
      table.onChangeFilters(key, typeof newValue === 'object' ? newValue?.value : newValue);
    }
  }

  const handleDateFilterChange = (key) => (newValue) => {
    if (isValid(newValue)) {
      table.onChangeFilters(key, newValue);
    } else {
      table.onChangeFilters(key, null);
    }
  }

  const getFilterValue = (key) => {
    const filter = table.filters.find(item => item.id === key);

    return filter?.value;
  }

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        {filters.map((filter, index) => {
          const value = getFilterValue(filter?.id || filter.name);

          return (
            <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }} key={index}>
              {filter.type === 'search' && (
                <TextField
                  fullWidth
                  value={value}
                  onChange={handleFilterChange(filter?.id || filter.name)}
                  placeholder={filter?.placeholder || ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              {filter.type === 'select' && (
                <Autocomplete
                  fullWidth
                  multiple={filter?.multiple}
                  value={value || null}
                  placeholder={filter?.placeholder}
                  options={filter.options}
                  onChange={handleSelectFilterChange(filter?.id || filter.name)}
                  renderOption={(props, option) => (
                    <li {...props} key={option?.value || option}>
                      {option?.label || option}
                    </li>
                  )}
                  renderTags={(tagValue, getTagProps) => tagValue.map((option, index) => (
                    <Chip {...getTagProps({ index })} key={option?.value || option} label={option?.label || option} />
                  ))}
                  renderInput={(params) => (
                    <TextField
                      placeholder={filter?.placeholder}
                      {...params}
                    />
                  )}
                  {...filter}
                />
              )}

              {filter.type === 'date' && (
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={bg}>
                  <DatePicker
                    onChange={handleDateFilterChange(filter?.id || filter.name)}
                    value={value}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: filter?.placeholder
                      },
                      field: {
                        clearable: true
                      }
                    }}
                  />
                </LocalizationProvider>
              )}
            </Stack>
          )
        })}
      </Stack>
    </>
  );
}

TableToolbar.propTypes = {
  table: PropTypes.object,
  filters: PropTypes.array
}