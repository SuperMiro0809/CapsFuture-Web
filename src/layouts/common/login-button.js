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

export default function LoginButton({ sx, returnTo = '' }) {
  const { t } = useTranslate();

  const searchParams = new URLSearchParams({
    returnTo,
  }).toString();

  const href = `${paths.auth.login}/?${searchParams}`;

  return (
    <Button component={RouterLink} href={href} variant="outlined" sx={{ ml: 1, ...sx }}>
      {t('login')}
    </Button>
  );
}

LoginButton.propTypes = {
  sx: PropTypes.object,
  returnTo: PropTypes.string
};
