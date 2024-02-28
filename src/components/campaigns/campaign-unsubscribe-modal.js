import PropTypes from 'prop-types';
import { useTransition } from 'react';
// @mui
import Button from '@mui/material/Button';
// routes
import { useRouter } from 'src/routes/hooks';
// locales
import { useTranslate } from 'src/locales';
// auth
import { useAuthContext } from 'src/auth/hooks';
// api
import { unsubscribe } from 'src/api/campaign';
// components
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSnackbar } from 'src/components/snackbar';

export default function CampaignUnsubscribeModal({ open, onClose, campaignId }) {
  const { t } = useTranslate();

  const router = useRouter();

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const [isPending, startTransition] = useTransition();

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={t('unsubscribe-modal.title')}
      content={t('unsubscribe-modal.text')}
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            startTransition(async () => {
              const { error } = await unsubscribe(campaignId, user.id);

              if (error) {
                enqueueSnackbar(error, { variant: 'error' });
              } else {
                enqueueSnackbar(t('unsubscribe-success-message'))
              }
            });

            onClose();
            router.refresh()
          }}
        >
          {t('unsubscribe')}
        </Button>
      }
    />
  );
}

CampaignUnsubscribeModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  campaignId: PropTypes.number
};
