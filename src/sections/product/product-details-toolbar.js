import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
// routes
import { RouterLink } from 'src/routes/components';
// locales
import { useTranslate } from 'src/locales';
// componets
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function ProductDetailsToolbar({
  active,
  backLink,
  editLink,
  liveLink,
  activeOptions,
  onChangeActive,
  isActiveLoading,
  sx,
  ...other
}) {
  const { t } = useTranslate();

  const popover = usePopover();

  return (
    <>
      <Stack
        spacing={1.5}
        direction="row"
        sx={{
          mb: { xs: 3, md: 5 },
          ...sx,
        }}
        {...other}
      >
        <Button
          component={RouterLink}
          href={backLink}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          {t('back', { ns: 'common' })}
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {!!active && (
          <Tooltip title={t('go-live', { ns: 'common' })}>
            <IconButton component={RouterLink} href={liveLink}>
              <Iconify icon="eva:external-link-fill" />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title={t('edit', { ns: 'common' })}>
          <IconButton component={RouterLink} href={editLink}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>

        <LoadingButton
          color='secondary'
          variant="contained"
          loading={isActiveLoading}
          loadingIndicator={`${t('loading', { ns: 'common' })}…`}
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          onClick={popover.onOpen}
          sx={{ textTransform: 'capitalize' }}
        >
          {active ? t('active', { ns: 'common' }) : t('inactive', { ns: 'common' })}
        </LoadingButton>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {activeOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === active}
            onClick={() => {
              popover.onClose();
              onChangeActive(option.value);
            }}
          >
            {option.value === 1 && <Iconify icon="eva:cloud-upload-fill" />}
            {option.value === 0 && <Iconify icon="solar:file-text-bold" />}
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}

ProductDetailsToolbar.propTypes = {
  backLink: PropTypes.string,
  editLink: PropTypes.string,
  liveLink: PropTypes.string,
  onChangePublish: PropTypes.func,
  publish: PropTypes.string,
  publishOptions: PropTypes.array,
  isActiveLoading: PropTypes.bool,
  sx: PropTypes.object,
};
