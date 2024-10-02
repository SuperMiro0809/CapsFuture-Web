import PropTypes from 'prop-types';
import { ASSETS } from 'src/config-global';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// locales
import { useTranslate } from 'src/locales';
// components
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function MapHomeTableRow({
  row,
  selected,
  onSelectRow
}) {
  const { t } = useTranslate();

  const {
    name,
    type,
    working_time,
    address,
    collects_caps,
    collects_bottles,
    collects_cans,
    information: { user },
    first_name,
    last_name,
    email,
    phone
  } = row;

  const collapse = useBoolean();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>
        <Tooltip title={name}>
          <Typography
            noWrap
            variant='body2'
            sx={{ maxWidth: 300 }}
          >
            {name}
          </Typography>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (type.name === 'heart' && 'primary') ||
            (type.name === 'station' && 'secondary') ||
            'default'
          }
        >
          {t(type.display_name, { ns: 'location' })}
        </Label>
      </TableCell>

      <TableCell>
        {address}
      </TableCell>

      <TableCell>
        {working_time || 'Няма'}
      </TableCell>

      <TableCell>
        <Stack spacing={1} direction='row' alignItems='center'>
          {!!collects_caps && (
            <Paper sx={{ color: 'secondary.dark', backgroundColor: 'transparent' }}>
              <Tooltip title={t('caps', { ns: 'common' })}>
                <SvgColor src='/assets/icons/app/bottle_cap.svg' sx={{ width: 32, height: 32, }} />
              </Tooltip>
            </Paper>
          )}

          {!!collects_bottles && (
            <Paper sx={{ color: 'secondary.dark', backgroundColor: 'transparent' }}>
              <Tooltip title={t('bottles', { ns: 'common' })}>
                <Iconify icon="solar:bottle-bold-duotone" width={32} height={32} />
              </Tooltip>
            </Paper>
          )}

          {!!collects_cans && (
            <Paper sx={{ color: 'secondary.dark', backgroundColor: 'transparent' }}>
              <Tooltip title={t('cans', { ns: 'common' })}>
                <Iconify icon="pepicons-print:can" width={32} height={32} />
              </Tooltip>
            </Paper>
          )}
        </Stack>
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
      </TableCell>
    </TableRow >
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
          <Stack component={Paper} sx={{ m: 1.5 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                '&:not(:last-of-type)': {
                  borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                },
              }}
            >
              <Stack
                direction='row'
                alignItems='center'
                sx={{ flexGrow: 1 }}
              >
                {user ? (
                  <Avatar
                    src={user.avatar_photo_path && `${ASSETS}/${user.avatar_photo_path}`}
                    sx={{ width: 48, height: 48, mr: 2 }}
                  />
                ) : (
                  <Avatar
                    sx={{ width: 48, height: 48, mr: 2 }}
                  />
                )}

                <ListItemText
                  primary={user ? `${user.first_name} ${user.last_name}` : `${first_name} ${last_name}`}
                  primaryTypographyProps={{
                    typography: 'body2',
                  }}
                />
              </Stack>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon='ic:twotone-email' sx={{ color: 'primary.main' }} />
                {user ? user.email : email}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon='ph:phone-duotone' sx={{ color: 'primary.main' }} />
                {phone}
              </Box>
            </Stack>
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}
    </>
  );
}

MapHomeTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  deleteLoading: PropTypes.bool
};
