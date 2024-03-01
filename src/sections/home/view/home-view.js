'use client';

import PropTypes from 'prop-types';
import { useRef } from 'react';

import { useScroll, useTransform, m } from 'framer-motion';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import MainLayout from 'src/layouts/main';

import ScrollProgress from 'src/components/scroll-progress';

import HomeHero from '../home-hero';
import HomePartners from '../home-partners';
import HomeAboutUs from '../home-about-us';
import HomeMap from '../home-map';
import HomeProducts from '../home-products';
import HomeAchievements from '../home-achievements';
import HomeFAQ from '../home-faq';
import HomeContacts from '../home-contacts';

import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

const StyledPolygon = styled('div')(({ anchor = 'top', theme }) => ({
  left: 0,
  zIndex: 9,
  height: 80,
  width: '100%',
  position: 'absolute',
  clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
  backgroundColor: theme.palette.background.default,
  display: 'block',
  lineHeight: 0,
  ...(anchor === 'top' && {
    top: -1,
    transform: 'scale(-1, -1)',
  }),
  ...(anchor === 'bottom' && {
    bottom: -1,
    backgroundColor: theme.palette.grey[900],
  }),
}));

// ----------------------------------------------------------------------

function useParallax(value, distance) {
  return useTransform(value, [0, 1], [-100, distance]);
}

function useParallaxCap(value, distance) {
  return useTransform(value, [0, 1], [0, distance]);
}

export default function HomeView({ campaigns, products, locations }) {
  const { scrollYProgress } = useScroll();

  const contentRef = useRef(null);

  const { scrollYProgress: scrollContentY } = useScroll({ target: contentRef });

  const yBlue = useParallax(scrollContentY, 2000);

  const yPeach = useParallax(scrollContentY, 1200);

  const yGreen = useParallax(scrollContentY, 1200);

  const rotate = useParallaxCap(scrollYProgress, 360);

  const mdUp = useResponsive('up', 'md');

  return (
    <MainLayout>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <HomeHero campaigns={campaigns} />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: (theme) => theme.palette.background.pink
        }}
        ref={contentRef}
      >
        <HomePartners />

        {mdUp && (
          <>
            <m.div style={{ y: yBlue, position: 'absolute', left: '20%', top: '15%' }}>
              <m.img style={{ rotate }} src='/assets/images/home/bottle_cap_blue.svg' />
            </m.div>

            <m.div style={{ y: yPeach, position: 'absolute', left: '35%', top: '20%' }}>
              <m.img style={{ rotate }} src='/assets/images/home/bottle_cap_peach.svg' />
            </m.div>

            <m.div style={{ y: yGreen, position: 'absolute', right: '20%', top: '20%' }}>
              <m.img style={{ rotate }} src='/assets/images/home/bottle_cap_green.svg' />
            </m.div>
          </>
        )}

        <HomeAboutUs />

        <HomeMap locations={locations} />

        {mdUp && (
          <>
            <m.div style={{ y: yBlue, position: 'absolute', left: '18%', top: '33%' }}>
              <m.img style={{ rotate }} src='/assets/images/home/bottle_cap_blue.svg' />
            </m.div>

            <m.div style={{ y: yGreen, position: 'absolute', right: '18%', top: '35%' }}>
              <m.img style={{ rotate }} src='/assets/images/home/bottle_cap_yellow.svg' />
            </m.div>

            <m.div style={{ y: yGreen, position: 'absolute', right: '20%', top: '38%' }}>
              <m.img style={{ rotate }} src='/assets/images/home/bottle_cap_pink.svg' />
            </m.div>
          </>
        )}

        <HomeProducts products={products} />

        <HomeAchievements />

        <HomeFAQ />

        <HomeContacts />
      </Box>
    </MainLayout>
  );
}


HomeView.propTypes = {
  campaigns: PropTypes.array,
  products: PropTypes.array,
  locations: PropTypes.array
}
