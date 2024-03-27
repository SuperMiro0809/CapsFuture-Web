import { useEffect, useState, useTransition, useMemo } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Unstable_Grid2';
import FormHelperText from '@mui/material/FormHelperText';
// locales
import { useTranslate } from 'src/locales';
// assets
import { countries } from 'src/assets/data';
// api
import { getCities, getQuarters, getStreets } from 'src/api/econt';
import { createAddress, editAddress } from 'src/api/user';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFCheckbox,
  RHFTextField,
  RHFAutocomplete,
  RHFAutocompleteVirtualize
} from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function AddressNewForm({ open, onClose, loadAddresses, currentAddress }) {
  const { t } = useTranslate();

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const [cities, setCities] = useState([]);

  const [quarters, setQuarters] = useState([]);

  const [streets, setStreets] = useState([]);

  const [isPending, startTransition] = useTransition();

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
    apartment: Yup.string(),
    primary: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => {

      return {
        fullName: currentAddress?.full_name || user.profile.display_name,
        phone: currentAddress?.phone || '',
        country: currentAddress?.country && currentAddress?.country_code ? { label: currentAddress.country, value: currentAddress.country_code } : null,
        city: currentAddress?.city && currentAddress?.econt_city_id ? { label: currentAddress.city, value: currentAddress.econt_city_id } : null,
        quarter: currentAddress?.quarter || null,
        street: currentAddress?.street || null,
        streetNumber: currentAddress?.street_number || '',
        postCode: currentAddress?.post_code || '',
        buildingNumber: currentAddress?.building_number || '',
        entrance: currentAddress?.entrance || '',
        floor: currentAddress?.floor || '',
        apartment: currentAddress?.apartment || '',
        note: currentAddress?.note || '',
        primary: currentAddress ? currentAddress.primary : true,
      }
    },
    [currentAddress]
  )

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
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
    if (currentAddress) {
      reset(defaultValues);
    } else {
      reset(defaultValues);
    }
  }, [currentAddress, defaultValues, reset]);

  useEffect(() => {
    console.log(values.country)
    if (values.country) {
      startTransition(async () => {
        try {
          const { data, error } = await getCities(values.country.value);

          if (error) throw error;

          setCities(data.cities);
        } catch (error) {
          enqueueSnackbar(error, { variant: 'error' });
        }
      });
    } else {
      setValue('city', null);
    }
  }, [values.country]);

  useEffect(() => {
    if (values.city) {
      startTransition(async () => {
        try {
          const { data: quartersData, error: quartersError } = await getQuarters(values.city.value);

          if (quartersError) throw quartersError;

          const { data: streetsData, error: streetsError } = await getStreets(values.city.value);

          if (streetsError) throw streetsError;

          setQuarters(quartersData.quarters);

          setStreets(streetsData.streets);
        } catch (error) {
          enqueueSnackbar(error, { variant: 'error' });
        }
      });
    } else {
      setValue('quarter', null);
      setValue('street', null);
    }
  }, [values.city])

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentAddress) {
        const { error } = await editAddress(user?.profile.id, currentAddress.id, data);

        if (error) throw error;
      } else {
        const { error } = await createAddress(user?.profile.id, data);

        if (error) throw error;
      }

      enqueueSnackbar(t('add-success'));
      reset();
      onClose();
      loadAddresses();
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  });

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{t('new-address')}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
              sx={{ mt: 1 }}
            >
              <RHFTextField
                name="fullName"
                label={t('full-name', { ns: 'forms' })}
              />

              <RHFTextField
                name="phone"
                label={t('phone', { ns: 'forms' })}
              />
            </Box>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFAutocomplete
                name="country"
                label={t('country', { ns: 'forms' })}
                options={countries.filter((country) => country.code === 'BG').map((country) => ({ label: country.label, value: country.code }))}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderOption={(props, option) => {
                  const { code, label } = countries.filter(
                    (country) => country.label === option.label
                  )[0];

                  if (!label) {
                    return null;
                  }

                  return (
                    <li {...props} key={label}>
                      <Iconify
                        key={label}
                        icon={`circle-flags:${code.toLowerCase()}`}
                        width={28}
                        sx={{ mr: 1 }}
                      />
                      {label} ({code})
                    </li>
                  );
                }}
              />

              <RHFAutocompleteVirtualize
                name="city"
                label={t('city', { ns: 'forms' })}
                options={cities.map((city) => ({ label: city.name, value: city.id }))}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                loading={isPending}
              />
            </Box>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFAutocompleteVirtualize
                name="quarter"
                label={t('quarter', { ns: 'forms' })}
                options={quarters.map((quarter) => quarter.name)}
                isOptionEqualToValue={(option, value) => option === value}
                loading={isPending}
              />

              <RHFTextField name="postCode" label={t('post-code', { ns: 'forms' })} />
            </Box>

            <Grid container spacing={2}>
              <Grid xs={12} sm={10}>
                <RHFAutocompleteVirtualize
                  name="street"
                  label={t('street', { ns: 'forms' })}
                  options={streets.map((quarter) => quarter.name)}
                  isOptionEqualToValue={(option, value) => option === value}
                  loading={isPending}
                  freeSolo={!!values.street}
                  autoSelect
                />
              </Grid>
              <Grid xs={12} sm={2}>
                <RHFTextField
                  name="streetNumber"
                  label="№"
                />
              </Grid>
            </Grid>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(4, 1fr)',
              }}
            >
              <RHFTextField
                name="buildingNumber"
                label={t('building', { ns: 'forms' })}
              />

              <RHFTextField
                name="entrance"
                label={t('entrance', { ns: 'forms' })}
              />

              <RHFTextField
                name="floor"
                label={t('floor', { ns: 'forms' })}
              />

              <RHFTextField
                name="apartment"
                label={t('apartment', { ns: 'forms' })}
              />
            </Box>

            <RHFTextField
              name="note"
              label={t('note', { ns: 'forms' })}
              multiline
              rows={3}
            />

            <RHFCheckbox name="primary" label={t('use-as-default-address')} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            {t('cancel', { ns: 'common' })}
          </Button>

          <LoadingButton type="submit" variant="contained" color='primary' loading={isSubmitting}>
            {t('create', { ns: 'common' })}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

AddressNewForm.propTypes = {
  onClose: PropTypes.func,
  loadAddresses: PropTypes.func,
  open: PropTypes.bool,
  currentAddress: PropTypes.object
};
