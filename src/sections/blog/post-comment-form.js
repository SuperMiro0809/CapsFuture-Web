import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
// routes
import { useRouter } from 'src/routes/hooks';
// locales
import { useTranslate } from 'src/locales';
// auth
import { useAuthContext } from 'src/auth/hooks';
// api
import { createComment } from 'src/api/blog';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function PostCommentForm({ postId }) {
  const { t } = useTranslate();

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const CommentSchema = Yup.object().shape({
    comment: Yup.string().required('Comment is required')
  });

  const defaultValues = {
    comment: ''
  };

  const methods = useForm({
    resolver: yupResolver(CommentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const values = {
      ...data,
      uploaded_by: user.id
    };

    try {
      const { error } = await createComment(postId, values);

      if (error) throw error;

      reset();
      enqueueSnackbar(t('comment-success', { ns: 'forms' }));
      router.refresh();
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' })
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <RHFTextField
          name='comment'
          placeholder={`${t('write-comment')}...`}
          multiline
          rows={4}
        />

        <Stack direction="row" alignItems="center">
          {/* <Stack direction="row" alignItems="center" flexGrow={1}>
            <IconButton>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>

            <IconButton>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>

            <IconButton>
              <Iconify icon="eva:smiling-face-fill" />
            </IconButton>
          </Stack> */}
          <Box sx={{ flexGrow: 1 }} />

          <LoadingButton type="submit" variant="contained" color='primary' loading={isSubmitting} endIcon={<Iconify icon='tabler:send' />}>
            {t('post-comment')}
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
}

PostCommentForm.propTypes = {
  postId: PropTypes.number
};
