/* eslint-disable react/no-children-prop */
import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
// locales
import { useLocales, useTranslate } from 'src/locales';
// components
import Scrollbar from 'src/components/scrollbar';
//
import HomeFAQ from '../home/home-faq';

// ----------------------------------------------------------------------

export default function FaqsDashboardPreview({
  faqsData,
  //
  open,
  isValid,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const { t } = useTranslate();

  const { currentLang, allLangs } = useLocales();

  // TODO Make language switcher only for the preview

  const translatedFaqsData = faqsData.map((el) => el.information[currentLang.value]);

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {t('preview', { ns: 'common' })}
        </Typography>

        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('cancel', { ns: 'common' })}
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          disabled={!isValid}
          loading={isSubmitting}
          onClick={onSubmit}
        >
          {t('save', { ns: 'common' })}
        </LoadingButton>
      </DialogActions>

      <Divider />

      <Scrollbar>
        <Container sx={{ maxWidth: '1400px !important' }}>
          <HomeFAQ faqsData={translatedFaqsData} />
        </Container>
      </Scrollbar>

    </Dialog>
  );
}

FaqsDashboardPreview.propTypes = {
  faqsData: PropTypes.array,
  //
  open: PropTypes.bool,
  isValid: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
};
