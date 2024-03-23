import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// locales
import { useTranslate } from 'src/locales';
// components
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const LINKS_ONE = [
  { name: 'campaigns', href: paths.campaign.root },
  { name: 'map', href: paths.map },
  { name: 'store', href: paths.store.root },
];

const LINKS_TWO = [
  { name: 'about-us', href: paths.about },
  { name: 'posts', href: paths.post.root },
  { name: 'contacts', href: paths.about },
];

// ----------------------------------------------------------------------

export default function Footer() {
  const { t } = useTranslate();

  const pathname = usePathname();

  const homePage = pathname === '/';

  const mdUp = useResponsive('up', 'md');

  const socials = [
    {
      name: 'Facebook',
      color: '#1877F2',
      icon: 'eva:facebook-fill',
      href: 'https://www.facebook.com/kapachkizabudeshte/?locale=bg_BG'
    },
    {
      name: 'Instagram',
      color: '#E02D69',
      icon: 'ant-design:instagram-filled',
      href: 'https://www.instagram.com/kapachkizabudeshte/'
    }
  ]

  const simpleFooter = (
    <Box
      component="footer"
      sx={{
        py: 5,
        textAlign: 'center',
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Container>
        <Logo sx={{ mb: 1, mx: 'auto' }} />

        <Typography variant="caption" component="div">
          ©  {t('all-rights-reserved')}
        </Typography>
      </Container>
    </Box>
  );

  const mainFooter = (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Divider />

      <Container
        sx={{
          maxWidth: '1400px !important',
          pt: 10,
          pb: 5,
          textAlign: { xs: 'center', md: 'unset' },
        }}
      >
        {mdUp ? (
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems='center'
            justifyContent='center'
            spacing={8}
            sx={{ pb: 3 }}
          >
            {LINKS_ONE.map((link) => (
              <Link
                key={link.name}
                component={RouterLink}
                href={link.href}
                color="inherit"
                variant="body2"
              >
                <Typography variant='subtitle1'>{t(link.name)}</Typography>
              </Link>
            ))}

            <Logo sx={{ mx: 10 }} />

            {LINKS_TWO.map((link) => (
              <Link
                key={link.name}
                component={RouterLink}
                href={link.href}
                color="inherit"
                variant="body2"
              >
                <Typography variant='subtitle1'>{t(link.name)}</Typography>
              </Link>
            ))}
          </Stack>
        ) : (
          <Box>
            <Logo sx={{ mb: 4 }} />

            <Grid container spacing={2} sx={{ pb: 3 }}>
              <Grid xs={12} sm={6}>
                <Stack spacing={2}>
                  {LINKS_ONE.map((link) => (
                    <Link
                      key={link.name}
                      component={RouterLink}
                      href={link.href}
                      color="inherit"
                      variant="body2"
                    >
                      <Typography variant='subtitle1'>{t(link.name)}</Typography>
                    </Link>
                  ))}
                </Stack>
              </Grid>

              <Grid xs={12} sm={6}>
                <Stack spacing={2}>
                  {LINKS_TWO.map((link) => (
                    <Link
                      key={link.name}
                      component={RouterLink}
                      href={link.href}
                      color="inherit"
                      variant="body2"
                    >
                      <Typography variant='subtitle1'>{t(link.name)}</Typography>
                    </Link>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        )}

        <Divider />

        <Stack
          direction='row'
          justifyContent={'center'}
          sx={{
            mt: 3,
            mb: { xs: 5, md: 0 },
          }}
          spacing={2}
        >
          {socials.map((social) => (
            <IconButton
              component={Link}
              key={social.name}
              sx={{
                '&:hover': {
                  bgcolor: alpha(social.color, 0.08),
                },
              }}
              size='large'
              href={social.href}
              target='_blank'
            >
              <Iconify color={social.color} icon={social.icon} />
            </IconButton>
          ))}
        </Stack>

        <Typography variant="body2" sx={{ mt: 8, textAlign: 'center' }}>
          © 2024. {t('all-rights-reserved')}
        </Typography>
      </Container>
    </Box>
  );

  // return homePage ? simpleFooter : mainFooter;
  return simpleFooter;
}
