import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// locales
import { useTranslate } from 'src/locales';
// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function AddressItem({ address, action, sx, ...other }) {
  const { t } = useTranslate();

  const { full_name, phone, country, city, post_code, district, street, street_number, building_number, entrance, floor, apartment, note, primary } = address;

  let fullAddress = `${country}, гр. ${city} ${post_code}`;

  if (district) {
    fullAddress += `, кв. ${district}`;
  }

  fullAddress += `, ${street} ${street_number || ''} `;

  if (building_number) {
    fullAddress += `, бл. ${building_number}`;
  }

  if (entrance) {
    fullAddress += `, вх. ${entrance}`;
  }

  if (floor) {
    fullAddress += `, ет. ${floor}`;
  }

  if (apartment) {
    fullAddress += `, ап. ${apartment}`;
  }

  return (
    <Stack
      component={Paper}
      spacing={2}
      alignItems={{ md: 'flex-end' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{
        position: 'relative',
        ...sx,
      }}
      {...other}
    >
      <Stack flexGrow={1} spacing={1}>
        <Stack direction="row" alignItems="center">
          <Typography variant="subtitle2">
            {full_name}
          </Typography>

          {!!primary && (
            <Label color="info" sx={{ ml: 1 }}>
              {t('default', { ns: 'profile' })}
            </Label>
          )}
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {fullAddress}
        </Typography>

        {note && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {note}
          </Typography>
        )}

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {phone}
        </Typography>
      </Stack>

      {action && action}
    </Stack>
  );
}

AddressItem.propTypes = {
  action: PropTypes.node,
  address: PropTypes.object,
  sx: PropTypes.object,
};
