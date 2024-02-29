import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import Popover from '@mui/material/Popover';
// react-share
import {
  EmailShareButton,
  FacebookShareButton,
  FacebookIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  TwitterShareButton,
  XIcon,
  ViberIcon,

  GabShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
} from 'react-share';
// routes
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
// locales
import { useTranslate } from 'src/locales';
// components
import Carousel, { useCarousel, CarouselArrowIndex } from 'src/components/carousel';
import CustomPopover, { usePopover } from '../custom-popover';
import { _mock } from 'src/_mock';
//
import SvgColor from '../svg-color';
import { ASSETS } from 'src/config-global';


const _carouselsExample = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  title: _mock.postTitle(index),
  coverUrl: _mock.image.cover(index),
  description: _mock.description(index),
}));


export default function ProductCard({ id, slug, title, price, images }) {
  const { t } = useTranslate();

  const router = useRouter();

  const popover = usePopover();

  const carousel = useCarousel({
    fade: true,
    autoplay: true,
    autoplaySpeed: 5000,
    initialSlide: 1,
  });

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
        onClick={() => router.push(paths.store.details(slug))}
      >
        <Box sx={{ height: 350 }}>
          <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
            {images.map((item, index) => (
              <CardMedia
                sx={{ height: 350, objectFit: 'cover' }}
                image={`${ASSETS}/${item.filepath}`}
                title={title}
                key={index}
              />
            ))}
          </Carousel>

          <CarouselArrowIndex
            index={carousel.currentIndex}
            total={images.length}
            onNext={(event) => {
              event.stopPropagation();
              carousel.onNext();
            }}
            onPrev={(event) => {
              event.stopPropagation();
              carousel.onPrev();
            }}
            sx={{ bottom: 120 }}
          />
        </Box>

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

        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box>
            <Typography variant="h4" component="div">
              {title}
            </Typography>
            <Typography variant="h5" component="div">
              {`${price} ${t('lv')}.`}
            </Typography>
          </Box>

          <IconButton
            sx={{
              color: 'secondary.main',
              '&:hover': {
                color: 'secondary.dark'
              }
            }}
            onClick={(event) => {
              event.stopPropagation();
              console.log('clicked');
            }}
          >
            <SvgColor
              src={`/assets/icons/navbar/ic_ecommerce.svg`}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
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

ProductCard.propTypes = {
  id: PropTypes.number,
  slug: PropTypes.string,
  title: PropTypes.string,
  price: PropTypes.number,
  images: PropTypes.array
};
