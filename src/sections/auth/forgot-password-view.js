'use client';

import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// api
import { forgotPassword } from 'src/api/auth';
// locales
import { useTranslate } from 'src/locales';
// assets
import { PasswordIcon } from 'src/assets/icons';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function ForgotPasswordView() {
  const { t } = useTranslate();

  const [successMsg, setSuccessMsg] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { error } = await forgotPassword(data);

      if (error) throw error;
      
      setErrorMsg('');
      setSuccessMsg(t('forgot-password-email-sent'));
    } catch (error) {
      setSuccessMsg('');
      setErrorMsg(t(error));
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField name="email" label={t('email')} />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color='primary'
        loading={isSubmitting}
      >
        {t('send')}
      </LoadingButton>

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
        {t('to-login')}
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">{t('forgot-password')}?</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('forgot-password-text')}
        </Typography>
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
