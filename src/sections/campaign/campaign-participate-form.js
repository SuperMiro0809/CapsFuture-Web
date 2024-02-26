'use client'

import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
// routes
import { useRouter } from 'src/routes/hooks';
// locales
import { useTranslate } from 'src/locales';
// api
import { participate } from 'src/api/campaign';
// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function CampaignParticipateForm({ slug }) {
  const { t } = useTranslate();

  const [successMsg, setSuccessMsg] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const phoneRegex = /^\+?(\d{1,3})?[-.\s]?\(?(?:\d{1,3})?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;

  const ParticipateSchema = Yup.object().shape({
    firstName: Yup.string().required(t('validation.first-name.required')),
    lastName: Yup.string().required(t('validation.last-name.required')),
    email: Yup.string().required(t('validation.email.required')).email(t('validation.email.valid')),
    phone: Yup.string().required(t('validation.phone.required')).matches(phoneRegex, t('validation.phone.valid'))
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  };

  const methods = useForm({
    resolver: yupResolver(ParticipateSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const values = { campaign_id: slug, ...data };

    try {
      const { error } = await participate(values);

      if (error) throw error;

      setErrorMsg('');
      setSuccessMsg(t('participate-success-message'));
    } catch (error) {
      setErrorMsg(t(error));
      setSuccessMsg('');
    }
  });

  const renderHead = (
    <Stack spacing={1} sx={{ mb: 5 }}>
      <Typography variant="h4">{t('participate-apply-title')}</Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <Alert severity='warning'>{t('participate-warning-message')}</Alert>

      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      {!!successMsg && <Alert severity="success">{successMsg}</Alert>}

      <Box gap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
        <RHFTextField
          name="firstName"
          label={t('first-name')}
          sx={{ backgroundColor: (theme) => theme.palette.background.pink, borderRadius: 2 }}
        />

        <RHFTextField
          name="lastName"
          label={t('last-name')}
          sx={{ backgroundColor: (theme) => theme.palette.background.pink, borderRadius: 2 }}
        />

        <RHFTextField
          name="email"
          label={t('email')}
          sx={{ backgroundColor: (theme) => theme.palette.background.pink, borderRadius: 2 }}
        />

        <RHFTextField
          name="phone"
          label={t('phone')}
          sx={{ backgroundColor: (theme) => theme.palette.background.pink, borderRadius: 2 }}
        />
      </Box>

      <LoadingButton
        fullWidth
        color="secondary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('participate')}
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}

CampaignParticipateForm.propTypes = {
  slug: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
