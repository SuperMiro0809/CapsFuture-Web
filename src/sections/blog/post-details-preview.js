/* eslint-disable react/no-children-prop */
import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
// locales
import { useTranslate } from 'src/locales';
// components
import Markdown from 'src/components/markdown';
import Scrollbar from 'src/components/scrollbar';
import EmptyContent from 'src/components/empty-content';
//
import PostDetailsHero from './post-details-hero';

// ----------------------------------------------------------------------

export default function PostDetailsPreview({
  title,
  coverUrl,
  content,
  description,
  //
  open,
  isValid,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const { t } = useTranslate();

  const hasContent = title || description || content || coverUrl;

  const hasHero = title || coverUrl;

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {t('preview')}
        </Typography>

        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('cancel')}
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          disabled={!isValid}
          loading={isSubmitting}
          onClick={onSubmit}
        >
          {t('save')}
        </LoadingButton>
      </DialogActions>

      <Divider />

      {hasContent ? (
        <Scrollbar>
          {hasHero && <PostDetailsHero title={title} coverUrl={coverUrl} />}

          <Container
            sx={{
              maxWidth: '1400px !important',
              mt: 5,
              mb: 10
            }}
          >
            <Stack
              sx={{
                mx: 'auto',
              }}
            >
              <Typography variant="h6" sx={{ mb: 5 }}>
                {description}
              </Typography>

              <Markdown children={content} />
            </Stack>
          </Container>
        </Scrollbar>
      ) : (
        <EmptyContent filled title="Empty Content!" />
      )}
    </Dialog>
  );
}

PostDetailsPreview.propTypes = {
  content: PropTypes.string,
  coverUrl: PropTypes.string,
  description: PropTypes.string,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
};
