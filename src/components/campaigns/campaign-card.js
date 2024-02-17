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

export default function CampaignCard({ title, shortDescription, cities, imageSrc }) {
  return (
    <Card sx={{ width: '100%', height: '100%' }}>
      <CardMedia
        sx={{ height: 350, objectFit: 'cover' }}
        image={imageSrc}
        title={title}
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

      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

CampaignCard.propTypes = {
  title: PropTypes.string,
  shortDescription: PropTypes.string,
  cities: PropTypes.array,
  imageSrc: PropTypes.string
};
