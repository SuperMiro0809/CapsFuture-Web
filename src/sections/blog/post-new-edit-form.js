import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
// rotes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// locales
import { useTranslate } from 'src/locales';
// api
import { createPost, editPost } from 'src/api/blog';
import { _tags } from 'src/_mock';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFUpload,
  RHFLanguageField,
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch
} from 'src/components/hook-form';
// utils
import constructFormData from 'src/utils/form-data';
//
import PostDetailsPreview from './post-details-preview';
import { ASSETS } from 'src/config-global';

// ----------------------------------------------------------------------

export default function PostNewEditForm({ currentPost }) {
  const { t, i18n } = useTranslate();

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const preview = useBoolean();

  const NewBlogSchema = Yup.object().shape({
    title_image: Yup.mixed().nullable().required('Cover is required'),
    information: Yup.object().shape({
      bg: Yup.object().shape({
        title: Yup.string().required(t('validation.title.required')),
        short_description: Yup.string().required(t('validation.short_description.required')),
        description: Yup.string().required(t('validation.description.required'))
      }),
      en: Yup.object().shape({
        title: Yup.string().required(t('validation.title.required')),
        short_description: Yup.string().required(t('validation.short_description.required')),
        description: Yup.string().required(t('validation.description.required'))
      })
    }),
    // metaKeywords: Yup.array().min(1, 'Meta keywords is required'),
    // not required
    metaTitle: Yup.string(),
    metaDescription: Yup.string(),
  });

  const defaultValues = useMemo(
    () => {

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

      if (currentPost?.translations) {
        currentPost.translations.forEach((el) => {
          translations[el.language] = {
            id: el.id,
            title: el.title,
            short_description: el.short_description,
            description: el.description
          };
        })
      }

      return {
        title_image: currentPost?.title_image_path && { preview: `${ASSETS}/${currentPost.title_image_path}` },
        metaKeywords: currentPost?.metaKeywords || [],
        metaTitle: currentPost?.metaTitle || '',
        metaDescription: currentPost?.metaDescription || '',
        information: translations,
        active: currentPost?.active || false,
        enable_comments: currentPost?.enable_comments || false
      }
    },
    [currentPost]
  );

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentPost) {
      reset(defaultValues);
    }
  }, [currentPost, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const { title_image, active, enable_comments } = data;
    data.active = Number(active);
    console.log(data.active)
    data.enable_comments = Number(enable_comments);

    const formData = constructFormData(data);

    if (title_image instanceof File) {
      formData.append('title_image', title_image);
    }

    try {
      if (currentPost) {
        await editPost(currentPost.id, formData);

        enqueueSnackbar(t('edit-success'));
      } else {
        await createPost(formData);

        enqueueSnackbar(t('create-success'));
      }

      router.push(paths.dashboard.post.root);
      router.refresh();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('title_image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('title_image', null);
  }, [setValue]);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {t('details')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('details-subtext')}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">{t('title-image')}</Typography>
              <RHFUpload
                name="title_image"
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
            </Stack>

            <RHFLanguageField
              name='information'
              langs={[
                { label: 'Български', slug: 'bg' },
                { label: 'English', slug: 'en' },
              ]}
              fields={[
                { type: 'text', name: 'title', label: t('title') },
                { type: 'text', name: 'short_description', label: t('short_description'), multiline: true, rows: 4 },
                { type: 'editor', name: 'description', label: t('description') }
              ]}
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {t('properties')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('properties-subtext')}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            {/* <RHFAutocomplete
              name="tags"
              label="Tags"
              placeholder="+ Tags"
              multiple
              freeSolo
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            /> */}

            <RHFTextField name="metaTitle" label="Meta title" />

            <RHFTextField
              name="metaDescription"
              label="Meta description"
              fullWidth
              multiline
              rows={3}
            />

            <RHFAutocomplete
              name="metaKeywords"
              label="Meta keywords"
              placeholder="+ Keywords"
              multiple
              freeSolo
              disableCloseOnSelect
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />

            <RHFSwitch
              name='enable_comments'
              label={t('enable-comments')}
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <RHFSwitch
            name='active'
            label={t('active')}
            sx={{ pl: 3 }}
          />
        </Box>

        <Button color="inherit" variant="outlined" size="large" onClick={preview.onTrue}>
          {t('preview')}
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentPost ? t('create') : t('save')}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {/* {renderProperties} */}

        {renderActions}
      </Grid>

      <PostDetailsPreview
        title={values.information[i18n.language].title}
        content={values.information[i18n.language].description}
        description={values.information[i18n.language].short_description}
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

PostNewEditForm.propTypes = {
  currentPost: PropTypes.object,
};
