'use client'

import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import LoadingButton from '@mui/lab/LoadingButton';
// locales
import { useTranslate } from 'src/locales';
// api
import { participate } from 'src/api/campaign';
// components
import FormProvider, { RHFTextField, RHFCheckbox } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CampaignParticipateForm({ slug }) {
  const { t } = useTranslate();

  const [successMsg, setSuccessMsg] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const [step, setStep] = useState(1);

  const phoneRegex = /^\+?(\d{1,3})?[-.\s]?\(?(?:\d{1,3})?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;

  const ParticipateSchema = Yup.object().shape({
    firstName: Yup.string().required(t('first-name.required', { ns: 'validation' })),
    lastName: Yup.string().required(t('last-name.required', { ns: 'validation' })),
    email: Yup.string().required(t('email.required', { ns: 'validation' })).email(t('email.valid', { ns: 'validation' })),
    phone: Yup.string().required(t('phone.required', { ns: 'validation' })).matches(phoneRegex, t('phone.valid', { ns: 'validation' })),
    //
    caps_handover: Yup.boolean(),
    bottles_handover: Yup.boolean(),
    cans_handover: Yup.boolean(),
    buying_consumables: Yup.boolean(),
    campaign_labour: Yup.boolean(),
    note: Yup.string()
  }).test(
    'at-least-one-true',
    t('at-least-one-true', { ns: 'validation' }),
    object => object.caps_handover || object.bottles_handover || object.cans_handover || object.buying_consumables || object.campaign_labour
  );

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    caps_handover: false,
    bottles_handover: false,
    cans_handover: false,
    buying_consumables: false,
    campaign_labour: false,
    note: ''
  };

  const methods = useForm({
    resolver: yupResolver(ParticipateSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const values = { campaign_id: slug, ...data };

    try {
      const { error } = await participate(values);

      if (error) throw error;

      setErrorMsg('');
      setSuccessMsg(t('participate-success-message', { ns: 'messages' }));
    } catch (error) {
      setErrorMsg(t(error));
      setSuccessMsg('');
    }
  });

  const renderHead = (
    <Stack spacing={1} sx={{ mb: 5 }}>
      <Typography variant="h4">{t('participate-apply-title', { ns: 'campaign' })}</Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <Alert severity='warning'>{t('participate-warning-message', { ns: 'messages' })}</Alert>

      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      {!!successMsg && <Alert severity="success">{successMsg}</Alert>}

      {step === 1 && (
        <>
          <Box gap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
            <RHFTextField
              name="firstName"
              label={t('first-name', { ns: 'forms' })}
              sx={{ backgroundColor: (theme) => theme.palette.background.pink, borderRadius: 2 }}
            />

            <RHFTextField
              name="lastName"
              label={t('last-name', { ns: 'forms' })}
              sx={{ backgroundColor: (theme) => theme.palette.background.pink, borderRadius: 2 }}
            />

            <RHFTextField
              name="email"
              label={t('email', { ns: 'forms' })}
              sx={{ backgroundColor: (theme) => theme.palette.background.pink, borderRadius: 2 }}
            />

            <RHFTextField
              name="phone"
              label={t('phone', { ns: 'forms' })}
              sx={{ backgroundColor: (theme) => theme.palette.background.pink, borderRadius: 2 }}
            />
          </Box>

          <Button
            color='secondary'
            variant='contained'
            size='large'
            onClick={() => setStep(2)}
          >
            {t('forward', { ns: 'common' })}
          </Button>
        </>
      )}

      {step === 2 && (
        <Stack spacing={2}>
          <Box>
            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('how-can-you-help', { ns: 'campaign' })}?</Typography>

              <Box
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
              >
                <RHFCheckbox name='caps_handover' label={t('caps_handover')} />
                <RHFCheckbox name='bottles_handover' label={t('bottles_handover')} />
                <RHFCheckbox name='cans_handover' label={t('cans_handover')} />
                <RHFCheckbox name='buying_consumables' label={t('buying_consumables')} />
                <RHFCheckbox name='campaign_labour' label={t('campaign_labour')} />
              </Box>
            </Stack>
            {errors[''] && <FormHelperText error>{errors[''].message}</FormHelperText>}
          </Box>

          <RHFTextField
            name='note'
            label={t('note', { ns: 'forms' })}
            multiline
            rows={3}
            sx={{ backgroundColor: (theme) => theme.palette.background.pink, borderRadius: 2 }}
          />

          <Stack direction='row' justifyContent='space-between'>
            <Button
              variant='text'
              size='large'
              onClick={() => setStep(1)}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            >
              {t('back', { ns: 'common' })}
            </Button>

            <LoadingButton
              fullWidth
              color="primary"
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{ maxWidth: 200 }}
            >
              {t('participate', { ns: 'campaign' })}!
            </LoadingButton>
          </Stack>
        </Stack>
      )}
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {step === 1 && renderHead}

      {renderForm}
    </FormProvider>
  );
}

CampaignParticipateForm.propTypes = {
  slug: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
