import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo, useEffect, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ASSETS } from 'src/config-global';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
import { useBoolean } from 'src/hooks/use-boolean';
// routes
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
// api
import { createCampaign, editCampaign } from 'src/api/campaign';
import { reverseGeocode } from 'src/api/google-maps';
// locales
import { useTranslate } from 'src/locales';
// date-fns
import { format, parseISO } from 'date-fns';
// utils
import constructFormData from 'src/utils/form-data';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFDatePicker,
  RHFLanguageField,
  RHFUpload,
  RHFLocationSelectorField,
  RHFTextField
} from 'src/components/hook-form';
//
import CampaignDetailsPreview from './campaign-details-preview';

// ----------------------------------------------------------------------

export default function CampaignNewEditForm({ currentCampaign }) {
  const { t, i18n } = useTranslate();

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const preview = useBoolean();

  const NewCampaignSchema = Yup.object().shape({
    title_image: Yup.mixed().required(t('title_image.required', { ns: 'validation' })),
    date: Yup.date().required(t('date.required', { ns: 'validation' })),
    information: Yup.object().shape({
      bg: Yup.object().shape({
        title: Yup.string().required(t('title.required', { ns: 'validation' })),
        short_description: Yup.string().required(t('short_description.required', { ns: 'validation' })),
        description: Yup.string().required(t('description.required', { ns: 'validation' }))
      }),
      en: Yup.object().shape({
        title: Yup.string().required(t('title.required', { ns: 'validation' })),
        short_description: Yup.string().required(t('short_description.required', { ns: 'validation' })),
        description: Yup.string().required(t('description.required', { ns: 'validation' }))
      })
    }),
    location: Yup.object().required(t('location.required', { ns: 'validation' })),
    // not required
    location_note: Yup.string()
  });

  const defaultValues = useMemo(
    () => {
      let locationValue = null;
      const translations = {
        bg: {
          title: '',
          short_description: '',
          description: ''
        },
        en: {
          title: '',
          short_description: '',
          description: ''
        }
      };

      if (currentCampaign?.translations) {
        currentCampaign.translations.forEach((el) => {
          translations[el.language] = {
            id: el.id,
            title: el.title,
            short_description: el.short_description,
            description: el.description
          };
        });
      }

      if (currentCampaign?.location) {
        locationValue = {
          lat: currentCampaign.location.latitude,
          lng: currentCampaign.location.longitude
        }
      }

      return {
        title_image: currentCampaign?.title_image_path && { preview: `${ASSETS}/${currentCampaign.title_image_path}` },
        date: currentCampaign?.date ? parseISO(currentCampaign.date) : null,
        information: translations,
        location: locationValue,
        location_note: currentCampaign?.location?.note || ''
      }
    },
    [currentCampaign]
  );

  const methods = useForm({
    resolver: yupResolver(NewCampaignSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentCampaign) {
      reset(defaultValues);
    }
  }, [currentCampaign, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const { title_image, date, location, location_note } = data;

    try {
      const addressBg = await reverseGeocode(location.lat, location.lng, 'bg');
      const addressEn = await reverseGeocode(location.lat, location.lng, 'en');

      const values = {
        ...data,
        date: format(date, 'yyyy-MM-dd'),
        location: {
          ...location,
          address_bg: addressBg,
          address_en: addressEn,
          note: location_note
        }
      };

      const formData = constructFormData(values);

      if (title_image instanceof File) {
        formData.append('title_image', title_image);
      }

      if (currentCampaign) {
        await editCampaign(currentCampaign.id, formData);

        enqueueSnackbar(t('edit-success', { ns: 'messages' }));
      } else {
        await createCampaign(formData);

        enqueueSnackbar(t('create-success', { ns: 'messages' }));
      }

      router.push(paths.dashboard.campaign.root);
      router.refresh();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  const handleDropSingleFile = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (newFile) {
        setValue('title_image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {t('details', { ns: 'common' })}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('details-subtext', { ns: 'common' })}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title={t('details', { ns: 'common' })} />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">{t('title-image', { ns: 'forms' })}</Typography>
              <RHFUpload
                name="title_image"
                maxSize={3145728}
                onDrop={handleDropSingleFile}
                onDelete={() => setValue('title_image', null, { shouldValidate: true })}
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">{t('date', { ns: 'forms' })}</Typography>
              <RHFDatePicker name='date' />
            </Stack>

            <RHFLanguageField
              name='information'
              langs={[
                { label: 'Български', slug: 'bg' },
                { label: 'English', slug: 'en' },
              ]}
              fields={[
                { type: 'text', name: 'title', label: t('title', { ns: 'forms' }) },
                { type: 'text', name: 'short_description', label: t('short_description', { ns: 'forms' }), multiline: true, rows: 4 },
                { type: 'editor', name: 'description', label: t('description', { ns: 'forms' }) }
              ]}
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderLocations = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {t('location', { ns: 'forms' })}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('subtext', { ns: 'location' })}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title={t('location', { ns: 'common' })} />}

          <Stack spacing={3} sx={{ p: 3 }}>

            <Stack spacing={1.5}>
              <RHFLocationSelectorField
                name='location'
                placeholder={t('enter-address', { ns: 'location' })}
                iconName='campaignIcon'
                helperText={t('enter-address-or-choose-on-map', { ns: 'location' })}
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">{t('note', { ns: 'forms' })}</Typography>
              <RHFTextField
                name='location_note'
                multiline
                rows={2}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
        <Button color="inherit" variant="outlined" size="large" onClick={preview.onTrue}>
          {t('preview', { ns: 'common' })}
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentCampaign ? t('create', { ns: 'common' }) : t('save', { ns: 'common' })}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderLocations}

        {renderActions}
      </Grid>

      <CampaignDetailsPreview
        title={values.information[i18n.language].title}
        content={values.information[i18n.language].description}
        description={values.information[i18n.language].short_description}
        date={values.date ? format(values.date, 'dd.MM.yyyy') : null}
        location={values.location}
        locationNote={values.location_note}
        coverUrl={
          typeof values.title_image === 'string' ? values.title_image : `${values.title_image?.preview}`
        }
        //
        open={preview.value}
        isValid={isValid}
        isSubmitting={isSubmitting}
        onClose={preview.onFalse}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
}

CampaignNewEditForm.propTypes = {
  currentCampaign: PropTypes.object,
};
