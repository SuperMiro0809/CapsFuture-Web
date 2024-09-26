import { useCallback } from 'react';
// @mui
import Chip from '@mui/material/Chip';
// locales
import { useTranslate } from 'src/locales';
// components
import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export default function StationLocationsFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  onResetPage,
  //
  typeOptions,
  collectsOptions,
  //
  totalResults,
  sx
}) {
  const { t } = useTranslate();

  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    onFilters('name', '');
  }, [filters, onResetPage, onFilters]);

  const handleRemoveTypes = useCallback(
    (inputValue) => {
      const newValue = filters.state.type.filter((item) => item !== inputValue);

      onResetPage();
      onFilters('type', newValue);
    },
    [filters, onResetPage, onFilters]
  );

  const getTypeLabel = (typeValue) => {
    const typeOption = typeOptions.find((x) => x.value === typeValue);

    return typeOption?.label || typeValue;
  };

  const getCollectsLabel = (collectsValue) => {
    const collectsOption = collectsOptions.find((x) => x.value === collectsValue);

    return collectsOption?.label || collectsValue;
  };

  return (
    <FiltersResult totalResults={totalResults} onReset={onResetFilters} sx={sx}>
      <FiltersBlock label={`${t('collects', { ns: 'forms' })}:`} isShow={!!filters.collects.length}>
        {filters.collects.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={getCollectsLabel(item)}
            onDelete={() => handleRemoveTypes(item)}
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label={`${t('type', { ns: 'forms' })}:`} isShow={!!filters.type.length}>
        {filters.type.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={getTypeLabel(item)}
            onDelete={() => handleRemoveTypes(item)}
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label={`${t('keyword', { ns: 'common' })}:`} isShow={!!filters.name}>
        <Chip {...chipProps} label={filters.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
