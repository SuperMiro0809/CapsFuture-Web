import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useTranslate } from 'src/locales';
// components
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  campaign: icon('ic_campaign'),
  station: icon('ic_station'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('overview'),
        items: [
          {
            title: t('home'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
          // {
          //   title: t('ecommerce'),
          //   path: paths.dashboard.general.ecommerce,
          //   icon: ICONS.ecommerce,
          // },
          // {
          //   title: t('analytics'),
          //   path: paths.dashboard.general.analytics,
          //   icon: ICONS.analytics,
          // },
          // {
          //   title: t('banking'),
          //   path: paths.dashboard.general.banking,
          //   icon: ICONS.banking,
          // },
          // {
          //   title: t('booking'),
          //   path: paths.dashboard.general.booking,
          //   icon: ICONS.booking,
          // },
          // {
          //   title: t('file'),
          //   path: paths.dashboard.general.file,
          //   icon: ICONS.file,
          // },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('management'),
        items: [
          // CAMPAIGN
          {
            title: t('campaigns'),
            path: paths.dashboard.campaign.root,
            icon: ICONS.campaign
          },

          // PRODUCT
          {
            title: t('products'),
            path: paths.dashboard.product.root,
            icon: ICONS.product
          },

          // STATION
          {
            title: t('stations'),
            path: paths.dashboard.station.locations.root,
            icon: ICONS.station,
            // children: [
            //   { title: t('locations'), path: paths.dashboard.station.locations.root },
            //   { title: t('requests'), path: paths.dashboard.station.requests }
            // ]
          },

          // POST
          {
            title: t('posts'),
            path: paths.dashboard.post.root,
            icon: ICONS.blog
          },

          // USER
          {
            title: t('users'),
            path: paths.dashboard.user.root,
            icon: ICONS.user
          }
        ],
      },
    ],
    [t]
  );

  return data;
}
