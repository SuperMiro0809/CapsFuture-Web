// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
// auth
import { useAuthContext } from 'src/auth/hooks/use-auth-context';
// locales
import { useTranslate } from 'src/locales';
// theme
import { bgBlur } from 'src/theme/css';
// components
import Logo from 'src/components/logo';
//
import NavMobile from './nav/mobile';
import NavDesktop from './nav/desktop';
import { HEADER } from '../config-layout';
import { navConfig } from './config-navigation';
import LoginButton from '../common/login-button';
import HeaderShadow from '../common/header-shadow';
import CartButton from '../common/cart-button';
import LanguagePopover from '../common/language-popover';
import AccountPopover from '../common/account-popover';
import DonateButton from '../common/donate-button';

// ----------------------------------------------------------------------

export default function Header() {
  const { t } = useTranslate();

  const { user } = useAuthContext();

  const navConfigTranslated = navConfig.map((list) => ({ ...list, title: t(list.title, { ns: 'headers' }) }));
  // const t = useTranslations('Common');

  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const smUp = useResponsive('up', 'sm');

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(['height'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offsetTop && {
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
        }}
      >
        <Container
          sx={{
            height: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: {
              md: 1400
            }
          }}>
          {/* <Badge
            sx={{
              [`& .${badgeClasses.badge}`]: {
                top: 8,
                right: -16,
              },
            }}
            badgeContent={
              <Link
                href={paths.changelog}
                target="_blank"
                rel="noopener"
                underline="none"
                sx={{ ml: 1 }}
              >
                <Label color="info" sx={{ textTransform: 'unset', height: 22, px: 0.5 }}>
                  v5.6.0
                </Label>
              </Link>
            }
          >
            <Logo />
          </Badge> */}

          <Logo />

          {mdUp && <NavDesktop data={navConfigTranslated} />}

          <Stack alignItems="center" direction={{ xs: 'row', md: 'row-reverse' }}>
            {smUp && (
              <>
                {user ?
                  <Box sx={{ ml: 1 }}>
                    <AccountPopover />
                  </Box>
                  :
                  <LoginButton sx={{ mr: { xs: 1, md: 0 } }} />
                }

                <DonateButton />

                <Box
                  sx={{
                    ml: { xs: 1, md: 0 },
                    mr: { md: 2 },
                  }}
                >
                  <LanguagePopover />
                </Box>

                <CartButton />
              </>
            )}

            {!mdUp && <NavMobile data={navConfigTranslated} />}
          </Stack>
        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
