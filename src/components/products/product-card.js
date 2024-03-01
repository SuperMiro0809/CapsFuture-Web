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
// routes
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
//
import { useCheckoutContext } from 'src/sections/checkout/context';
// locales
import { useTranslate } from 'src/locales';
// components
import Carousel, { useCarousel, CarouselArrowIndex } from 'src/components/carousel';
import { usePopover } from '../custom-popover';
//
import SvgColor from '../svg-color';
import { ASSETS, ORIGIN } from 'src/config-global';
import SharePopup from '../share-popup';

export default function ProductCard({ id, slug, title, price, images }) {
  const { t } = useTranslate();

  const router = useRouter();

  const popover = usePopover();

  const checkout = useCheckoutContext();

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
          {images.length === 1 ? (
            <CardMedia
              sx={{ height: 350, objectFit: 'cover' }}
              image={`${ASSETS}/${images[0].filepath}`}
              title={title}
              key={index}
            />
          ) : (
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
          )}

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
              checkout.onAddToCart({
                id,
                price,
                coverUrl: `${ASSETS}/${images[0].filepath}`,
                quantity: 1,
                subTotal: price,
              });
            }}
          >
            <SvgColor
              src={`/assets/icons/navbar/ic_ecommerce.svg`}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </CardContent>
      </Card>

      <SharePopup
        open={popover.open}
        onClose={popover.onClose}
        url={`${ORIGIN}${paths.store.details(slug)}`}
      />
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
