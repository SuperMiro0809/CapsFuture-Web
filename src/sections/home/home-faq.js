import { m } from 'framer-motion';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { textGradient } from 'src/theme/css';

import { varFade, varBounce, MotionViewport } from 'src/components/animate';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

const StyledTextGradient = styled(m.h2)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.light} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.light} 75%, ${theme.palette.primary.main} 100%`
  ),
  padding: 0,
  marginTop: 8,
  lineHeight: 1,
  fontWeight: 900,
  marginBottom: 24,
  letterSpacing: 8,
  textAlign: 'center',
  backgroundSize: '400%',
  fontSize: `${40 / 16}rem`,
  fontFamily: theme.typography.fontSecondaryFamily,
  [theme.breakpoints.up('md')]: {
    fontSize: `${64 / 16}rem`,
  },
}));

// ----------------------------------------------------------------------

export default function HomeFAQ() {
  const [opened, setOpened] = useState();

  const { t } = useTranslate();

  const visabilityVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { opacity: 1, height: 'auto', overflow: 'visible' }
  };

  const rotateVariants = {
    closed: { rotate: 0 },
    opened: { rotate: 90 }
  };

  const questions = [
    { title: 'Какви капачки събираме?', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec cursus libero, in hendrerit dolor. Morbi tristique justo at justo condimentum, euismod fringilla purus venenatis. Ut lacinia ac eros a laoreet. Phasellus semper turpis ac metus semper rhoncus. Nullam volutpat finibus leo et mattis.' },
    { title: 'Какви капачки събираме?', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec cursus libero, in hendrerit dolor. Morbi tristique justo at justo condimentum, euismod fringilla purus venenatis. Ut lacinia ac eros a laoreet. Phasellus semper turpis ac metus semper rhoncus. Nullam volutpat finibus leo et mattis.' },
    { title: 'Какви капачки събираме?', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec cursus libero, in hendrerit dolor. Morbi tristique justo at justo condimentum, euismod fringilla purus venenatis. Ut lacinia ac eros a laoreet. Phasellus semper turpis ac metus semper rhoncus. Nullam volutpat finibus leo et mattis.' },
    { title: 'Какви капачки събираме?', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec cursus libero, in hendrerit dolor. Morbi tristique justo at justo condimentum, euismod fringilla purus venenatis. Ut lacinia ac eros a laoreet. Phasellus semper turpis ac metus semper rhoncus. Nullam volutpat finibus leo et mattis.' },
    { title: 'Какви капачки събираме?', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec cursus libero, in hendrerit dolor. Morbi tristique justo at justo condimentum, euismod fringilla purus venenatis. Ut lacinia ac eros a laoreet. Phasellus semper turpis ac metus semper rhoncus. Nullam volutpat finibus leo et mattis.' },
    { title: 'Какви капачки събираме?', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec cursus libero, in hendrerit dolor. Morbi tristique justo at justo condimentum, euismod fringilla purus venenatis. Ut lacinia ac eros a laoreet. Phasellus semper turpis ac metus semper rhoncus. Nullam volutpat finibus leo et mattis.' },
    { title: 'Какви капачки събираме?', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec cursus libero, in hendrerit dolor. Morbi tristique justo at justo condimentum, euismod fringilla purus venenatis. Ut lacinia ac eros a laoreet. Phasellus semper turpis ac metus semper rhoncus. Nullam volutpat finibus leo et mattis.' },
    { title: 'Какви капачки събираме?', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec cursus libero, in hendrerit dolor. Morbi tristique justo at justo condimentum, euismod fringilla purus venenatis. Ut lacinia ac eros a laoreet. Phasellus semper turpis ac metus semper rhoncus. Nullam volutpat finibus leo et mattis.' }
  ];

  // iloveyou<3

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
        maxWidth: '1400px !important'
      }}
    >
      <Stack
        spacing={3}
        sx={{
          textAlign: 'center',
          mb: { xs: 5, md: 15 },
        }}
      >
        <m.div variants={varFade().inUp}>
          <StyledTextGradient
            animate={{ backgroundPosition: '200% center' }}
            transition={{
              repeatType: 'reverse',
              ease: 'linear',
              duration: 20,
              repeat: Infinity,
            }}
          >
            {t('faq')}
          </StyledTextGradient>
        </m.div>
      </Stack>

      <Grid container spacing={2} justifyContent='space-between' alignItems='center'>
        <Grid xs={12} md={7}>
          <Stack>
            {questions.map((question, index) => (
              <m.div variants={varFade().inUp} key={index}>
                <Box
                  sx={(theme) => ({
                    p: 2.5,
                    borderBottom: `1px solid ${theme.palette.grey[300]}`,
                  })}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      mb: opened === index && 3
                    }}
                    onClick={() => {
                      if (opened === index) {
                        setOpened(null);
                      } else {
                        setOpened(index);
                      }
                    }}
                  >
                    <Typography variant='body1' component='div'>{question.title}</Typography>
                    <m.div
                      variants={rotateVariants}
                      animate={opened === index ? 'opened' : 'closed'}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <KeyboardArrowRightIcon />
                    </m.div>
                  </Box>

                  <m.div
                    variants={visabilityVariants}
                    animate={opened === index ? 'visible' : 'hidden'}
                    initial="hidden"
                    transition={{ opacity: { duration: 0.2 }, height: { duration: 0.2, delay: 0 } }}
                  >
                    {question.content}
                  </m.div>
                </Box>
              </m.div>
            ))}
          </Stack>
        </Grid>
        <Grid xs={12} md={4}>
          <m.div variants={varBounce().in}>
            <img src='/assets/images/home/faq/illustration-faq.svg' />
          </m.div>
        </Grid>
      </Grid>

    </Container>
  );
}

