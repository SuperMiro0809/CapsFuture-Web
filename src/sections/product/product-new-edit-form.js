import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// api
import {
  _tags,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';
import { createProduct, editProduct } from 'src/api/product';
// locales
import { useTranslate } from 'src/locales';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFUpload,
  RHFTextField,
  RHFLanguageField
} from 'src/components/hook-form';
// utils
import constructFormData from 'src/utils/form-data';

// ----------------------------------------------------------------------

export default function ProductNewEditForm({ currentProduct }) {
  const { t } = useTranslate();

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    images: Yup.array().min(1, t('validation.images.required')),
    price: Yup.number().moreThan(0, t('validation.price.not_zero')),
  });

  const defaultValues = useMemo(
    () => ({
      // name: currentProduct?.name || '',
      // description: currentProduct?.description || '',
      // subDescription: currentProduct?.subDescription || '',
      images: currentProduct?.images || [],
      //
      // code: currentProduct?.code || '',
      // sku: currentProduct?.sku || '',
      // price: currentProduct?.price || 0,
      // quantity: currentProduct?.quantity || 0,
      // priceSale: currentProduct?.priceSale || 0,
      // tags: currentProduct?.tags || [],
      // taxes: currentProduct?.taxes || 0,
      // gender: currentProduct?.gender || '',
      // category: currentProduct?.category || '',
      // colors: currentProduct?.colors || [],
      // sizes: currentProduct?.sizes || [],
      // newLabel: currentProduct?.newLabel || { enabled: false, content: '' },
      // saleLabel: currentProduct?.saleLabel || { enabled: false, content: '' },
      information: {
        bg: {
          title: '',
          short_description: '',
          description: ''
        },
        en: {
          title: '',
          short_description: '',
          description: ''
        }
      }
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const formData = constructFormData(data, [], ['images']);

    try {
      if(currentProduct) {
        await editProduct(currentProduct.id, formData);

        enqueueSnackbar(t('edit-success'));
      }else {
        await createProduct(formData);

        enqueueSnackbar(t('create-success'));
      }

      router.push(paths.dashboard.product.root);
      router.refresh();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
  }, [setValue]);

  const renderDetails = (
    <>
      <Grid xs={12} md={12}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">{t('images')}</Typography>
              <RHFUpload
                multiple
                thumbnail
                name='images'
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">{t('price')}</Typography>
              <RHFTextField
                name='price'
                type='number'
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='start'>
                      <Box component='span' sx={{ color: 'text.disabled' }}>
                        {t('lv.')}
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Stack spacing={1.5}>
              <RHFLanguageField
                name='information'
                langs={[
                  { label: 'Български', slug: 'bg' },
                  { label: 'English', slug: 'en' },
                ]}
                fields={[
                  { type: 'text', name: 'title', label: t('title') },
                  { type: 'text', name: 'short_description', label: t('short_description'), multiline: true, rows: 4 },
                  { type: 'editor', name: 'description', label: t('description') }
                ]}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  // const renderProperties = (
  //   <>
  //     {mdUp && (
  //       <Grid md={4}>
  //         <Typography variant="h6" sx={{ mb: 0.5 }}>
  //           Properties
  //         </Typography>
  //         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
  //           Additional functions and attributes...
  //         </Typography>
  //       </Grid>
  //     )}

  //     <Grid xs={12} md={8}>
  //       <Card>
  //         {!mdUp && <CardHeader title="Properties" />}

  //         <Stack spacing={3} sx={{ p: 3 }}>
  //           <Box
  //             columnGap={2}
  //             rowGap={3}
  //             display="grid"
  //             gridTemplateColumns={{
  //               xs: 'repeat(1, 1fr)',
  //               md: 'repeat(2, 1fr)',
  //             }}
  //           >
  //             <RHFTextField name="code" label="Product Code" />

  //             <RHFTextField name="sku" label="Product SKU" />

  //             <RHFTextField
  //               name="quantity"
  //               label="Quantity"
  //               placeholder="0"
  //               type="number"
  //               InputLabelProps={{ shrink: true }}
  //             />

  //             <RHFSelect native name="category" label="Category" InputLabelProps={{ shrink: true }}>
  //               {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
  //                 <optgroup key={category.group} label={category.group}>
  //                   {category.classify.map((classify) => (
  //                     <option key={classify} value={classify}>
  //                       {classify}
  //                     </option>
  //                   ))}
  //                 </optgroup>
  //               ))}
  //             </RHFSelect>

  //             <RHFMultiSelect
  //               checkbox
  //               name="colors"
  //               label="Colors"
  //               options={PRODUCT_COLOR_NAME_OPTIONS}
  //             />

  //             <RHFMultiSelect checkbox name="sizes" label="Sizes" options={PRODUCT_SIZE_OPTIONS} />
  //           </Box>

  //           <RHFAutocomplete
  //             name="tags"
  //             label="Tags"
  //             placeholder="+ Tags"
  //             multiple
  //             freeSolo
  //             options={_tags.map((option) => option)}
  //             getOptionLabel={(option) => option}
  //             renderOption={(props, option) => (
  //               <li {...props} key={option}>
  //                 {option}
  //               </li>
  //             )}
  //             renderTags={(selected, getTagProps) =>
  //               selected.map((option, index) => (
  //                 <Chip
  //                   {...getTagProps({ index })}
  //                   key={option}
  //                   label={option}
  //                   size="small"
  //                   color="info"
  //                   variant="soft"
  //                 />
  //               ))
  //             }
  //           />

  //           <Stack spacing={1}>
  //             <Typography variant="subtitle2">Gender</Typography>
  //             <RHFMultiCheckbox row name="gender" spacing={2} options={PRODUCT_GENDER_OPTIONS} />
  //           </Stack>

  //           <Divider sx={{ borderStyle: 'dashed' }} />

  //           <Stack direction="row" alignItems="center" spacing={3}>
  //             <RHFSwitch name="saleLabel.enabled" label={null} sx={{ m: 0 }} />
  //             <RHFTextField
  //               name="saleLabel.content"
  //               label="Sale Label"
  //               fullWidth
  //               disabled={!values.saleLabel.enabled}
  //             />
  //           </Stack>

  //           <Stack direction="row" alignItems="center" spacing={3}>
  //             <RHFSwitch name="newLabel.enabled" label={null} sx={{ m: 0 }} />
  //             <RHFTextField
  //               name="newLabel.content"
  //               label="New Label"
  //               fullWidth
  //               disabled={!values.newLabel.enabled}
  //             />
  //           </Stack>
  //         </Stack>
  //       </Card>
  //     </Grid>
  //   </>
  // );

  // const renderPricing = (
  //   <>
  //     {mdUp && (
  //       <Grid md={4}>
  //         <Typography variant="h6" sx={{ mb: 0.5 }}>
  //           Pricing
  //         </Typography>
  //         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
  //           Price related inputs
  //         </Typography>
  //       </Grid>
  //     )}

  //     <Grid xs={12} md={8}>
  //       <Card>
  //         {!mdUp && <CardHeader title="Pricing" />}

  //         <Stack spacing={3} sx={{ p: 3 }}>
  //           <RHFTextField
  //             name="price"
  //             label="Regular Price"
  //             placeholder="0.00"
  //             type="number"
  //             InputLabelProps={{ shrink: true }}
  //             InputProps={{
  //               startAdornment: (
  //                 <InputAdornment position="start">
  //                   <Box component="span" sx={{ color: 'text.disabled' }}>
  //                     $
  //                   </Box>
  //                 </InputAdornment>
  //               ),
  //             }}
  //           />

  //           <RHFTextField
  //             name="priceSale"
  //             label="Sale Price"
  //             placeholder="0.00"
  //             type="number"
  //             InputLabelProps={{ shrink: true }}
  //             InputProps={{
  //               startAdornment: (
  //                 <InputAdornment position="start">
  //                   <Box component="span" sx={{ color: 'text.disabled' }}>
  //                     $
  //                   </Box>
  //                 </InputAdornment>
  //               ),
  //             }}
  //           />

  //           <FormControlLabel
  //             control={<Switch checked={includeTaxes} onChange={handleChangeIncludeTaxes} />}
  //             label="Price includes taxes"
  //           />

  //           {!includeTaxes && (
  //             <RHFTextField
  //               name="taxes"
  //               label="Tax (%)"
  //               placeholder="0.00"
  //               type="number"
  //               InputLabelProps={{ shrink: true }}
  //               InputProps={{
  //                 startAdornment: (
  //                   <InputAdornment position="start">
  //                     <Box component="span" sx={{ color: 'text.disabled' }}>
  //                       %
  //                     </Box>
  //                   </InputAdornment>
  //                 ),
  //               }}
  //             />
  //           )}
  //         </Stack>
  //       </Card>
  //     </Grid>
  //   </>
  // );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label={t('active')}
          sx={{ pl: 3 }}
        />

        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentProduct ? 'Create Product' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {/* {renderProperties}

        {renderPricing} */}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

ProductNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
};
