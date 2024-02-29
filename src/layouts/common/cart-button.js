import PropTypes from 'prop-types';
// @mui
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
// routes
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
//
import { useCheckoutContext } from 'src/sections/checkout/context';
// components
import SvgColor from 'src/components/svg-color';


// ----------------------------------------------------------------------

export default function CartButton({ sx }) {
  const checkout = useCheckoutContext();

  return (
    <IconButton component={RouterLink} href={paths.product.checkout} sx={{ mr: 1, ...sx }}>
      <Badge showZero badgeContent={checkout.totalItems} color="error" max={99}>
        <SvgColor src={`/assets/icons/navbar/ic_ecommerce.svg`} />
      </Badge>
    </IconButton>
  );
}

CartButton.propTypes = {
  sx: PropTypes.object,
};
