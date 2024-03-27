'use client';

import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// locales
import { useTranslate } from 'src/locales';
// api
import { resetPassword } from 'src/api/auth';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// assets
import { SentIcon } from 'src/assets/icons';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function ResetPasswordView({ token, email }) {
  const { t } = useTranslate();

  const password = useBoolean();

  const [successMsg, setSuccessMsg] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const NewPasswordSchema = Yup.object().shape({
    email: Yup.string().required(t('email.required', { ns: 'validation' })).email(t('email.valid', { ns: 'validation' })),
    password: Yup.string()
      .min(8, t('password.min', { ns: 'validation' }))
      .required(t('password.required', { ns: 'validation' })),
    confirmPassword: Yup.string()
      .required(t('password.required', { ns: 'validation' }))
      .oneOf([Yup.ref('password')], t('password.no-match', { ns: 'validation' })),
  });

  const defaultValues = {
    email,
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(NewPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const values = {
      ...data,
      token
    };

    try {
      const { data, error } = await resetPassword(values);

      if (error) throw error;

      console.log(data)

      setErrorMsg('');
      setSuccessMsg(t('reset-password-success', { ns: 'messages' }));
    } catch (error) {
      setSuccessMsg('');
      setErrorMsg(t(error));
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField
        name="email"
        label={t('email', { ns: 'forms' })}
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
        readOnly
      />

      <RHFTextField
        name="password"
        label={t('password', { ns: 'forms' })}
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <RHFTextField
        name="confirmPassword"
        label={t('confirm-password', { ns: 'forms' })}
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color='primary'
        loading={isSubmitting}
      >
        {t('update-password')}
      </LoadingButton>

      {/* <Typography variant="body2">
        {`Don’t have a code? `}
        <Link
          variant="subtitle2"
          sx={{
            cursor: 'pointer',
          }}
        >
          Resend code
        </Link>
      </Typography> */}

      <Link
        component={RouterLink}
        href={paths.auth.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        {t('to-login', { ns: 'common' })}
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <SentIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">{t('reset-password')}</Typography>

        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          We&apos;ve sent a 6-digit confirmation email to your email.
          <br />
          Please enter the code in below box to verify your email.
        </Typography> */}
      </Stack>
    </>
  );

  const renderMessages = (
    <Stack sx={{ my: 4 }}>
      {successMsg && <Alert severity='success'>{successMsg}</Alert>}

      {errorMsg && <Alert severity='error'>{errorMsg}</Alert>}
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderMessages}

      {renderForm}
    </FormProvider>
  );
}
