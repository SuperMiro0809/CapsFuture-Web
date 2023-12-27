import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function TableToolbar({ table, filters }) {

    const handleFilterChange = (key) => (event) => {
        table.onChangeFilters(key, event.target.value);
    }

    const getFilterValue = (key) => {
        const filter = table.filters.find(item => item.id === key);

        return filter?.value || '';
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
                        </Stack>
                    )
                })}
                {/* <FormControl
              sx={{
                flexShrink: 0,
                width: { xs: 1, md: 200 },
              }}
            >
              <InputLabel>Stock</InputLabel>
    
              <Select
                multiple
                value={filters.stock}
                onChange={handleFilterStock}
                input={<OutlinedInput label="Stock" />}
                renderValue={(selected) => selected.map((value) => value).join(', ')}
                sx={{ textTransform: 'capitalize' }}
              >
                {stockOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox
                      disableRipple
                      size="small"
                      checked={filters.stock.includes(option.value)}
                    />
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}

                {/* <FormControl
              sx={{
                flexShrink: 0,
                width: { xs: 1, md: 200 },
              }}
            >
              <InputLabel>Publish</InputLabel>
    
              <Select
                multiple
                value={filters.publish}
                onChange={handleFilterPublish}
                input={<OutlinedInput label="Publish" />}
                renderValue={(selected) => selected.map((value) => value).join(', ')}
                sx={{ textTransform: 'capitalize' }}
              >
                {publishOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox
                      disableRipple
                      size="small"
                      checked={filters.publish.includes(option.value)}
                    />
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}

                {/* <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
              <TextField
                fullWidth
                value={filters.name}
                onChange={handleFilterName}
                placeholder="Search..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
    
              <IconButton >
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            </Stack> */}
            </Stack>
            {/*     
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
          </CustomPopover> */}
        </>
    );
}

TableToolbar.propTypes = {
  table: PropTypes.object,
  filters: PropTypes.array
}