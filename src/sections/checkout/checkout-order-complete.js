'use client'

import PropTypes from 'prop-types';
import { m, AnimatePresence } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// locales
import { useTranslate } from 'src/locales'
// routes
import { RouterLink } from 'src/routes/components';
// assets
import { OrderFailedIllustration, OrderCompleteIllustration } from 'src/assets/illustrations';
// components
import Iconify from 'src/components/iconify';
import { varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function CheckoutOrderComplete({ open, onReset, onDownloadPDF, status, error }) {
  const { t } = useTranslate();

  const renderError = (
    <Stack
      spacing={5}
      sx={{
        m: 'auto',
        maxWidth: 480,
        textAlign: 'center',
        px: { xs: 2, sm: 0 },
      }}
    >
      <Typography variant="h4">{t('error-occurred', { ns: 'messages' })}</Typography>

      <OrderFailedIllustration sx={{ height: 260, width: 400 }} />

      <Typography color='error' variant='subtitle1'>{error}</Typography>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack
        spacing={2}
        justifyContent="space-between"
        direction={{ xs: 'column-reverse', sm: 'row' }}
      >
        <Button
          component={RouterLink}
          href='/store'
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          onClick={onReset}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          {t('to-store', { ns: 'common' })}
        </Button>
      </Stack>
    </Stack>
  );

  const renderContent = (
    <Stack
      spacing={5}
      sx={{
        m: 'auto',
        maxWidth: 480,
        textAlign: 'center',
        px: { xs: 2, sm: 0 },
      }}
    >
      <Typography variant="h4">{t('purchase-thanks.title', { ns: 'ecommerce' })}</Typography>

      <OrderCompleteIllustration sx={{ height: 260 }} />

      <Typography>
        {t('purchase-thanks.placing-order', { ns: 'ecommerce' })}
        <br />
        <br />
        <Link>{status?.orderNumber}</Link>
        <br />
        <br />
        {t('purchase-thanks.send-notification', { ns: 'ecommerce' })}
        <br /> {t('purchase-thanks.contact-us', { ns: 'ecommerce' })} <br /> <br />
       {t('purchase-thanks.farewell', { ns: 'ecommerce' })} <br />
       <Typography color='primary' variant='h6'>{t('caps-for-future', { ns: 'headers' })}</Typography>
      </Typography>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack
        spacing={2}
        justifyContent="space-between"
        direction={{ xs: 'column-reverse', sm: 'row' }}
      >
        <Button
          component={RouterLink}
          href='/store'
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          onClick={onReset}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          {t('to-store', { ns: 'common' })}
        </Button>

        <Button
          fullWidth
          color='primary'
          size="large"
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-download-fill" />}
          onClick={onDownloadPDF}
        >
          Download as PDF
        </Button>
      </Stack>
    </Stack>
  );

  const fadeAndDropGreen = {
    initial: { opacity: 0, y: '-100%' },
    animate: { opacity: 1, y: '160%', transition: { duration: 1, ease: 'easeInOut' } },
    exit: { opacity: 0, transition: { duration: 0.24 } }
  };

  const fadeAndDropPink = {
    initial: { opacity: 0, y: '-100%' },
    animate: { opacity: 1, y: '110%', transition: { duration: 1, ease: 'easeInOut' } },
    exit: { opacity: 0, transition: { duration: 0.24 } }
  };

  const fadeAndDropBlue = {
    initial: { opacity: 0, y: '-30%' },
    animate: { opacity: 1, y: '280%', transition: { duration: 1, ease: 'easeInOut' } },
    exit: { opacity: 0, transition: { duration: 0.24 } }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          fullWidth
          fullScreen
          open={open}
          PaperComponent={(props) => (
            <Box
              component={m.div}
              {...varFade({
                distance: 120,
                durationIn: 0.32,
                durationOut: 0.24,
                easeIn: 'easeInOut',
              }).inUp}
              sx={{
                width: 1,
                height: 1,
                p: { md: 3 },
              }}
            >
              <Paper {...props}>{props.children}</Paper>
            </Box>
          )}
        >
          <m.div {...fadeAndDropGreen} style={{ position: 'absolute', left: '15%' }}>
            <img src='/assets/images/home/bottle_cap_green.svg' />
          </m.div>

          <m.div {...fadeAndDropPink} style={{ position: 'absolute', left: '70%' }}>
            <img width='250' src='/assets/images/home/bottle_cap_pink.svg' />
          </m.div>

          <m.div {...fadeAndDropBlue} style={{ position: 'absolute', left: '75%' }}>
            <img width='250' src='/assets/images/home/bottle_cap_blue.svg' />
          </m.div>

          {!error ? renderContent : renderError}
        </Dialog>
      )}
    </AnimatePresence>
  );
}

CheckoutOrderComplete.propTypes = {
  open: PropTypes.bool,
  onReset: PropTypes.func,
  children: PropTypes.node,
  onDownloadPDF: PropTypes.func,
  status: PropTypes.object
};
