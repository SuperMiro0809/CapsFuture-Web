import PropTypes from 'prop-types';
import { ASSETS } from 'src/config-global';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import LoadingButton from '@mui/lab/LoadingButton';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// locales
import { useTranslate } from 'src/locales';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Carousel, { useCarousel } from 'src/components/carousel';

// ----------------------------------------------------------------------

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      sx={(theme) => ({
        ...style,
        '&::before': {
          color: theme.palette.primary.main
        }
      })}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      sx={(theme) => ({
        ...style,
        '&::before': {
          color: theme.palette.primary.main
        }
      })}
      onClick={onClick}
    />
  );
}

// ----------------------------------------------------------------------

export default function ProductTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onEditActive,
  onEditShowOnHome,
  onViewRow,
  deleteLoading
}) {
  const { t } = useTranslate();

  const {
    id,
    title,
    short_description,
    price,
    files,
    active,
    show_on_home_page
  } = row;

  console.log(row)

  const confirm = useBoolean();

  const popover = usePopover();

  const carousel = useCarousel({
    fade: true,
    initialSlide: 1,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  });

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 86, ml: 4, mr: 6 }}>
            <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
              {files.map((item, index) => (
                <Avatar
                  src={`${ASSETS}/${item.filepath}`}
                  key={index}
                  variant="rounded"
                  sx={{ width: 86, height: 86 }}
                />
              ))}
            </Carousel>
          </Box>

          <ListItemText
            disableTypography
            primary={
              <Link
                noWrap
                color="inherit"
                variant="subtitle2"
                onClick={onViewRow}
                sx={{ cursor: 'pointer' }}
              >
                {title}
              </Link>
            }
          />
        </TableCell>

        <TableCell>
          <Tooltip title={short_description}>
            <Typography
              noWrap
              variant='body2'
              sx={{ maxWidth: 580 }}
            >
              {short_description}
            </Typography>
          </Tooltip>
        </TableCell>

        <TableCell>
          {`${fCurrency(price)} ${t('lv', { ns: 'common' })}.`}
        </TableCell>

        <TableCell>
          <Switch
            checked={!!active}
            onChange={(event) => {
              onEditActive(event, id)
            }}
          />
        </TableCell>

        <TableCell>
          <Switch
            checked={!!show_on_home_page}
            onChange={(event) => {
              onEditShowOnHome(event, id)
            }}
          />
        </TableCell>

        <TableCell align="right">
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
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
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
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

ProductTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onEditActive: PropTypes.func,
  onEditShowOnHome: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  deleteLoading: PropTypes.bool
};
