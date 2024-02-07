import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from 'src/routes/components';
import SvgColor from 'src/components/svg-color';

import { PATH_AFTER_LOGIN } from 'src/config-global';

import CartIcon from 'public/assets/icons/navbar/ic_ecommerce.svg';

// ----------------------------------------------------------------------

export default function CartButton({ sx }) {
  return (
    <IconButton component={RouterLink} href={PATH_AFTER_LOGIN} sx={{ mr: 1, ...sx }}>
      <SvgColor src={`/assets/icons/navbar/ic_ecommerce.svg`} />
    </IconButton>
  );
}

CartButton.propTypes = {
  sx: PropTypes.object,
};
