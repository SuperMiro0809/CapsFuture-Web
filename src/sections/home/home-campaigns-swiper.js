// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// import required modules
import { EffectCoverflow, Pagination, Autoplay, Navigation } from 'swiper/modules';

// components
import { CampaignCard } from 'src/components/campaigns';

import Stack from '@mui/material/Stack';

export default function HomeCampaignsSwiper() {
  return (
    <>
      <Swiper
        loop
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={2}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 200,
          modifier: 3,
          scale: 1,
          slideShadows: true
        }}
        // autoplay={{
        //   delay: 3000,
        //   disableOnInteraction: false,
        // }}
        pagination={{
          el: '.campaign-swiper-pagination',
          clickable: true
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }}
        modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
        className="campaign-swiper"
        style={{ marginTop: 30 }}
      >
        <SwiperSlide>
          <CampaignCard imageSrc="https://swiperjs.com/demos/images/nature-2.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <CampaignCard imageSrc="https://swiperjs.com/demos/images/nature-2.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <CampaignCard imageSrc="https://swiperjs.com/demos/images/nature-3.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <CampaignCard imageSrc="https://swiperjs.com/demos/images/nature-4.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <CampaignCard imageSrc="https://swiperjs.com/demos/images/nature-5.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <CampaignCard imageSrc="https://swiperjs.com/demos/images/nature-6.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <CampaignCard imageSrc="https://swiperjs.com/demos/images/nature-7.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <CampaignCard imageSrc="https://swiperjs.com/demos/images/nature-8.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <CampaignCard imageSrc="https://swiperjs.com/demos/images/nature-9.jpg" />
        </SwiperSlide>
      </Swiper>


      <Stack sx={{ position: 'relative', bottom: '38%' }} direction='row' alignItems='center' justifyContent='center' gap={1}>
        <div className='campaign-swiper-navigation-prev swiper-button-prev'>
          <NavigateBeforeIcon
            sx={(theme) => ({
              color: theme.palette.text.primary
            })}
          />
        </div>

        <div className='campaign-swiper-pagination' />

        <div className='campaign-swiper-navigation-next swiper-button-next'>
          <NavigateNextIcon
            sx={(theme) => ({
              color: theme.palette.text.primary
            })}
          />
        </div>
      </Stack>
      {/* <div style={{
          // position: 'absolute',
          // top: '63%',
          // left: '50%',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '50px',
        }}
      >
       
      </div> */}
    </>
  );
}

// import PropTypes from 'prop-types';

// import Card from '@mui/material/Card';

// import Image from 'src/components/image';
// import Carousel, { useCarousel, CarouselArrowIndex } from 'src/components/carousel';

// import { _mock } from 'src/_mock';


// // ----------------------------------------------------------------------

// export default function CarouselBasic1({ data }) {
//   const carousel = useCarousel({
//     autoplay: true,
//   });

//   const _carouselsExample = [...Array(20)].map((_, index) => ({
//     id: _mock.id(index),
//     title: _mock.postTitle(index),
//     coverUrl: _mock.image.cover(index),
//     description: _mock.description(index),
//   }));

//   return (
//     <Card>
//       <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
//         {_carouselsExample.slice(0, 4).map((item) => (
//           <Image key={item.id} alt={item.title} src={item.coverUrl} ratio="1/1" />
//         ))}
//       </Carousel>

//       <CarouselArrowIndex
//         index={carousel.currentIndex}
//         total={_carouselsExample.slice(0, 4).length}
//         onNext={carousel.onNext}
//         onPrev={carousel.onPrev}
//       />
//     </Card>
//   );
// }

// CarouselBasic1.propTypes = {
//   data: PropTypes.array,
// };
