import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
// locales
import { useTranslate, useLocales } from 'src/locales';
// api
import { createOrder } from 'src/api/order';
import { getBankTerminalLink } from 'src/api/payment';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
//
import { useCheckoutContext } from './context';
import CheckoutSummary from './checkout-summary';
import CheckoutDelivery from './checkout-delivery';
import CheckoutBillingInfo from './checkout-billing-info';
import CheckoutPaymentMethods from './checkout-payment-methods';
import { ORIGIN } from 'src/config-global';

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS = [
  {
    value: 0,
    label: 'Free',
    description: '5-7 Days delivery',
  },
  {
    value: 10,
    label: 'Standard',
    description: '3-5 Days delivery',
  },
  {
    value: 20,
    label: 'Express',
    description: '2-3 Days delivery',
  },
];

const CARDS_OPTIONS = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
];

export default function CheckoutPayment() {
  const { t } = useTranslate();

  const PAYMENT_OPTIONS = [
    {
      value: 'paypal',
      label: 'Pay with Paypal',
      description: 'You will be redirected to PayPal website to complete your purchase securely.',
    },
    {
      value: 'credit',
      label: t('methods.credit.title', { ns: 'ecommerce' }),
      description: t('methods.credit.description', { ns: 'ecommerce' }),
    },
    {
      value: 'cash',
      label: t('methods.cash.title', { ns: 'ecommerce' }),
      description: t('methods.cash.description', { ns: 'ecommerce' }),
    },
  ];

  const { currentLang } = useLocales();

  const { user } = useAuthContext();

  const checkout = useCheckoutContext();

  const { enqueueSnackbar } = useSnackbar();

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('Payment is required'),
  });

  const defaultValues = {
    delivery: checkout.shipping,
    payment: '',
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const values = {
        ...data,
        products: checkout.items,
        address: checkout.billing,
        total: checkout.total,
        user_id: user?.id || null
      };

      console.info('DATA', data);
      console.log(checkout);

      const { data: order, error } = await createOrder(values);

      if (error) throw error;

      if (data.payment === 'cash') {
        checkout.onNextStep();
        checkout.onReset();
      } else {
        let dskData = {
          'amount': checkout.total * 100,
          'currency': '975',
          'returnUrl': `${ORIGIN}/order/${order.number}/payment?token=${order.payment_access_token}`,
          'description': `Order: ${order.number}, Date: ${order.created_at}, Total: ${checkout.total} BGN`,
          'language': currentLang.value,
          'orderNumber': order.number
        };
  
        enqueueSnackbar(t('order-create-success', { ns: 'messages' }));
  
        const { data: paymentData, error: paymentError } = await getBankTerminalLink(dskData);
  
        if (paymentError) throw paymentError;
  
        window.open(paymentData.formUrl, '_self');
      }
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          {/* <CheckoutDelivery onApplyShipping={checkout.onApplyShipping} options={DELIVERY_OPTIONS} /> */}

          <CheckoutPaymentMethods
            cardOptions={CARDS_OPTIONS}
            options={PAYMENT_OPTIONS}
            sx={{ my: 3 }}
          />

          <Button
            size="small"
            color="inherit"
            onClick={checkout.onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            {t('back', { ns: 'common' })}
          </Button>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutBillingInfo billing={checkout.billing} onBackStep={checkout.onBackStep} />

          <CheckoutSummary
            total={checkout.total}
            subTotal={checkout.subTotal}
            discount={checkout.discount}
            shipping={checkout.shipping}
            onEdit={() => checkout.onGotoStep(0)}
          />

          <LoadingButton
            fullWidth
            color='primary'
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('complete-order', { ns: 'ecommerce' })}
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
