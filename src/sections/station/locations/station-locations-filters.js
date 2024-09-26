import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import InputAdornment from '@mui/material/InputAdornment';
// locales
import { useTranslate } from 'src/locales';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function StationLocationsFilters({
  filters,
  onFilters,
  //
  typeOptions,
  collectsOptions
}) {
  const { t } = useTranslate();

  const popoverType = usePopover();

  const popoverCollects = usePopover();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterType = useCallback(
    (newValue) => {
      const checked = filters.type.includes(newValue)
        ? filters.type.filter((value) => value !== newValue)
        : [...filters.type, newValue];
      onFilters('type', checked);
    },
    [filters.type, onFilters]
  );

  const handleFilterCollects = useCallback(
    (newValue) => {
      const checked = filters.collects.includes(newValue)
        ? filters.collects.filter((value) => value !== newValue)
        : [...filters.collects, newValue];
      onFilters('collects', checked);
    },
    [filters.collects, onFilters]
  );

  const handleResetType = useCallback(() => {
    popoverType.onClose();
    onFilters('type', []);
  }, [onFilters, popoverType]);

  const handleResetCollects = useCallback(() => {
    popoverCollects.onClose();
    onFilters('collects', []);
  }, [onFilters, popoverCollects]);

  const getTypeLabel = (typeValue) => {
    const typeOption = typeOptions.find((x) => x.value === typeValue);

    return typeOption?.label || typeValue;
  };

  const getCollectsLabel = (collectsValue) => {
    const collectsOption = collectsOptions.find((x) => x.value === collectsValue);

    return collectsOption?.label || collectsValue;
  };

  const renderLabel = filters.type.length ? filters.type.slice(0, 2).map((type) => getTypeLabel(type)).join(',') : t('all-type', { ns: 'common' });

  const renderCollectsLabel = filters.collects.length ? filters.collects.slice(0, 2).map((collects) => getCollectsLabel(collects)).join(',') : t('collects', { ns: 'forms' });

  const renderFilterName = (
    <TextField
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
      sx={{
        width: { xs: 1, md: 260 },
      }}
    />
  );

  const renderFilterCollects = (
    <>
      <Button
        color="inherit"
        onClick={popoverCollects.onOpen}
        endIcon={
          <Iconify
            icon={popoverCollects.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            sx={{ ml: -0.5 }}
          />
        }
      >
        {renderCollectsLabel}
        {filters.collects.length > 2 && (
          <Label color="info" sx={{ ml: 1 }}>
            +{filters.collects.length - 2}
          </Label>
        )}
      </Button>

      <CustomPopover open={popoverCollects.open} onClose={popoverCollects.onClose} sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            {collectsOptions.map((collects) => {
              const selected = filters.collects.includes(collects.value);

              return (
                <CardActionArea
                  key={collects.value}
                  onClick={() => handleFilterCollects(collects.value)}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
                    ...(selected && {
                      bgcolor: 'action.selected',
                    }),
                  }}
                >
                  <Stack spacing={1} direction="row" alignItems="center">
                    {collects.icon}
                    <Typography variant={selected ? 'subtitle2' : 'body2'}>{collects.label}</Typography>
                  </Stack>
                </CardActionArea>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button variant="outlined" color="inherit" onClick={handleResetCollects}>
              {t('clear', { ns: 'common' })}
            </Button>

            <Button variant="contained" onClick={popoverCollects.onClose}>
              {t('apply', { ns: 'common' })}
            </Button>
          </Stack>
        </Stack>
      </CustomPopover>
    </>
  );

  const renderFilterType = (
    <>
      <Button
        color="inherit"
        onClick={popoverType.onOpen}
        endIcon={
          <Iconify
            icon={popoverType.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            sx={{ ml: -0.5 }}
          />
        }
      >
        {renderLabel}
        {filters.type.length > 2 && (
          <Label color="info" sx={{ ml: 1 }}>
            +{filters.type.length - 2}
          </Label>
        )}
      </Button>

      <CustomPopover open={popoverType.open} onClose={popoverType.onClose} sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            {typeOptions.map((type) => {
              const selected = filters.type.includes(type.value);

              return (
                <CardActionArea
                  key={type.value}
                  onClick={() => handleFilterType(type.value)}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
                    ...(selected && {
                      bgcolor: 'action.selected',
                    }),
                  }}
                >
                  <Stack spacing={1} direction="row" alignItems="center">
                    {type.icon}
                    <Typography variant={selected ? 'subtitle2' : 'body2'}>{type.label}</Typography>
                  </Stack>
                </CardActionArea>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button variant="outlined" color="inherit" onClick={handleResetType}>
              {t('clear', { ns: 'common' })}
            </Button>

            <Button variant="contained" onClick={popoverType.onClose}>
              {t('apply', { ns: 'common' })}
            </Button>
          </Stack>
        </Stack>
      </CustomPopover>
    </>
  );

  return (
    <Stack
      spacing={1}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      sx={{ width: 1 }}
    >
      {renderFilterName}

      <Stack spacing={1} direction="row" alignItems="center" justifyContent="flex-end" flexGrow={1}>
        {renderFilterCollects}

        {renderFilterType}
      </Stack>
    </Stack>
  );
}

StationLocationsFilters.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  typeOptions: PropTypes.array,
  collectsOptions: PropTypes.array
};
