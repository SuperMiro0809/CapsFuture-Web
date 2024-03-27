import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FormHelperText from '@mui/material/FormHelperText';
import LoadingButton from '@mui/lab/LoadingButton';
// routes
import { useRouter } from 'src/routes/hooks';
// locales
import { useTranslate } from 'src/locales';
// auth
import { useAuthContext } from 'src/auth/hooks';
// api
import { participate } from 'src/api/campaign';
// components
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFCheckbox } from 'src/components/hook-form';

export default function CampaignParticipateModal({ open, onClose, campaignId }) {
  const { t } = useTranslate();

  const router = useRouter();

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const phoneRegex = /^\+?(\d{1,3})?[-.\s]?\(?(?:\d{1,3})?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;

  const ParticipateSchema = Yup.object().shape({
    phone: Yup.string().required(t('phone.required', { ns: 'validation' })).matches(phoneRegex, t('phone.valid', { ns: 'validation' })),
    //
    caps_handover: Yup.boolean(),
    bottles_handover: Yup.boolean(),
    cans_handover: Yup.boolean(),
    buying_consumables: Yup.boolean(),
    campaign_labeor: Yup.boolean(),
    note: Yup.string()
  }).test(
    'at-least-one-true',
    t('at-least-one-true', { ns: 'validation' }),
    object => object.caps_handover || object.bottles_handover || object.cans_handover || object.buying_consumables || object.campaign_labour
  );

  const defaultValues = {
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
    const values = {
      campaign_id: campaignId,
      user_id: user.id,
      ...data
    };

    try {
      const { error } = await participate(values);

      if (error) throw error;

      enqueueSnackbar(t('participate-success-message', { ns: 'messages' }));
      onClose();
      router.refresh();
    } catch (error) {
      enqueueSnackbar(t(error, { ns: 'messages' }), { variant: 'error' });
    }
  });

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={t('participate-modal.title')}
      maxWidth="sm"
      content={(
        <>
          <Typography variant='body1'>{t('participate-modal.text')}</Typography>
          <Typography variant='subtitle2' sx={{ mt: 2 }}>{t('campaign-participate-provide-information-text')}:</Typography>

          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <RHFTextField
                name='phone'
                label={t('phone', { ns: 'forms' })}
              />

              <Box>
                <Stack spacing={1}>
                  <Typography variant="subtitle2">{t('how-can-you-help')}?</Typography>

                  <Box
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      md: 'repeat(2, 1fr)',
                    }}
                  >
                    <RHFCheckbox name='caps_handover' label={t('caps_handover', { ns: 'forms' })} />
                    <RHFCheckbox name='bottles_handover' label={t('bottles_handover', { ns: 'forms' })} />
                    <RHFCheckbox name='cans_handover' label={t('cans_handover', { ns: 'forms' })} />
                    <RHFCheckbox name='buying_consumables' label={t('buying_consumables', { ns: 'forms' })} />
                    <RHFCheckbox name='campaign_labour' label={t('campaign_labour', { ns: 'forms' })} />
                  </Box>
                </Stack>
                {errors[''] && <FormHelperText error>{errors[''].message}</FormHelperText>}
              </Box>

              <RHFTextField
                name='note'
                label={t('note', { ns: 'forms' })}
                multiline
                rows={3}
              />
            </Stack>
          </FormProvider>
        </>
      )}
      action={
        <LoadingButton
          variant="contained"
          color="primary"
          loading={isSubmitting}
          onClick={onSubmit}
        >
          {t('participate')}
        </LoadingButton>
      }
    />
  );
}

CampaignParticipateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  campaignId: PropTypes.number
};
