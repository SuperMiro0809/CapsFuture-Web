import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// components
import SvgColor from '../svg-color';
import Iconify from '../iconify';
import mapIcons from './icon-list';
// react-leaflet
import { Marker, Popup } from 'react-leaflet';
// locales
import { useTranslate } from 'src/locales';
// api
import { reverseGeocode } from 'src/api/google-maps';
//
import { ASSETS } from 'src/config-global';

export default function LocationMarker({
  id,
  latitude,
  longitude,
  type,
  type_display_name,
  name,
  collects_caps,
  collects_bottles,
  collects_cans,
  working_time,
  user,
  first_name,
  last_name,
  email,
  phone,
  deleteHandler,
  actions = true
}) {
  const { t } = useTranslate();

  const [address, setAddress] = useState('-');

  const getAddress = async () => {
    const newAddress = await reverseGeocode(latitude, longitude);
    setAddress(newAddress);
  }

  return (
    <Marker
      position={[latitude, longitude]}
      icon={(type === 'heart' && mapIcons.heartIcon) || (type === 'station' && mapIcons.stationIcon)}
      eventHandlers={{
        click: () => {
          getAddress();
        },
      }}
    >
      <Popup>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='subtitle1'>{name}</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {collects_caps && (
              <Paper sx={{ color: 'secondary.dark' }}>
                <SvgColor src='/assets/icons/app/bottle_cap.svg' sx={{ width: 26, height: 26, }} />
              </Paper>
            )}

            {collects_bottles && (
              <Paper sx={{ color: 'secondary.dark' }}>
                <Iconify icon="solar:bottle-bold-duotone" width={26} height={26} />
              </Paper>
            )}

            {collects_cans && (
              <Paper sx={{ color: 'secondary.dark' }}>
                <Iconify icon="pepicons-print:can" width={26} height={26} />
              </Paper>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Stack spacing={1}>
          <Box>
            <Typography component='span' variant='body2'>{t('address')}:</Typography>
            <Typography component='span' variant='subtitle2' sx={{ pl: 0.5 }}>{address}</Typography>
          </Box>

          <Box>
            <Typography component='span' variant='body2'>{t('type')}:</Typography>
            <Typography component='span' variant='subtitle2' sx={{ pl: 0.5 }}>{t(type_display_name)}</Typography>
          </Box>

          {working_time && (
            <Box>
              <Typography component='span' variant='body2'>{t('working-time')}:</Typography>
              <Typography component='span' variant='subtitle2' sx={{ pl: 0.5 }}>{working_time}</Typography>
            </Box>
          )}

          <Box>
            <Typography component='span' variant='body2'>{t('manager')}:</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
              <Paper
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                  typography: 'subtitle2',
                  flexDirection: 'column',
                  color: 'primary.main',
                  textAlign: 'center'
                }}
              >
                {user ? (
                  <>
                    <Avatar src={user.avatar_photo_path && `${ASSETS}/${user.avatar_photo_path}`} />
                    {`${user.first_name} ${user.last_name}`}
                  </>
                ) : (
                  <>
                    <Avatar />
                    {`${first_name} ${last_name}`}
                  </>
                )}
              </Paper>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon='ic:twotone-email' sx={{ color: 'primary.main' }} />
                  {user ? user.email : email}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon='ph:phone-duotone' sx={{ color: 'primary.main' }} />
                  {phone}
                </Box>
              </Stack>
            </Box>
          </Box>
        </Stack>

        <Divider sx={{ my: 1 }} />

        {actions && (
          <Box gap={2} display='grid' gridTemplateColumns='repeat(2, 1fr)'>
            <Button
              component={RouterLink}
              color='secondary'
              startIcon={<Iconify icon="solar:pen-bold" />}
              href={paths.dashboard.station.locations.edit(id)}
            >
              {t('edit')}
            </Button>
            <Button
              color='error'
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => deleteHandler(id)}
            >
              {t('delete.word')}
            </Button>
          </Box>
        )}
      </Popup>
    </Marker>
  );
}

LocationMarker.propTypes = {
  id: PropTypes.number,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  type: PropTypes.oneOf(['heart', 'station']),
  type_display_name: PropTypes.string,
  name: PropTypes.string,
  collects_caps: PropTypes.bool,
  collects_bottles: PropTypes.bool,
  collects_cans: PropTypes.bool,
  working_time: PropTypes.string,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  email: PropTypes.string,
  phone: PropTypes.string,
  deleteHandler: PropTypes.func
};
