import PropTypes from 'prop-types';
// @mui
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import {
  FacebookShareButton,
  FacebookIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  TwitterShareButton,
  XIcon,
  ViberIcon,
  ViberShareButton,
} from "react-share";
// routes
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
// react-share
//
import CustomPopover, { usePopover } from '../custom-popover';


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
            <Typography variant="h4" component="div">
              {title}
            </Typography>
            <Typography component="div" sx={{ typography: 'caption', color: 'text.disabled' }}>
              {date}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {shortDescription}
          </Typography>
        </CardContent>
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
      >
        <Stack direction='row' gap={2}>
          <FacebookShareButton onClick={(event) => event.stopPropagation()} url={'http://localhost:3032/'}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          <FacebookMessengerShareButton onClick={(event) => event.stopPropagation()} url={'http://localhost:3032/'}>
            <FacebookMessengerIcon size={32} round />
          </FacebookMessengerShareButton>

          <TwitterShareButton onClick={(event) => event.stopPropagation()} url={'http://localhost:3032/'}>
            <XIcon size={32} round />
          </TwitterShareButton>

          <ViberShareButton onClick={(event) => event.stopPropagation()} url={'http://localhost:3032/'}>
            <ViberIcon size={32} round />
          </ViberShareButton>
        </Stack>

      </CustomPopover>
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
