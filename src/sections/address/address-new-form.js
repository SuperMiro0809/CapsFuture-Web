import { useEffect, useState, useTransition } from 'react';
import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Unstable_Grid2';
// locales
import { useTranslate } from 'src/locales';
// assets
import { countries } from 'src/assets/data';
// api
import { getCities, getQuarters, getStreets } from 'src/api/econt';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import {
  RHFCheckbox,
  RHFTextField,
  RHFAutocomplete,
  RHFAutocompleteVirtualize
} from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function AddressNewForm({ methods }) {
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const [cities, setCities] = useState([]);

  const [quarters, setQuarters] = useState([]);

  const [streets, setStreets] = useState([]);

  const [isPending, startTransition] = useTransition();

  const {
    watch,
    setValue
  } = methods;

  const values = watch();

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

  return (
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

      {/* <RHFCheckbox name="primary" label={t('use-as-default-address', { ns: 'profile' })} /> */}
    </Stack>
  );
}

AddressNewForm.propTypes = {
  onCreate: PropTypes.func,
  currentAddress: PropTypes.object
};
