import PropTypes from 'prop-types';
// @mui
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// locales
import { useTranslate } from 'src/locales';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ASSETS } from 'src/config-global';

// ----------------------------------------------------------------------

export default function CampaignParticipationsTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }) {
  const { t } = useTranslate();

  const { first_name, last_name, email, phone, user, details } = row;

  let displayName = '';

  if (user) {
    displayName = user.profile.display_name;
  } else {
    displayName = `${first_name} ${last_name}`;
  }

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={displayName} src={`${ASSETS}/${user?.profile.avatar_photo_path}`} sx={{ mr: 2 }} />

        <ListItemText
          primary={displayName}
          secondary={user?.email || email}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={phone}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell>
        <Tooltip title={user ? t('registered-user-description') : t('guest-user-description')}>
          <Label
            variant="soft"
            color={
              (user && 'primary') ||
              'secondary'
            }
          >
            {user ? t('registered') : t('guest')}
          </Label>
        </Tooltip>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Paper sx={{ m: 1.5 }}>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell>{t('caps_handover')}</TableCell>
                  <TableCell align='center'>{t('bottles_handover')}</TableCell>
                  <TableCell align='center'>{t('cans_handover')}</TableCell>
                  <TableCell align='center'>{t('buying_consumables')}</TableCell>
                  <TableCell align='center'>{t('campaign_labour')}</TableCell>
                  <TableCell align='center'>{t('note', { ns: 'forms' })}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {details?.caps_handover ? <Iconify width={24} icon="charm:tick" sx={{ color: 'primary.main' }} /> : <Iconify width={24} icon="charm:cross" />}
                  </TableCell>
                  <TableCell align='center'>
                    {details?.bottles_handover ? <Iconify width={24} icon="charm:tick" sx={{ color: 'primary.main' }} /> : <Iconify width={24} icon="charm:cross" />}
                  </TableCell>
                  <TableCell align='center'>
                    {details?.cans_handover ? <Iconify width={24} icon="charm:tick" sx={{ color: 'primary.main' }} /> : <Iconify width={24} icon="charm:cross" />}
                  </TableCell>
                  <TableCell align='center'>
                    {details?.buying_consumables ? <Iconify width={24} icon="charm:tick" sx={{ color: 'primary.main' }} /> : <Iconify width={24} icon="charm:cross" />}
                  </TableCell>
                  <TableCell align='center'>
                    {details?.campaign_labour ? <Iconify width={24} icon="charm:tick" sx={{ color: 'primary.main' }} /> : <Iconify width={24} icon="charm:cross" />}
                  </TableCell>
                  <TableCell align='center'>
                    {details?.note || '-'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
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
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('delete.word', { ns: 'common' })}
        content={t('delete.single-modal', { ns: 'common' })}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {t('delete.action', { ns: 'common' })}
          </Button>
        }
      />
    </>
  );
}

CampaignParticipationsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
