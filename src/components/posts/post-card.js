import PropTypes from 'prop-types';
// @mui
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
// routes
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
//
import { usePopover } from '../custom-popover';
import SharePopup from '../share-popup';
import TextMaxLine from '../text-max-line';
import { ORIGIN } from 'src/config-global';


export default function PostCard({ slug, title, shortDescription, imageSrc, date }) {
  const router = useRouter();

  const popover = usePopover();

  return (
    <>
      <Card
        sx={{
          width: 'auto',
          position: 'relative',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: (theme) => theme.palette.primary.lighter,
          boxShadow: (theme) => (`0px 0px 20px 0px ${theme.palette.secondary.main}`),
          cursor: 'pointer',
          '&:hover': {
            boxShadow: (theme) => (`0px 0px 20px 0px ${theme.palette.primary.main}`)
          }
        }}
        onClick={() => router.push(paths.post.details(slug))}
      >
        <CardMedia
          sx={{ height: 400, objectFit: 'cover' }}
          image={imageSrc}
          title={title}
        />

        <Stack
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            p: 1
          }}
        >
          <IconButton
            color='primary'
            onClick={(event) => {
              event.stopPropagation();
              popover.onOpen(event);
            }}
          >
            <ShareIcon sx={{ fontSize: 30 }} />
          </IconButton>
        </Stack>

        <CardContent>
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            sx={{ mb: 2 }}
          >
            <TextMaxLine line={1} variant="h4" component="div">
              {title}
            </TextMaxLine>
            <Typography component="div" sx={{ typography: 'caption', color: 'text.disabled' }}>
              {date}
            </Typography>
          </Stack>

          <TextMaxLine variant="body2" color="text.secondary">
            {shortDescription}
          </TextMaxLine>
        </CardContent>
      </Card>

      <SharePopup
        open={popover.open}
        onClose={popover.onClose}
        url={`${ORIGIN}${paths.post.details(slug)}`}
      />
    </>
  );
}

PostCard.propTypes = {
  slug: PropTypes.string,
  title: PropTypes.string,
  shortDescription: PropTypes.string,
  imageSrc: PropTypes.string,
  date: PropTypes.string
};
