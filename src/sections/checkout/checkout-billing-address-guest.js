import { useMemo } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
// locales
import { useTranslate } from 'src/locales';
// components
import Iconify from 'src/components/iconify';
//
import { useCheckoutContext } from './context';
import CheckoutSummary from './checkout-summary';
import { AddressNewForm } from '../address';
import FormProvider from 'src/components/hook-form';
import LoginButton from 'src/layouts/common/login-button';

// ----------------------------------------------------------------------

export default function CheckoutBillingAddressGuest() {
  const { t } = useTranslate();

  const checkout = useCheckoutContext();

  const phoneRegex = /^\+?(\d{1,3})?[-.\s]?\(?(?:\d{1,3})?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;

  const NewAddressSchema = Yup.object().shape({
    fullName: Yup.string().required(t('name.required', { ns: 'validation' })),
    phone: Yup.string().required(t('phone.required', { ns: 'validation' })).matches(phoneRegex, t('phone.valid', { ns: 'validation' })),
    country: Yup.object().required(t('country.required', { ns: 'validation' })),
    city: Yup.object().required(t('city.required', { ns: 'validation' })),
    street: Yup.string().required(t('street.required', { ns: 'validation' })),
    postCode: Yup.string().required(t('post-code.required', { ns: 'validation' })),
    // not required
    quarter: Yup.string().nullable(),
    buildingNumber: Yup.string(),
    entrance: Yup.string(),
    floor: Yup.string(),
    apartment: Yup.string()
  });

  console.log(checkout.billing)

  const defaultValues = useMemo(() => ({
    fullName: checkout.billing?.fullName || '',
    phone: checkout.billing?.phone || '',
    country: checkout.billing?.country || null,
    city: checkout.billing?.city || null,
    quarter: checkout.billing?.quarter || null,
    street: checkout.billing?.street || null,
    streetNumber: checkout.billing?.streetNumber || '',
    postCode: checkout.billing?.postCode || '',
    buildingNumber: checkout.billing?.buildingNumber || '',
    entrance: checkout.billing?.entrance || '',
    floor: checkout.billing?.floor || '',
    apartment: checkout.billing?.apartment || '',
    note: checkout.billing?.note || ''
  }), [checkout.billing]);

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);

    checkout.onCreateBilling(data);
  });


  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 4 }}>
            <Typography variant='subtitle2'>Влезте във Вашия профил:</Typography>
            <LoginButton
              returnTo='/product/checkout'
              sx={{ ml: 0 }}
            />
          </Stack>

          <AddressNewForm
            methods={methods}
          />

          <Stack direction="row" justifyContent="space-between" sx={{ my: 3 }}>
            <Button
              size="small"
              color="inherit"
              onClick={checkout.onBackStep}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              {t('back', { ns: 'common' })}
            </Button>
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutSummary
            total={checkout.total}
            subTotal={checkout.subTotal}
            discount={checkout.discount}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color='primary'
            loading={isSubmitting}
          >
            {t('check-out', { ns: 'ecommerce' })}
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
