// @mui
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
// locales
import { useTranslate } from 'src/locales';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
//
import { useCheckoutContext } from './context';
import CheckoutSummary from './checkout-summary';
import CheckoutCartProductList from './checkout-cart-product-list';

// ----------------------------------------------------------------------

export default function CheckoutCart() {
  const { t } = useTranslate();

  const checkout = useCheckoutContext();

  const empty = !checkout.items.length;

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                {t('cart')}
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;({checkout.totalItems} {checkout.totalItems === 1 ? t('cart-product') : t('cart-products')})
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          {empty ? (
            <EmptyContent
              title={`${t('cart-empty')}!`}
              description={`${t('cart-empty-message')}.`}
              imgUrl="/assets/icons/empty/ic_cart.svg"
              sx={{ pt: 5, pb: 10 }}
            />
          ) : (
            <CheckoutCartProductList
              products={checkout.items}
              onDelete={checkout.onDeleteCart}
              onIncreaseQuantity={checkout.onIncreaseQuantity}
              onDecreaseQuantity={checkout.onDecreaseQuantity}
            />
          )}
        </Card>

        <Button
          component={RouterLink}
          href={paths.store.root}
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          {t('to-store')}
        </Button>
      </Grid>

      <Grid xs={12} md={4}>
        <CheckoutSummary
          total={checkout.total}
          discount={checkout.discount}
          subTotal={checkout.subTotal}
          onApplyDiscount={false}
        />

        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color='primary'
          disabled={empty}
          onClick={checkout.onNextStep}
        >
          Check Out
        </Button>
      </Grid>
    </Grid>
  );
}
