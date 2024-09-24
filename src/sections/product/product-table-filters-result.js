import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
// locales
import { useTranslate } from 'src/locales';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ProductTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  activeOptions,
  showOnHomeOptions,
  //
  results,
  ...other
}) {
  const { t } = useTranslate();

  const handleRemoveActive = (inputValue) => {
    const newValue = filters.active.filter((item) => item !== inputValue);
    onFilters('active', newValue);
  };

  const handleRemoveShowOnHome = (inputValue) => {
    const newValue = filters.showOnHome.filter((item) => item !== inputValue);
    onFilters('showOnHome', newValue);
  };

  const getActiveLabel = (activeValue) => {
    const activeOption = activeOptions.find((x) => x.value === activeValue);

    return activeOption?.label || activeValue;
  };

  const getShowOnHomeLabel = (showOnHomeValue) => {
    const showOnHomeOption = showOnHomeOptions.find((x) => x.value === showOnHomeValue);

    return showOnHomeOption?.label || showOnHomeValue;
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          {t('results-found', { ns: 'common' })}
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.active.length && (
          <Block label={`${t('active-status', { ns: 'forms' })}:`}>
            {filters.active.map((item) => (
              <Chip
                key={item}
                label={getActiveLabel(item)}
                size="small"
                onDelete={() => handleRemoveActive(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.showOnHome.length && (
          <Block label={`${t('homepage-visibility', { ns: 'forms' })}:`}>
            {filters.showOnHome.map((item) => (
              <Chip
                key={item}
                label={getShowOnHomeLabel(item)}
                size="small"
                onDelete={() => handleRemoveShowOnHome(item)}
              />
            ))}
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          {t('clear', { ns: 'common' })}
        </Button>
      </Stack>
    </Stack>
  );
}

ProductTableFiltersResult.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onResetFilters: PropTypes.func,
  activeOptions: PropTypes.array,
  showOnHomeOptions: PropTypes.array,
  results: PropTypes.number,
};

// ----------------------------------------------------------------------

function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}

Block.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  sx: PropTypes.object,
};
