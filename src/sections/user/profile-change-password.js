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
    oldPassword: Yup.string().required(t('validation.old-password.required')),
    newPassword: Yup.string()
      .required(t('validation.password.required'))
      .min(8, t('validation.password.min'))
      .test(
        'no-match',
        t('validation.password.different'),
        (value, { parent }) => value !== parent.oldPassword
      ),
    confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], t('validation.password.no-match')),
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
      
      enqueueSnackbar(t('reset-password-success'));
    } catch (error) {
      enqueueSnackbar(t(error), { variant: 'error' });
    }
  });

  return (
    <Card>
      <CardHeader title={t('change-password')} />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFTextField
            name="oldPassword"
            type={oldPassword.value ? 'text' : 'password'}
            label={t('old-password')}
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
            label={t('new-password')}
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
                {t('validation.password.min')}
              </Stack>
            }
          />

          <RHFTextField
            name="confirmPassword"
            type={confirmPassword.value ? 'text' : 'password'}
            label={t('confirm-password')}
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
            {t('save')}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
