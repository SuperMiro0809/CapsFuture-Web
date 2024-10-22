/* eslint-disable react/no-children-prop */
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Unstable_Grid2';
// locales
import { useTranslate, useLocales } from 'src/locales';
// api
import { reverseGeocode } from 'src/api/google-maps';
// components
import Markdown from 'src/components/markdown';
import Scrollbar from 'src/components/scrollbar';
import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify';
//
import CampaignDetailsHero from './campaign-details-hero';

// ----------------------------------------------------------------------

export default function CampaignDetailsPreview({
  title,
  coverUrl,
  content,
  description,
  date,
  location,
  locationAddress,
  locationNote,
  //
  open,
  isValid,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const { t } = useTranslate();

  const { currentLang } = useLocales();

  const [addressString, setAddressString] = useState(locationAddress);

  const [position, setPosition] = useState([42.7249925, 25.4833039]);

  const hasContent = title || description || content || coverUrl || location || locationNote;

  const hasHero = title || coverUrl || date;

  const hasLocation = location || locationNote;

  const zoom = 20;

  const LeafletMap = useMemo(() => dynamic(
    () => import('src/components/leaflet-map').then(module => module.LeafletMap),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), []);

  const CampaignMarker = useMemo(() => dynamic(
    () => import('src/components/leaflet-map').then(module => module.CampaignMarker),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), []);

  useEffect(() => {
    const fetchAddress = async () => {
      const addressLang = await reverseGeocode(location.lat, location.lng, currentLang.value);

      setAddressString(addressLang);
    };

    if (location && !locationAddress) {
      fetchAddress();

      setPosition([location.lat, location.lng]);
    }
  }, [location, locationAddress])

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

      {hasContent ? (
        <Scrollbar>
          {hasHero && (
            <CampaignDetailsHero
              title={title}
              cities={[]}
              date={date}
              coverUrl={coverUrl}
              onParticipate={() => { }}
              onUnsubscribe={() => { }}
              isSubscribed={false}
            />
          )}

          <Container
            sx={{
              maxWidth: '1400px !important',
              mt: 5,
              mb: 10
            }}
          >
            <Stack
              sx={{
                mx: 'auto',
              }}
            >
              <Typography variant="h6" sx={{ mb: 5 }}>
                {description}
              </Typography>

              <Markdown children={content} />

              <Box sx={{ py: 3, borderBottom: (theme) => `dashed 1px ${theme.palette.divider}` }} />

              {hasLocation && (
                <Grid
                  container
                  spacing={3}
                  sx={{
                    mt: 2,
                    flexDirection: {
                      xs: 'column-reverse',
                      md: 'row'
                    }
                  }}
                >
                  <Grid xs={12} md={6}>
                    <LeafletMap center={position} zoom={zoom} style={{ height: '450px', width: '100%', borderRadius: 16 }}>
                      <CampaignMarker
                        latitude={location.lat}
                        longitude={location.lng}
                      />
                    </LeafletMap>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Stack spacing={2}>
                      <Typography variant='h5'>
                        {t('where-will-it-take-place', { ns: 'campaign' })}
                      </Typography>

                      <Stack spacing={1} flexDirection='row'>
                        <Iconify icon='solar:map-point-wave-linear' sx={{ color: 'primary.main' }} width={24} />
                        <Typography variant='body1' sx={{ flexBasis: '90%' }}>
                          {addressString}
                        </Typography>
                      </Stack>

                      <Stack direction='row' spacing={1}>
                        <Iconify icon='ic:outline-sticky-note-2' sx={{ color: 'primary.main' }} width={24} />
                        <Typography variant='body1' sx={{ flexBasis: '90%' }}>
                          {locationNote}
                        </Typography>
                      </Stack >
                    </Stack>
                  </Grid>
                </Grid>
              )}
            </Stack>
          </Container>
        </Scrollbar>
      ) : (
        <EmptyContent filled title="Empty Content!" />
      )}
    </Dialog>
  );
}

CampaignDetailsPreview.propTypes = {
  content: PropTypes.string,
  coverUrl: PropTypes.string,
  description: PropTypes.string,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  location: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number
  }),
  locationAddress: PropTypes.string,
  locationNote: PropTypes.string,
};
