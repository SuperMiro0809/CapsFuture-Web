import 'src/global.css';

// // i18n
// import 'src/locales/i18n';

// ----------------------------------------------------------------------

import PropTypes from 'prop-types';

import { LocalizationProvider } from 'src/locales';
import TranslationsProvider from 'src/locales/translations-provider';

import ThemeProvider from 'src/theme';
import { primaryFont } from 'src/theme/typography';

import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';

import { CheckoutProvider } from 'src/sections/checkout/context';

import { AuthProvider } from 'src/auth/context';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Капачки за бъдеще',
  description: 'Капачки за бъдеще е благотворителна инициатива в България, която се бори за подобряване на живота на децата чрез събиране на пластмасови капачки за рециклиране. Средствата от рециклирането се използват за закупуване на кувьози за новородени, специализирани линейки за деца и подкрепа на кампании за детско здраве. Нашата цел е да създадем по-здравословна и безопасна среда за нашите деца, насърчавайки екологичната отговорност сред общността. Присъединете се към нас в тази кауза и помогнете за изграждането на по-добро бъдеще за децата.',
  keywords: 'рециклиране на капачки,благотворителност България,екологично съзнание,помощ за общността,устойчиво развитие,опазване на околната среда,дарение на капачки,социални проекти,зелени инициативи,пластмасови капачки рециклиране,рециклиране за детско здраве,кувьози за новородени дарение,специализирани детски линейки,благотворителни кампании за деца,помощ за болни деца,зелени кампании България,кологично съзнание и детско благополучие',
  manifest: '/manifest.json',
  icons: [
    {
      rel: 'icon',
      url: '/favicon/favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon/favicon-16x16.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon/favicon-32x32.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/favicon/apple-touch-icon.png',
    },
  ],
};

export const viewport = {
  themeColor: '#000000'
}

export default function RootLayout({ children, params }) {
  const { lang } = params;

  return (
    <html lang={lang} className={primaryFont.className}>
      <body>
        <AuthProvider>
          <LocalizationProvider>
            <TranslationsProvider locale={lang}>
              <SettingsProvider
                defaultSettings={{
                  themeMode: 'light', // 'light' | 'dark'
                  themeDirection: 'ltr', //  'rtl' | 'ltr'
                  themeContrast: 'default', // 'default' | 'bold'
                  themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                  themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                  themeStretch: true,
                }}
              >
                <ThemeProvider>
                  <MotionLazy>
                    <SnackbarProvider>
                      <CheckoutProvider>
                        <SettingsDrawer />
                        <ProgressBar />
                        {children}
                      </CheckoutProvider>
                    </SnackbarProvider>
                  </MotionLazy>
                </ThemeProvider>
              </SettingsProvider>
            </TranslationsProvider>
          </LocalizationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node,
};
