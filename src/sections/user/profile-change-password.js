import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// locales
import { useTranslate } from 'src/locales';
// api
import { changePassword } from 'src/api/auth';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function ProfileChangePassword() {
  const { t } = useTranslate();

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const oldPassword = useBoolean();
  const newPassword = useBoolean();
  const confirmPassword = useBoolean();

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required(t('old-password.required', { ns: 'validation' })),
    newPassword: Yup.string()
      .required(t('password.required', { ns: 'validation' }))
      .min(8, t('password.min', { ns: 'validation' }))
      .test(
        'no-match',
        t('password.different', { ns: 'validation' }),
        (value, { parent }) => value !== parent.oldPassword
      ),
    confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], t('password.no-match', { ns: 'validation' })),
  });

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { error } = await changePassword(user.id, data);

      if (error) throw error;
      
      enqueueSnackbar(t('reset-password-success', { ns: 'messages' }));
    } catch (error) {
      enqueueSnackbar(t(error), { variant: 'error' });
    }
  });

  return (
    <Card>
      <CardHeader title={t('change-password', { ns: 'auth' })} />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFTextField
            name="oldPassword"
            type={oldPassword.value ? 'text' : 'password'}
            label={t('old-password', { ns: 'forms' })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={oldPassword.onToggle} edge="end">
                    <Iconify icon={oldPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <RHFTextField
            name="newPassword"
            label={t('new-password', { ns: 'forms' })}
            type={newPassword.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={newPassword.onToggle} edge="end">
                    <Iconify icon={newPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText={
              <Stack component="span" direction="row" alignItems="center">
                <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} />
                {t('password.min', { ns: 'validation' })}
              </Stack>
            }
          />

          <RHFTextField
            name="confirmPassword"
            type={confirmPassword.value ? 'text' : 'password'}
            label={t('confirm-password', { ns: 'forms' })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={confirmPassword.onToggle} edge="end">
                    <Iconify icon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
            {t('save', { ns: 'common' })}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
