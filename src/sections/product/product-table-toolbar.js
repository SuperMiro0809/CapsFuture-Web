import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
// locales
import { useTranslate } from 'src/locales';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function ProductTableToolbar({
  filters,
  onFilters,
  //
  activeOptions,
  showOnHomeOptions
}) {
  const { t } = useTranslate();

  const popover = usePopover();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterActive = useCallback(
    (event) => {
      onFilters(
        'active',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterShowOnHome = useCallback(
    (event) => {
      onFilters(
        'showOnHome',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const getActiveLabel = (activeValue) => {
    const activeOption = activeOptions.find((x) => x.value === activeValue);

    return activeOption?.label || activeValue;
  };

  const getShowOnHomeLabel = (showOnHomeValue) => {
    const showOnHomeOption = showOnHomeOptions.find((x) => x.value === showOnHomeValue);

    return showOnHomeOption?.label || showOnHomeValue;
  };

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
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>{t('active-status', { ns: 'forms' })}</InputLabel>

          <Select
            multiple
            value={filters.active}
            onChange={handleFilterActive}
            input={<OutlinedInput label={t('active-status', { ns: 'forms' })} />}
            renderValue={(selected) => selected.map((value) => getActiveLabel(value)).join(', ')}
            sx={{ textTransform: 'capitalize' }}
          >
            {activeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.active.includes(option.value)}
                />
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 300 },
          }}
        >
          <InputLabel>{t('homepage-visibility', { ns: 'forms' })}</InputLabel>

          <Select
            multiple
            value={filters.showOnHome}
            onChange={handleFilterShowOnHome}
            input={<OutlinedInput label={t('homepage-visibility', { ns: 'forms' })} />}
            renderValue={(selected) => selected.map((value) => getShowOnHomeLabel(value)).join(', ')}
            sx={{ textTransform: 'capitalize' }}
          >
            {showOnHomeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.showOnHome.includes(option.value)}
                />
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder={`${t('search', { ns: 'common' })}...`}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}

ProductTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  activeOptions: PropTypes.array,
  showOnHomeOptions: PropTypes.array
};
