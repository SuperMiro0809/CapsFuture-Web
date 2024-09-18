'use client';

import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useMemo, useRef } from 'react';
// @mui
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import LoadingButton from '@mui/lab/LoadingButton';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// api
import { createManyFaqs, deleteManyFaqs, editManyFaqs } from 'src/api/faq';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFDraggableField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
// locales
import { useTranslate } from 'src/locales';
// utils
import { getItemsForAddDeleteEdit } from 'src/utils/form';
//
import FaqsDashboardPreview from '../faqs-dashboard-preview';

// ----------------------------------------------------------------------

export default function FaqsDashboardView({ currentFaqs }) {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const submitRef = useRef(null);

  const preview = useBoolean();

  const [isSubmitVisible, setIsSubmitVisible] = useState(false);

  const NewFaqSchema = Yup.object().shape({
    faqs: Yup.array().of(Yup.object().shape({
      information: Yup.object().shape({
        bg: Yup.object().shape({
          title: Yup.string().required(t('title.required', { ns: 'validation' })),
          description: Yup.string().required(t('description.required', { ns: 'validation' }))
        }),
        en: Yup.object().shape({
          title: Yup.string().required(t('title.required', { ns: 'validation' })),
          description: Yup.string().required(t('description.required', { ns: 'validation' }))
        })
      }),
    })).min(1, t('faqs.min', { ns: 'validation', value: 1 }))

  });

  const defaultValues = useMemo(
    () => {
      let faqsValue = [];

      if (currentFaqs.length > 0) {
        faqsValue = currentFaqs.map((el) => {
          const informationValue = {};

          el.translations.forEach((translation) => {
            informationValue[translation.language] = {
              id: translation.id,
              title: translation.title,
              description: translation.description
            }
          });

          return {
            id: el.id,
            order: el.order,
            information: informationValue
          }
        })
          .sort((a, b) => a.order - b.order)
      }

      return {
        faqs: faqsValue
      };
    },
    [currentFaqs]
  );


  const methods = useForm({
    resolver: yupResolver(NewFaqSchema),
    defaultValues
  });

  const initialFaqsIds = currentFaqs.map((faq) => faq.id);

  const {
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid }
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentFaqs) {
      reset(defaultValues);
    }
  }, [currentFaqs, defaultValues, reset]);

  useEffect(() => {
    const handleScroll = () => {
      if (submitRef.current) {
        const rect = submitRef.current.getBoundingClientRect();
        const isVisible = (
          rect.bottom >= 0 &&
          rect.left >= 0 &&
          rect.top <= (window.innerHeight || document.documentElement.clientHeight) && // top is bigger than screen height => isVissible = false
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
        setIsSubmitVisible(isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check on component mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    const { faqs } = data;

    const { itemsForAdd: faqs_for_add, itemsForEdit: faqs_for_edit, itemsForDelete: faqs_for_delete } = getItemsForAddDeleteEdit(initialFaqsIds, faqs);

    try {
      if (faqs_for_add.length > 0) {
        const reqData = { faqs: faqs_for_add };
        const res = await createManyFaqs(reqData);

        if (res?.error) throw res.error;
      }

      if (faqs_for_edit.length > 0) {
        const reqData = { faqs: faqs_for_edit };
        const res = await editManyFaqs(reqData);

        if (res?.error) throw res.error;
      }

      if (faqs_for_delete.length > 0) {
        const res = await deleteManyFaqs(faqs_for_delete);

        if (res?.error) throw res.error;
      }

      enqueueSnackbar(t('save-success', { ns: 'messages' }));
      router.refresh();
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  });

  const renderActions = (
    <>
      <Stack spacing={2} direction='row' justifyContent='flex-end' sx={{ mt: 3 }}>
        <Button
          color='inherit'
          variant='outlined'
          size='large'
          onClick={preview.onTrue}
        >
          {t('preview', { ns: 'common' })}
        </Button>

        <LoadingButton
          ref={submitRef}
          type='submit'
          variant='contained'
          size='large'
          loading={isSubmitting}
        >
          {t('save', { ns: 'common' })}
        </LoadingButton>
      </Stack>

      {!isSubmitVisible && (
        <Slide
          direction="up"
          in={!isSubmitVisible}
          mountOnEnter
          unmountOnExit
          timeout={{
            enter: 500,
            exit: 500
          }}
        >
          <Paper
            elevation={5}
            sx={{
              position: 'fixed',
              bottom: 50,
              left: '50%',
              transform: 'translateX(-50%)',
              px: 3,
              py: 1,
              borderRadius: 2
            }}
          >
            <Stack spacing={2} direction='row'>
              <Button
                color='secondary'
                startIcon={<Iconify icon="solar:eye-bold" />}
                onClick={preview.onTrue}
              >
                {t('preview', { ns: 'common' })}
              </Button>

              <LoadingButton
                type='submit'
                color='primary'
                startIcon={<Iconify icon="charm:tick" />}
                loading={isSubmitting}
              >
                {t('save', { ns: 'common' })}
              </LoadingButton>
            </Stack>
          </Paper>
        </Slide>
      )}
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ position: 'relative' }}>
      <CustomBreadcrumbs
        heading={t('faq', { ns: 'help' })}
        links={[
          { name: t('dashboard', { ns: 'headers' }), href: paths.dashboard.root },
          { name: t('faq', { ns: 'help' }) }
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card>
          <CardHeader
            title={t('dashboard-card.header', { ns: 'faq' })}
            subheader={t('dashboard-card.subheader', { ns: 'faq' })}
            sx={{
              pb: 2,
              mb: 1,
              bgcolor: 'primary.lighter',
              color: 'primary.darker',
              '& .MuiCardHeader-subheader': {
                color: 'inherit',
              },
            }}
          />

          <CardContent>
            <Stack spacing={3} sx={{ position: 'relative' }}>
              <RHFDraggableField
                variant="form"
                name="faqs"
                buttonLabel={t('new', { ns: 'faq' })}
                showElementOrder
                fieldOptions={[
                  {
                    key: 'information',
                    type: 'language-field',
                    langs: [
                      { label: 'Български', slug: 'bg' },
                      { label: 'English', slug: 'en' },
                    ],
                    fields: [
                      { type: 'text', name: 'title', label: t('title', { ns: 'forms' }) },
                      { type: 'editor', name: 'description', label: t('description', { ns: 'forms' }) }
                    ]
                  }
                ]}
              />
            </Stack>
          </CardContent>
        </Card>

        {renderActions}

        <FaqsDashboardPreview
          faqsData={values.faqs}
          //
          open={preview.value}
          isValid={isValid}
          onClose={preview.onFalse}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />

      </FormProvider>
    </Container>
  )
}

FaqsDashboardView.propTypes = {
  currentFaqs: PropTypes.array
};
