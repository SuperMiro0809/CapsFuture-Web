import PropTypes from 'prop-types';
import { ASSETS } from 'src/config-global';
// @mui
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// locales
import { useTranslate } from 'src/locales';
// date-fns
import { format, parseISO } from 'date-fns';
// components
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function CampaignTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onOpenParticipations, deleteLoading }) {
  const { t } = useTranslate();

  const { title, short_description, title_image_path, address, date } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={title}
            src={`${ASSETS}/${title_image_path}`}
            variant='rounded'
            sx={{ mr: 2, width: 86, height: 86 }}
          />

          <ListItemText
            primary={
              <Link
                noWrap
                color="inherit"
                variant="subtitle2"
                // onClick={onViewRow}
                sx={{ cursor: 'pointer' }}
              >
                {title}
              </Link>
            }
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Tooltip title={short_description}>
            <Typography
              noWrap
              variant='body2'
              sx={{ maxWidth: 480 }}
            >
              {short_description}
            </Typography>
          </Tooltip>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Tooltip title={address}>
            <Typography
              noWrap
              variant='body2'
              sx={{ maxWidth: 400 }}
            >
              {address}
            </Typography>
          </Tooltip>
        </TableCell>

        <TableCell>
          {format(parseISO(date), 'dd.MM.yyyy')}
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title={t('participations', { ns: 'campaign' })} placement="top" arrow>
            <IconButton color='primary' onClick={onOpenParticipations}>
              <Iconify icon='fluent:people-20-filled' />
            </IconButton>
          </Tooltip>

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('delete.action', { ns: 'common' })}
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {t('edit', { ns: 'common' })}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('delete.word', { ns: 'common' })}
        content={t('delete.single-modal', { ns: 'common' })}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={onDeleteRow}
            loading={deleteLoading}
          >
            {t('delete.action', { ns: 'common' })}
          </LoadingButton>
        }
      />
    </>
  );
}

CampaignTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onOpenParticipations: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  deleteLoading: PropTypes.bool
};
