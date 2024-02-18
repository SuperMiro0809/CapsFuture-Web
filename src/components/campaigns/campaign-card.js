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
// locales
import { useTranslate } from 'src/locales';

export default function CampaignCard({ title, shortDescription, date, cities, imageSrc }) {
  const { t } = useTranslate();

  return (
    <Card sx={{ width: '100%', height: '100%' }}>
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

      <CardActions
        sx={{
          width: '100%',
          position: 'absolute',
          bottom: 0,
          py: 2
        }}
      >
        <Button sx={{ flexGrow: 1 }} color='primary' variant='contained'>{t('participate')}!</Button>
        <Button sx={{ flexGrow: 1 }} color='secondary' variant='outlined'>{t('read-more')}</Button>
      </CardActions>
    </Card>
  );
}

CampaignCard.propTypes = {
  title: PropTypes.string,
  shortDescription: PropTypes.string,
  date: PropTypes.string,
  cities: PropTypes.array,
  imageSrc: PropTypes.string
};
