'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useTranslate } from 'src/locales';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProductNewEditForm from '../product-new-edit-form';

// ----------------------------------------------------------------------

export default function ProductCreateView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('create-new-product', { ns: 'ecommerce' })}
        links={[
          {
            name: t('dashboard', { ns: 'headers' }),
            href: paths.dashboard.root,
          },
          {
            name: t('products', { ns: 'headers' }),
            href: paths.dashboard.product.root,
          },
          { name: t('new-product', { ns: 'ecommerce' }) },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductNewEditForm />
    </Container>
  );
}
