import PropTypes from 'prop-types';

import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { PATH_AFTER_LOGIN } from 'src/config-global';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function LoginButton({ sx }) {
  const { t } = useTranslate();

  return (
    <Button component={RouterLink} href={PATH_AFTER_LOGIN} variant="outlined" sx={{ ml: 1, ...sx }}>
      {t('login')}
    </Button>
  );
}

LoginButton.propTypes = {
  sx: PropTypes.object,
};
