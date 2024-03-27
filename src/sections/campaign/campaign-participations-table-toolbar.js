import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// locales
import { useTranslate } from 'src/locales';
// utils
import exportExcel from 'src/utils/export-excel';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function CampaignParticipationsTableToolbar({
  participations,
  //
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
}) {
  const { t } = useTranslate();

  const popover = usePopover();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      onFilters('startDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onFilters('endDate', newValue);
    },
    [onFilters]
  );

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
        {/* <DatePicker
          label="Start date"
          value={filters.startDate}
          onChange={handleFilterStartDate}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
          sx={{
            maxWidth: { md: 200 },
          }}
        /> */}

        {/* <DatePicker
          label="End date"
          value={filters.endDate}
          onChange={handleFilterEndDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{
            maxWidth: { md: 200 },
          }}
        /> */}

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

          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>

        {canReset && (
          <Button
            color="error"
            sx={{ flexShrink: 0 }}
            onClick={onResetFilters}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            Clear
          </Button>
        )}
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
            const dataFields = [
              { id: 'name', label: t('name', { ns: 'forms' }) },
              { id: 'email', label: t('email', { ns: 'forms' }) },
              { id: 'phone', label: t('phone', { ns: 'forms' }) },
              { id: 'caps_handover', label: t('caps_handover') },
              { id: 'bottles_handover', label: t('bottles_handover') },
              { id: 'cans_handover', label: t('cans_handover') },
              { id: 'buying_consumables', label: t('buying_consumables') },
              { id: 'campaign_labour', label: t('campaign_labour') },
              { id: 'note', label: t('note', { ns: 'forms' }) },
            ];

            const data = participations.map((participation) => ({
              name: participation.user ? participation.user.profile.display_name : `${participation.first_name} ${participation.last_name}`,
              email: participation.user ? participation.user.email : participation.email,
              phone: participation.phone,
              caps_handover: participation.details?.caps_handover ? 'Да' : 'Не',
              bottles_handover: participation.details?.bottles_handover ? 'Да' : 'Не',
              cans_handover: participation.details?.cans_handover ? 'Да' : 'Не',
              buying_consumables: participation.details?.buying_consumables ? 'Да' : 'Не',
              campaign_labour: participation.details?.campaign_labour ? 'Да' : 'Не',
              note: participation.details?.note || '-'
            }));

            exportExcel('Export', 'Участия', dataFields, data);
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

CampaignParticipationsTableToolbar.propTypes = {
  participations: PropTypes.array,
  canReset: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onResetFilters: PropTypes.func,
};
