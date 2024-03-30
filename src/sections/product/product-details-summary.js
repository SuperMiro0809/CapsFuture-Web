import PropTypes from 'prop-types';
import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// locales
import { useTranslate } from 'src/locales';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';
//
import IncrementerButton from './common/incrementer-button';
import { ASSETS } from 'src/config-global';

// ----------------------------------------------------------------------

export default function ProductDetailsSummary({
  items,
  product,
  onAddCart,
  onGotoStep,
  disabledActions,
  ...other
}) {
  const { t } = useTranslate();

  const router = useRouter();

  const {
    id,
    title,
    price,
    active,
    files,
    short_description,
  } = product;

  const existProduct = !!items?.length && items.map((item) => item.id).includes(id);

  const defaultValues = {
    id,
    coverUrl: `${ASSETS}/${files[0].filepath}`,
    price,
    quantity: 1,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, control, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!existProduct) {
        onAddCart?.({
          ...data,
          subTotal: data.price * data.quantity,
        });
      }
      onGotoStep?.(0);
      router.push(paths.product.checkout);
    } catch (error) {
      console.error(error);
    }
  });

  const handleAddCart = useCallback(() => {
    try {
      onAddCart?.({
        ...values,
        subTotal: values.price * values.quantity,
      });
    } catch (error) {
      console.error(error);
    }
  }, [onAddCart, values]);

  const renderPrice = (
    <Box sx={{ typography: 'h5' }}>
      {`${fCurrency(price)} ${t('lv', { ns: 'common' })}.`}
    </Box>
  );

  const renderShare = (
    <Stack direction="row" spacing={3} justifyContent="center">
      {/* <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Iconify icon="solar:heart-bold" width={16} sx={{ mr: 1 }} />
        Favorite
      </Link> */}

      <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Iconify icon="solar:share-bold" width={16} sx={{ mr: 1 }} />
        Share
      </Link>
    </Stack>
  );

  // const renderColorOptions = (
  //   <Stack direction="row">
  //     <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
  //       Color
  //     </Typography>

  //     <Controller
  //       name="colors"
  //       control={control}
  //       render={({ field }) => (
  //         <ColorPicker
  //           colors={colors}
  //           selected={field.value}
  //           onSelectColor={(color) => field.onChange(color)}
  //           limit={4}
  //         />
  //       )}
  //     />
  //   </Stack>
  // );

  // const renderSizeOptions = (
  //   <Stack direction="row">
  //     <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
  //       Size
  //     </Typography>

  //     <RHFSelect
  //       name="size"
  //       size="small"
  //       helperText={
  //         <Link underline="always" color="textPrimary">
  //           Size Chart
  //         </Link>
  //       }
  //       sx={{
  //         maxWidth: 88,
  //         [`& .${formHelperTextClasses.root}`]: {
  //           mx: 0,
  //           mt: 1,
  //           textAlign: 'right',
  //         },
  //       }}
  //     >
  //       {sizes.map((size) => (
  //         <MenuItem key={size} value={size}>
  //           {size}
  //         </MenuItem>
  //       ))}
  //     </RHFSelect>
  //   </Stack>
  // );

  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        {t('quantity', { ns: 'forms' })}
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          quantity={values.quantity}
          disabledDecrease={values.quantity <= 1}
          onIncrease={() => setValue('quantity', values.quantity + 1)}
          onDecrease={() => setValue('quantity', values.quantity - 1)}
        />

        {/* <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
          Available: {available}
        </Typography> */}
      </Stack>
    </Stack>
  );

  const renderActions = (
    <Stack direction="row" spacing={2}>
      <Button
        fullWidth
        disabled={disabledActions}
        size="large"
        color="secondary"
        variant="contained"
        startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
        onClick={handleAddCart}
        sx={{ whiteSpace: 'nowrap' }}
      >
        {t('add-to-cart', { ns: 'ecommerce' })}
      </Button>

      <Button fullWidth size="large" color="primary" type="submit" variant="contained" disabled={disabledActions}>
        {t('buy-now', { ns: 'ecommerce' })}
      </Button>
    </Stack>
  );

  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {short_description}
    </Typography>
  );

  // const renderRating = (
  //   <Stack
  //     direction="row"
  //     alignItems="center"
  //     sx={{
  //       color: 'text.disabled',
  //       typography: 'body2',
  //     }}
  //   >
  //     <Rating size="small" value={totalRatings} precision={0.1} readOnly sx={{ mr: 1 }} />
  //     {`(${fShortenNumber(totalReviews)} reviews)`}
  //   </Stack>
  // );

  // const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
  //   <Stack direction="row" alignItems="center" spacing={1}>
  //     {newLabel.enabled && <Label color="info">{newLabel.content}</Label>}
  //     {saleLabel.enabled && <Label color="error">{saleLabel.content}</Label>}
  //   </Stack>
  // );

  const renderInventoryType = (
    <Box
      component="span"
      sx={{
        typography: 'overline',
        color:
          (!active && 'error.main') ||
          'success.main',
      }}
    >
      {active ? t('in-stock', { ns: 'common' }) : t('out-of-stock', { ns: 'common' })}
    </Box>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start">
          {/* {renderLabels} */}

          {renderInventoryType}

          <Typography variant="h5">{title}</Typography>

          {/* {renderRating} */}

          {renderPrice}

          {renderSubDescription}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* {renderColorOptions} */}

        {/* {renderSizeOptions} */}

        {renderQuantity}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderActions}

        {renderShare}
      </Stack>
    </FormProvider>
  );
}

ProductDetailsSummary.propTypes = {
  items: PropTypes.array,
  disabledActions: PropTypes.bool,
  onAddCart: PropTypes.func,
  onGotoStep: PropTypes.func,
  product: PropTypes.object,
};
