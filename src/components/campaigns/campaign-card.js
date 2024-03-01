import PropTypes from 'prop-types';
// @mui
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// routes
import { useRouter } from 'src/routes/hooks';
// locales
import { useTranslate } from 'src/locales';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import CampaignParticipateModal from './campaign-participate-modal';
import CampaignUnsubscribeModal from './campaign-unsubscribe-modal';

export default function CampaignCard({ id, slug, title, shortDescription, date, cities, imageSrc, attendances }) {
  const { t } = useTranslate();

  const router = useRouter();

  const participateModal = useBoolean();

  const unsubscribeModal = useBoolean();

  const { user } = useAuthContext();

  const isSubscribed = !!attendances.find((u) => u.user_id === user?.id);

  return (
    <>
      <Card
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <CardMedia
            sx={{ height: 400, objectFit: 'cover' }}
            image={imageSrc}
            title={title}
          />

          <Chip
            label={date} // '19.02.2024'
            color='primary'
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              fontSize: '1rem',
              borderTopLeftRadius: 0,
              borderBottomRightRadius: 0
            }}
          />

          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h4" component="div">
                {title}
              </Typography>
              <Stack direction='row' spacing={1}>
                {cities.map((city) => <Chip label={city.city} color='primary' key={city.id} />)}
              </Stack>
            </Box>

            <Typography variant="body2" color="text.secondary">
              {shortDescription}
            </Typography>
          </CardContent>
        </Box>

        <CardActions
          sx={{
            width: '100%',
            position: 'relative',
            bottom: 0,
            py: 2
          }}
        >
          {!isSubscribed ?
            <Button
              sx={{ flexGrow: 1 }}
              color='primary'
              variant='contained'
              onClick={user ? participateModal.onTrue : () => router.push(`/campaigns/${slug}/participate`)}
            >
              {t('participate')}!
            </Button>
            :
            <Button
              sx={{ flexGrow: 1 }}
              color='warning'
              variant='contained'
              onClick={unsubscribeModal.onTrue}
            >
              {t('unsubscribe')}
            </Button>
          }

          <Button
            sx={{ flexGrow: 1 }}
            color='secondary'
            variant='outlined'
            onClick={() => router.push(`/campaigns/${slug}`)}
          >
            {t('read-more')}
          </Button>
        </CardActions>
      </Card>

      <CampaignParticipateModal
        open={participateModal.value}
        onClose={participateModal.onFalse}
        campaignId={id}
      />

      <CampaignUnsubscribeModal
        open={unsubscribeModal.value}
        onClose={unsubscribeModal.onFalse}
        campaignId={id}
      />
    </>
  );
}

CampaignCard.propTypes = {
  id: PropTypes.number,
  slug: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
  shortDescription: PropTypes.string,
  date: PropTypes.string,
  cities: PropTypes.array,
  imageSrc: PropTypes.string,
  attendances: PropTypes.array
};
