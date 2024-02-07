'use client'

import { m } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useRouter } from 'src/routes/hooks';
import { i18n as i18nConfig } from 'i18n.config';
// @mui
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
// locales
import { useLocales } from 'src/locales';
// components
import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const popover = usePopover();

  const pathName = usePathname();

  const router = useRouter();

  const { allLangs, currentLang } = useLocales();

  const redirectedPathName = (locale) => {
    if (!pathName) {
      router.push('/');
      return;
    }

    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = '; expires=' + date.toUTCString();
    document.cookie = `NEXT_LOCALE=${locale}${expires};path=/`;

    // redirect
    if(currentLang.value === i18nConfig.defaultLocale) {
      router.push('/' + locale + pathName);
    }else {
      router.push(pathName.replace(`/${currentLang.value}`, `/${locale}`));
    }

    // router.push(pathName.replace(`/${currentLang.value}`, `/${locale}`));

    // const pathnameIsMissingLocale = i18nConfig.locales.every(
    //   locale => !pathName.startsWith(`/${locale}/`) && pathName !== `/${locale}`
    // );

    // if (pathnameIsMissingLocale) {
    //   if (locale === i18nConfig.defaultLocale) {
    //     router.push(pathName);
    //   }else {
    //     router.push(`/${locale}${pathName}`);
    //   }
    // } else {
    //   if (locale === i18nConfig.defaultLocale) {
    //     const segments = pathName.split('/');
    //     const isHome = segments.length === 2;
    //     if (isHome) {
    //       router.push('/');
    //     }else {
    //       segments.splice(1, 1);
    //       router.push(segments.join('/'));
    //     }
    //   }else {
    //     const segments = pathName.split('/');
    //     segments[1] = locale;
    //     router.push(segments.join('/'));
    //   }
    // }

    router.refresh();
  }

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          ...(popover.open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <Iconify icon={currentLang.icon} sx={{ borderRadius: 0.65, width: 28 }} />
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 160 }}>
        {allLangs.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === currentLang.value}
            onClick={() => redirectedPathName(option.value)}
          >
            <Iconify icon={option.icon} sx={{ borderRadius: 0.65, width: 28 }} />

            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
