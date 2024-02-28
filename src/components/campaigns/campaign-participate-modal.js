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
import { participate } from 'src/api/campaign';
// components
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSnackbar } from 'src/components/snackbar';

export default function CampaignParticipateModal({ open, onClose, campaignId }) {
  const { t } = useTranslate();

  const router = useRouter();

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const [isPending, startTransition] = useTransition();

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={t('participate-modal.title')}
      content={t('participate-modal.text')}
      action={
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            startTransition(async () => {
              const data = {
                campaign_id: campaignId,
                user_id: user.id
              };

              const { error } = await participate(data);

              if (error) {
                enqueueSnackbar(error, { variant: 'error' });
              } else {
                enqueueSnackbar(t('participate-success-message'))
              }
            });

            onClose()
            router.refresh();
          }}
        >
          {t('participate')}
        </Button>
      }
    />
  );
}

CampaignParticipateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  campaignId: PropTypes.number
};
