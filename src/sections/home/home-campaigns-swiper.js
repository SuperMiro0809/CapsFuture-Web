import PropTypes from 'prop-types';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import { EffectCoverflow, Pagination, Autoplay, Navigation } from 'swiper/modules';
// @mui
import Stack from '@mui/material/Stack';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
// 
import { format, parseISO } from 'date-fns';
// components
import { CampaignCard } from 'src/components/campaigns';
//
import { ASSETS } from 'src/config-global';

export default function HomeCampaignsSwiper({ campaigns }) {
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
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
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
        breakpoints={{
          // when window width is >= 320px
          320: {
            slidesPerView: 1
          },
          // when window width is >= 640px
          640: {
            slidesPerView: 2
          }
        }}
      >
        {campaigns.map((campaign) => (
          <SwiperSlide key={campaign.id}>
            <CampaignCard
              id={campaign.id}
              slug={campaign.id}
              title={campaign.title}
              shortDescription={campaign.short_description}
              date={format(parseISO(campaign.date), 'dd.MM.yyyy')}
              cities={campaign.cities}
              imageSrc={`${ASSETS}/${campaign.title_image_path}`}
              attendances={campaign.attendances}
            />
          </SwiperSlide>
        ))}
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
    </>
  );
}

HomeCampaignsSwiper.propTypes = {
  campaigns: PropTypes.array
};
