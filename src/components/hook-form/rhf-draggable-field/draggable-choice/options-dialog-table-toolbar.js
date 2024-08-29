import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
// i18n
import { useTranslation } from 'react-i18next';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function OptionsDialogTableToolbar({
  filters,
  onFilters,
  //
  tableFilters
}) {
  const { t } = useTranslation();

  const handleFilterChange = useCallback(
    (name, value) => {
      onFilters(name, value)
    },
    [onFilters]
  )

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
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
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        {tableFilters.map((filter, fIndex) => {
          const filterType = filter?.type || 'search';
          const filterValue = filters[filter.id];

          switch (filterType) {
            case 'choose-many':
              return (
                <Autocomplete
                  multiple
                  fullWidth
                  value={filterValue}
                  options={filter?.options || []}
                  onChange={(_, newValue) => handleFilterChange(filter.id, newValue)}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderOption={(props, option, { selected }) => (
                    <li {...props} key={option.value}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.label}
                    </li>
                  )}
                  renderTags={(tagValue, getTagProps) => tagValue.map((option, index) => (
                    <Chip {...getTagProps({ index })} key={option.value} label={option.label} />
                  ))}
                  renderInput={(params) => (
                    <TextField {...params} label={filter.label} />
                  )}
                  key={fIndex}
                />
              );
            default:
              return (
                <TextField
                  fullWidth
                  value={filterValue}
                  onChange={(event) => handleFilterChange(filter.id, event.target.value)}
                  label={filter.label}
                  placeholder={t('search_input', { ns: 'common' })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                  key={fIndex}
                />
              )
          }
        })}
      </Stack>
    </Stack>
  );
}

OptionsDialogTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func
};
