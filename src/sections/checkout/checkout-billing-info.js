import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
// locales
import { useTranslate } from 'src/locales';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CheckoutBillingInfo({ billing, onBackStep }) {
  const { t } = useTranslate();

  const { fullName, phone, country, city, postCode, quarter, street, streetNumber, buildingNumber, entrance, floor, apartment, note } = billing;

  let fullAddress = `${country}, гр. ${city} ${postCode}`;

  if (quarter) {
    fullAddress += `, кв. ${quarter}`;
  }

  fullAddress += `, ${street} ${streetNumber || ''} `;

  if (buildingNumber) {
    fullAddress += `, бл. ${buildingNumber}`;
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
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={t('address', { ns: 'location' })}
        action={
          <Button size="small" startIcon={<Iconify icon="solar:pen-bold" />} onClick={onBackStep}>
            {t('edit', { ns: 'common' })}
          </Button>
        }
      />
      <Stack spacing={1} sx={{ p: 3 }}>
        <Box sx={{ typography: 'subtitle2' }}>
          {fullName}
          {/* <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            ({billing?.addressType})
          </Box> */}
        </Box>

        <Box sx={{ color: 'text.secondary', typography: 'body2' }}>{fullAddress}</Box>

        <Box sx={{ color: 'text.secondary', typography: 'body2' }}>{phone}</Box>
      </Stack>
    </Card>
  );
}

CheckoutBillingInfo.propTypes = {
  billing: PropTypes.object,
  onBackStep: PropTypes.func,
};
