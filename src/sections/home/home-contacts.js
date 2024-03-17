import { m } from 'framer-motion';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Mail';
import LoadingButton from '@mui/lab/LoadingButton';
// locales
import { useTranslate } from 'src/locales';
// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { varFade, MotionViewport } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
//
import { textGradient } from 'src/theme/css';
import { contactUsMail } from 'src/api/mail';

// ----------------------------------------------------------------------

const StyledTextGradient = styled(m.h2)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.light} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.light} 75%, ${theme.palette.primary.main} 100%`
  ),
  padding: 0,
  marginTop: 8,
  lineHeight: 1.15,
  fontWeight: 900,
  marginBottom: 24,
  letterSpacing: 8,
  textAlign: 'center',
  backgroundSize: '400%',
  fontSize: `${40 / 16}rem`,
  fontFamily: theme.typography.fontSecondaryFamily,
  [theme.breakpoints.up('md')]: {
    fontSize: `${64 / 16}rem`,
  },
}));

// ----------------------------------------------------------------------

export default function HomeContacts() {
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  // iloveyou<3

  const ContactUsSchema = Yup.object().shape({
    email: Yup.string().required(t('validation.email.required')).email(t('validation.email.valid')),
    subject: Yup.string().required(t('validation.subject.required')),
    message: Yup.string().required(t('validation.message.required'))
  });

  const defaultValues = {
    email: '',
    subject: '',
    message: ''
  };

  const methods = useForm({
    resolver: yupResolver(ContactUsSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { error } = await contactUsMail(data);

      if (error) throw error;

      enqueueSnackbar(t('email-sent-success'))
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  });

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
        maxWidth: '1400px !important'
      }}
    >
      <Stack
        spacing={3}
        sx={{
          textAlign: 'center',
          mb: { xs: 5, md: 15 },
        }}
      >
        <m.div variants={varFade().inUp}>
          <StyledTextGradient
            animate={{ backgroundPosition: '200% center' }}
            transition={{
              repeatType: 'reverse',
              ease: 'linear',
              duration: 20,
              repeat: Infinity,
            }}
          >
            {t('contact-us')}
          </StyledTextGradient>
        </m.div>
      </Stack>

      <Grid container spacing={8} justifyContent='space-between' alignItems='center'>
        <Grid xs={12} md={6}>
          <m.div variants={varFade().inLeft}>
            <Stack spacing={3}>
              <Typography variant='h4'>{t('we-love-hear-from-you')}!</Typography>
              <Typography variant='body1'>{t('contact-us-text')}</Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <PhoneIcon color='primary' />
                <Typography variant='body1'>087 600 4708</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <MailIcon color='primary' />
                <Typography variant='body1'>kapachkibg@gmail.com</Typography>
              </Box>
            </Stack>
          </m.div>
        </Grid>
        <Grid xs={12} md={6}>
          <m.div variants={varFade().inRight}>
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <Stack spacing={3}>
                <RHFTextField
                  name='email'
                  label={t('email')}
                  fullWidth
                />

                <RHFTextField
                  name='subject'
                  label={t('subject')}
                  fullWidth
                />

                <RHFTextField
                  name='message'
                  label={t('message')}
                  rows={3}
                  fullWidth
                  multiline
                />

                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color='secondary'
                  loading={isSubmitting}
                >
                  {t('send')}
                </LoadingButton>
              </Stack>
            </FormProvider>
          </m.div>
        </Grid>
      </Grid>
    </Container>
  );
}

