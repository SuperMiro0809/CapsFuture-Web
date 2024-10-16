import { useCallback } from 'react';
// @mui
import Chip from '@mui/material/Chip';
// locales
import { useTranslate, useLocales } from 'src/locales';
// date-fns
import { bg, enUS } from 'date-fns/locale';
// components
import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';
import { shortDateLabel } from 'src/components/custom-date-range-picker';

// ----------------------------------------------------------------------

export default function CampaignFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  //
  totalResults,
  sx
}) {
  const { t } = useTranslate();

  const { currentLang } = useLocales();

  const shortLabel = shortDateLabel(
    filters.startDate,
    filters.endDate,
    {
      locale: (currentLang.value === 'bg' && bg) || (currentLang.value === 'en' && enUS)
    }
  );

  const handleRemoveKeyword = useCallback(() => {
    onFilters('title', '');
  }, [filters, onFilters]);

  const handleRemoveDate = useCallback(() => {
    onFilters('startDate', null);
    onFilters('endDate', null);
  }, [filters, onFilters]);

  return (
    <FiltersResult totalResults={totalResults} onReset={onResetFilters} sx={sx}>
      <FiltersBlock label={`${t('date', { ns: 'forms' })}:`} isShow={filters.startDate && filters.endDate}>
        <Chip
           {...chipProps}
          label={shortLabel}
          onDelete={handleRemoveDate}
        />
      </FiltersBlock>

      <FiltersBlock label={`${t('keyword', { ns: 'common' })}:`} isShow={!!filters.title}>
        <Chip {...chipProps} label={filters.title} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
