import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
// routes
import { usePathname } from 'src/routes/hooks';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// auth
import { useAuthContext } from 'src/auth/hooks';
// layouts
import LoginButton from 'src/layouts/common/login-button';
import CartButton from 'src/layouts/common/cart-button';
import LanguagePopover from 'src/layouts/common/language-popover';
// components
import Logo from 'src/components/logo';
import SvgColor from 'src/components/svg-color';
import Scrollbar from 'src/components/scrollbar';
//
import NavList from './nav-list';
import DonateButton from 'src/layouts/common/donate-button';
import AccountPopover from 'src/layouts/common/account-popover';

// ----------------------------------------------------------------------

export default function NavMobile({ data }) {
  const { user } = useAuthContext();

  const pathname = usePathname();

  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (openMenu) {
      handleCloseMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenMenu = useCallback(() => {
    setOpenMenu(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const smDown = useResponsive('down', 'sm');

  return (
    <>
      <IconButton onClick={handleOpenMenu} sx={{ ml: 1 }}>
        <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
      </IconButton>

      <Drawer
        open={openMenu}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            pb: 5,
            width: 260,
          },
        }}
      >
        <Scrollbar>
          <Logo sx={{ mx: 2.5, my: 3 }} />

          {data.map((list) => (
            <NavList key={list.title} data={list} />
          ))}
        </Scrollbar>

        {smDown && (
          <Stack sx={{ px: 1 }} spacing={1}>
            {user ? (
              <Box sx={{ textAlign: 'center' }}>
                <AccountPopover />
              </Box>) :
              <LoginButton sx={{ ml: 0 }} />
            }

            <DonateButton />

            <Box sx={{ textAlign: 'center' }}>
              <CartButton />
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <LanguagePopover />
            </Box>
          </Stack>
        )}
      </Drawer>
    </>
  );
}

NavMobile.propTypes = {
  data: PropTypes.array,
};
