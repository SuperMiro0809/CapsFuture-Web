import { useEffect, useState, useTransition } from 'react';
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
// locales
import { useTranslate } from 'src/locales';
// assets
import { countries } from 'src/assets/data';
// api
import { getCities, getQuarters, getStreets } from 'src/api/econt';
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

export default function AddressNewForm({ open, onClose, onCreate }) {
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const [cities, setCities] = useState([]);

  const [quarters, setQuarters] = useState([]);

  const [streets, setStreets] = useState([]);

  const [isPending, startTransition] = useTransition();

  const phoneRegex = /^\+?(\d{1,3})?[-.\s]?\(?(?:\d{1,3})?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;

  const NewAddressSchema = Yup.object().shape({
    name: Yup.string().required(t('validation.name.required')),
    phone: Yup.string().required(t('validation.phone.required')).matches(phoneRegex, t('validation.phone.valid')),
    country: Yup.object().required(t('validation.country.required')),
    city: Yup.object().required(t('validation.city.required')),
    street: Yup.string().required(t('validation.street.required')),
    postCode: Yup.string().required(t('validation.post-code.required')),
    // not required
    quarter: Yup.string(),
    buildingNumber: Yup.string(),
    entrance: Yup.string(),
    floor: Yup.string(),
    apartment: Yup.string(),
    primary: Yup.boolean(),
  });

  const defaultValues = {
    name: '',
    phone: '',
    country: null,
    city: null,
    quarter: '',
    street: '',
    postCode: '',
    primary: true,
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
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
    }
  }, [values.city])

  const onSubmit = handleSubmit(async (data) => {
    try {
      // onCreate({
      //   name: data.name,
      //   phoneNumber: data.phoneNumber,
      //   fullAddress: `${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zipCode}`,
      //   addressType: data.addressType,
      //   primary: data.primary,
      // });
      onClose();
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
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
                name="name"
                label={t('full-name')}
              />

              <RHFTextField
                name="phone"
                label={t('phone')}
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
                label={t('country')}
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
                label={t('city')}
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
                label={t('quarter')}
                options={quarters.map((quarter) => quarter.name)}
                loading={isPending}
              />

              <RHFTextField name="postCode" label={t('post-code')} />
            </Box>

            <Grid container spacing={2}>
              <Grid xs={12} sm={10}>
                <RHFAutocompleteVirtualize
                  name="street"
                  label={t('street')}
                  options={streets.map((quarter) => quarter.name)}
                  loading={isPending}
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
                label={t('building')}
              />

              <RHFTextField
                name="entrance"
                label={t('entrance')}
              />

              <RHFTextField
                name="floor"
                label={t('floor')}
              />

              <RHFTextField
                name="apartment"
                label={t('apartment')}
              />
            </Box>

            <RHFTextField
              name="note"
              label={t('note')}
              multiline
              rows={3}
            />

            <RHFCheckbox name="primary" label={t('use-as-default-address')} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            {t('cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" color='primary' loading={isSubmitting}>
            {t('create')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

AddressNewForm.propTypes = {
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  open: PropTypes.bool,
};
