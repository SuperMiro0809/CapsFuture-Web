import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase';
// rotes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// locales
import { useTranslate } from 'src/locales';
// api
import { createLocation, editLocation } from 'src/api/location';
import { reverseGeocode } from 'src/api/google-maps';
//
import { Controller } from 'react-hook-form';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFSwitch,
  RHFLocationSelectorField,
  RHFAutocomplete
} from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

export default function StationLocationsNewEditForm({ currentLocation, locationTypes, users }) {
  const { t } = useTranslate();

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const phoneRegex = /^\+?(\d{1,3})?[-.\s]?\(?(?:\d{1,3})?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;

  const NewBlogSchema = Yup.object().shape({
    type: Yup.number().required(t('type.required', { ns: 'validation' })),
    name: Yup.string().required(t('name.required', { ns: 'validation' })),
    working_time: Yup.string().when('type', {
      is: (type) => type === 2,
      then: () => Yup.string().required(t('working-time.required', { ns: 'validation' })),
      otherwise: () => Yup.string().notRequired(),
    }),
    location: Yup.object().required(t('location.required', { ns: 'validation' })),
    phone: Yup.string().required(t('phone.required', { ns: 'validation' })).matches(phoneRegex, t('phone.valid', { ns: 'validation' })),
    user_type: Yup.number().required(),
    user: Yup.object().when('user_type', {
      is: (user_type) => user_type === 0,
      then: () => Yup.object().required(t('user.required', { ns: 'validation' })),
      otherwise: () => Yup.object().notRequired(),
    }),
    first_name: Yup.string().when('user_type', {
      is: (user_type) => user_type === 1,
      then: () => Yup.string().required(t('first-name.required', { ns: 'validation' })),
      otherwise: () => Yup.string().notRequired(),
    }),
    last_name: Yup.string().when('user_type', {
      is: (user_type) => user_type === 1,
      then: () => Yup.string().required(t('last-name.required', { ns: 'validation' })),
      otherwise: () => Yup.string().notRequired(),
    }),
    email: Yup.string().when('user_type', {
      is: (user_type) => user_type === 1,
      then: () => Yup.string().email(t('email.valid', { ns: 'validation' })).required(t('email.required', { ns: 'validation' })),
      otherwise: () => Yup.string().notRequired(),
    }),
  });

  const locationTypesOptions = locationTypes.map((type) => (
    {
      value: type.id,
      label: t(type.display_name),
      icon: (type.name === 'heart' && <SvgColor src='/assets/icons/map/ic_heart.svg' sx={{ width: 64, height: 64, mb: 2 }} />) ||
        (type.name === 'station' && <SvgColor src='/assets/icons/map/ic_station.svg' sx={{ width: 64, height: 64, mb: 2 }} />)
    }
  ));

  const userOptions = users.map((user) => ({ label: `${user.first_name || '-'} ${user.last_name || '-'}, ${user.email}`, value: user.id }));

  const defaultValues = useMemo(
    () => {

      let locationValue = null;
      let userValue = null;

      if (currentLocation) {
        locationValue = {
          lat: currentLocation.latitude,
          lng: currentLocation.longitude
        }

        userValue = userOptions.find((u) => u.value === currentLocation.user_id);
      }

      return {
        type: currentLocation?.type_id || 1,
        name: currentLocation?.name || '',
        working_time: currentLocation?.working_time || '',
        collects_caps: currentLocation?.collects_caps || 0,
        collects_bottles: currentLocation?.collects_bottles || 0,
        collects_cans: currentLocation?.collects_cans || 0,
        location: locationValue,
        phone: currentLocation?.phone || '',
        first_name: currentLocation?.first_name || '',
        last_name: currentLocation?.last_name || '',
        email: currentLocation?.email || '',
        user: userValue,
        user_type: currentLocation?.information.user ? 0 : 1,
        active: currentLocation?.active || false,
      }
    },
    [currentLocation]
  );

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    control,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentLocation) {
      reset(defaultValues);
    }
  }, [currentLocation, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const { location } = data;

    try {
      const addressBg = await reverseGeocode(location.lat, location.lng, 'bg');
      const addressEn = await reverseGeocode(location.lat, location.lng, 'en');

      const reqData = {
        ...data,
        address_bg: addressBg,
        address_en: addressEn
      };

      if (currentLocation) {
        const { error } = await editLocation(currentLocation.id, reqData);

        if (error) throw error;

        enqueueSnackbar(t('update-success', { ns: 'messages' }));
      } else {
        const { error } = await createLocation(reqData);

        if (error) throw error;

        enqueueSnackbar(t('create-success', { ns: 'messages' }));
      }

      router.push(paths.dashboard.station.locations.root);
      router.refresh();
    } catch (error) {
      const message = typeof error === 'object' ? error.message : error;
      enqueueSnackbar(message, { variant: 'error' });
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {t('details', { ns: 'common' })}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('details-subtext', { ns: 'common' })}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title={t('details', { ns: 'common' })} />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant='subtitle2'>{t('type', { ns: 'forms' })}</Typography>
              <Controller
                name='type'
                control={control}
                render={({ field }) => (
                  <Box gap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
                    {locationTypesOptions.map((item) => (
                      <Paper
                        component={ButtonBase}
                        variant="outlined"
                        key={item.label}
                        onClick={() => field.onChange(item.value)}
                        sx={{
                          p: 2.5,
                          borderRadius: 1,
                          typography: 'subtitle2',
                          flexDirection: 'column',
                          color: 'gray',
                          stroke: 'red',
                          ...(item.value === field.value && {
                            borderWidth: 2,
                            color: 'primary.main',
                            borderColor: 'primary.main',
                          }),
                        }}
                      >
                        {item.icon}
                        {item.label}
                      </Paper>
                    ))}
                  </Box>
                )}
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">{t('name', { ns: 'forms' })}</Typography>
              <RHFTextField name='name' />
            </Stack>

            {values.type === 2 && (
              <>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">{t('working-time', { ns: 'forms' })}</Typography>
                  <RHFTextField name='working_time' />
                </Stack>

                <Stack spacing={1.5}>
                  <Typography variant='subtitle2'>{t('collects', { ns: 'forms' })}</Typography>
                  <Box gap={2} display="grid" gridTemplateColumns="repeat(3, 1fr)">
                    {[
                      {
                        name: 'collects_caps',
                        label: t('caps', { ns: 'common' }),
                        icon: <SvgColor src='/assets/icons/app/bottle_cap.svg' sx={{ width: 42, height: 42, mb: 2 }} />,

                      },
                      {
                        name: 'collects_bottles',
                        label: t('bottles', { ns: 'common' }),
                        icon: <Iconify icon="solar:bottle-bold-duotone" width={42} height={42} sx={{ mb: 2 }} />,
                      },
                      {
                        name: 'collects_cans',
                        label: t('cans', { ns: 'common' }),
                        icon: <Iconify icon="pepicons-print:can" width={42} height={42} sx={{ mb: 2 }} />,
                      }
                    ].map((item) => (
                      <Controller
                        name={item.name}
                        control={control}
                        key={item.label}
                        render={({ field }) => (
                          <Paper
                            component={ButtonBase}
                            variant="outlined"
                            onClick={() => field.onChange(!field.value)}
                            sx={{
                              p: 2.5,
                              borderRadius: 1,
                              typography: 'subtitle2',
                              flexDirection: 'column',
                              color: 'gray',
                              ...(field.value && {
                                borderWidth: 2,
                                color: 'primary.main',
                                borderColor: 'primary.main',
                              }),
                            }}
                          >
                            {item.icon}
                            {item.label}
                          </Paper>
                        )}
                      />
                    ))}
                  </Box>
                </Stack>
              </>
            )}

          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderLocation = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {t('location', { ns: 'forms' })}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('subtext', { ns: 'location' })}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title={t('location', { ns: 'forms' })} />}

          <Stack spacing={1.5} sx={{ p: 3 }}>
            <RHFLocationSelectorField
              name='location'
              placeholder={t('enter-address', { ns: 'location' })}
              iconName={values.type === 1 ? 'heartIcon' : 'stationIcon'}
              helperText={t('enter-address-or-choose-on-map', { ns: 'location' })}
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderManager = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {t('manager', { ns: 'location' })}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('manager-subtext', { ns: 'location' })}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title={t('manager', { ns: 'location' })} />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant='subtitle2'>{t('type', { ns: 'forms' })}</Typography>
              <Box gap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
                {[
                  {
                    label: t('registered-user', { ns: 'auth' }),
                    icon: <Iconify icon="mingcute:user-follow-2-fill" width={42} height={42} sx={{ mb: 2 }} />,
                    value: 0,
                  },
                  {
                    label: t('new-user', { ns: 'profile' }),
                    icon: <Iconify icon="mingcute:user-add-2-fill" width={42} height={42} sx={{ mb: 2 }} />,
                    value: 1
                  }
                ].map((item) => (
                  <Controller
                    key={item.value}
                    name='user_type'
                    control={control}
                    render={({ field }) => (
                      <Paper
                        component={ButtonBase}
                        variant="outlined"
                        onClick={() => {
                          field.onChange(item.value);

                          if (item.value === 0) {
                            setValue('first_name', '');
                            setValue('last_name', '');
                            setValue('email', '');
                          } else {
                            setValue('user_id', null);
                          }
                        }}
                        sx={{
                          p: 2.5,
                          borderRadius: 1,
                          typography: 'subtitle2',
                          flexDirection: 'column',
                          color: 'gray',
                          ...(field.value === item.value && {
                            borderWidth: 2,
                            color: 'primary.main',
                            borderColor: 'primary.main',
                          }),
                        }}
                      >
                        {item.icon}
                        {item.label}
                      </Paper>
                    )}
                  />
                ))}
              </Box>
            </Stack>

            {values.user_type === 0 && (
              <Stack spacing={1.5}>
                <Typography variant="subtitle2">{t('user', { ns: 'forms' })}</Typography>
                <RHFAutocomplete
                  name='user'
                  options={userOptions}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                />
              </Stack>
            )}

            {values.user_type === 1 && (
              <>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">{t('first-name', { ns: 'forms' })}</Typography>
                  <RHFTextField name='first_name' />
                </Stack>

                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">{t('last-name', { ns: 'forms' })}</Typography>
                  <RHFTextField name='last_name' />
                </Stack>

                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">{t('email', { ns: 'forms' })}</Typography>
                  <RHFTextField name='email' />
                </Stack>
              </>
            )}

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">{t('phone', { ns: 'forms' })}</Typography>
              <RHFTextField
                name='phone'
                placeholder='+359 888 888 888 / 0888 888 888'
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <RHFSwitch
            name='active'
            label={t('active', { ns: 'forms' })}
            sx={{ pl: 3 }}
          />
        </Box>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentLocation ? t('create', { ns: 'common' }) : t('save', { ns: 'common' })}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderLocation}

        {renderManager}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

StationLocationsNewEditForm.propTypes = {
  currentLocation: PropTypes.object,
  locationTypes: PropTypes.array,
  users: PropTypes.array
};
