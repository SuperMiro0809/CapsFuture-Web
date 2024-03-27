import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// locales
import { useTranslate } from 'src/locales';
// utils
import { fData } from 'src/utils/format-number';
import constructFormData from 'src/utils/form-data';
// api
import { createUser, editUser } from 'src/api/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
//
import { ASSETS } from 'src/config-global';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ roles, currentUser }) {
  const { t } = useTranslate();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const password = useBoolean();

  const NewUserSchema = Yup.object().shape({
    first_name: Yup.string().required(t('first_name.required', { ns: 'validation' })),
    last_name: Yup.string().required(t('last_name.required', { ns: 'validation' })),
    email: Yup.string().required(t('email.required', { ns: 'validation' })).email(t('email.valid', { ns: 'validation' })),
    password: Yup.string().required(t('password.required', { ns: 'validation' })),
    // phoneNumber: Yup.string().required('Phone number is required'),
    // address: Yup.string().required('Address is required'),
    // country: Yup.string().required('Country is required'),
    // state: Yup.string().required('State is required'),
    // city: Yup.string().required('City is required'),
    role: Yup.object().required('Role is required'),
    avatar_photo: Yup.mixed().nullable(),
    // not required
    // status: Yup.string(),
    // isVerified: Yup.boolean(),
  });

  const rolesOptions = roles.map((role) => ({ label: role.name, value: role.id }));

  const defaultValues = useMemo(
    () => {

      let roleValue = null;
      if(currentUser?.role_id) {
        roleValue = rolesOptions.find((role) => role.value === currentUser.role_id);
      }

      return {
        first_name: currentUser?.first_name || '',
        last_name: currentUser?.last_name || '',
        email: currentUser?.email || '',
        password: currentUser ? 'password' : '',
        role: roleValue,
        avatar_photo: currentUser?.avatar_photo_path ? { preview: `${ASSETS}/${currentUser.avatar_photo_path}` } : null,
      }
    },
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    const { avatar_photo } = data;
    const values = constructFormData(data);

    values.append('avatar_photo', avatar_photo);

    try {
      if(currentUser) {
        await editUser(currentUser.id, values);
      }else {
        await createUser(values);
      }

      enqueueSnackbar(currentUser ? t('edit-success', { ns: 'messages' }) : t('create-success', { ns: 'messages' }));
      router.push(paths.dashboard.user.root);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatar_photo', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {/* {currentUser && (
              <Label
                color={
                  (values.status === 'active' && 'success') ||
                  (values.status === 'banned' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )} */}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name='avatar_photo'
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant='caption'
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentUser && (
              <FormControlLabel
                labelPlacement='start'
                control={
                  <Controller
                    name='status'
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            {/* <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            /> */}

            {/* {currentUser && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Delete User
                </Button>
              </Stack>
            )} */}
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="first_name" label={t('first-name', { ns: 'forms' })} />

              <RHFTextField name="last_name" label={t('last-name', { ns: 'forms' })} />

              <RHFTextField name="email" label={t('email', { ns: 'forms' })} />

              {!currentUser && (
                <RHFTextField
                  name='password'
                  type={password.value ? 'text' : 'password'}
                  label={t('password', { ns: 'forms' })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={password.onToggle} edge='end'>
                          <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              <RHFAutocomplete
                name='role'
                label={t('role', { ns: 'forms' })}
                options={roles.map((role) => ({ label: role.name, value: role.id }))}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />
            </Box>


            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? t('create', { ns: 'common' }) : t('save', { ns: 'common' })}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  roles: PropTypes.array,
  currentUser: PropTypes.object,
};
