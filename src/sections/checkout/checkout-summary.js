import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
// locales
import { useTranslate } from 'src/locales';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CheckoutSummary({
  total,
  discount,
  subTotal,
  shipping,
  //
  onEdit,
  onApplyDiscount,
}) {
  const { t } = useTranslate();

  const displayShipping = shipping !== null ? 'free' : '-';

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={t('order-summary', { ns: 'ecommerce' })}
        action={
          onEdit && (
            <Button size="small" onClick={onEdit} startIcon={<Iconify icon="solar:pen-bold" />}>
              Edit
            </Button>
          )
        }
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('sub-total', { ns: 'ecommerce' })}
            </Typography>
            <Typography variant="subtitle2">{`${fCurrency(subTotal)} ${t('lv', { ns: 'common' })}`}</Typography>
          </Stack>

          {/* <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Discount
            </Typography>
            <Typography variant="subtitle2">{discount ? fCurrency(-discount) : '-'}</Typography>
          </Stack> */}

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('shipping', { ns: 'ecommerce' })}
            </Typography>
            <Typography variant="subtitle2">
              {shipping ? fCurrency(shipping) : t(displayShipping, { ns: 'ecommerce' })}
            </Typography>
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">{t('total', { ns: 'common' })}</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                {`${fCurrency(total)} ${t('lv', { ns: 'common' })}.`}
              </Typography>
              <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                {t('with-VAT', { ns: 'common' })}
              </Typography>
            </Box>
          </Stack>

          {onApplyDiscount && (
            <TextField
              fullWidth
              placeholder="Discount codes / Gifts"
              value="DISCOUNT5"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button color="primary" onClick={() => onApplyDiscount(5)} sx={{ mr: -0.5 }}>
                      Apply
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

CheckoutSummary.propTypes = {
  total: PropTypes.number,
  discount: PropTypes.number,
  shipping: PropTypes.number,
  subTotal: PropTypes.number,
  onEdit: PropTypes.func,
  onApplyDiscount: PropTypes.func,
};
