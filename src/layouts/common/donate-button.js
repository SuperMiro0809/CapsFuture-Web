import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
// components
import { RouterLink } from 'src/routes/components';
// locales
import { useTranslate } from 'src/locales';
// routes
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function DonateButton({ sx }) {
  const { t } = useTranslate();

  return (
    <Button component={RouterLink} target="_blank" color='secondary' rel="noopener" href={paths.home} variant="contained" sx={{ ...sx }}>
      {t('donate', { ns: 'headers' })}
    </Button>
  );
}

DonateButton.propTypes = {
  sx: PropTypes.object
};
