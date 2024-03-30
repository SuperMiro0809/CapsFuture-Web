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
import { createReply } from 'src/api/blog';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function PostCommentReplyForm({ postId, commentId, onClose }) {
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
      const { error } = await createReply(postId, commentId, values);

      if (error) throw error;

      reset();
      onClose();
      enqueueSnackbar(t('reply-success', { ns: 'forms' }));
      router.refresh();
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' })
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack direction='row' alignItems='center' spacing={2}>
        <Box sx={{ flexGrow: 1 }}>
          <RHFTextField
            autoFocus
            name='comment'
            placeholder={`${t('write-reply', { ns: 'post' })}...`}
          />
        </Box>

        <LoadingButton type="submit" variant="contained" color='primary' loading={isSubmitting} endIcon={<Iconify icon='tabler:send' />}>
          {t('post-reply', { ns: 'post' })}
        </LoadingButton>
      </Stack>
    </FormProvider >
  );
}

PostCommentReplyForm.propTypes = {
  postId: PropTypes.number,
  commentId: PropTypes.number,
  onClose: PropTypes.func
};
