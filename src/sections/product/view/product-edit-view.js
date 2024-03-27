'use client';

import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// locale
import { useTranslate } from 'src/locales';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ProductNewEditForm from '../product-new-edit-form';

// ----------------------------------------------------------------------

export default function ProductEditView({ product }) {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('edit', { ns: 'common' })}
        links={[
          { name: t('dashboard', { ns: 'headers' }), href: paths.dashboard.root },
          {
            name: t('products', { ns: 'headers' }),
            href: paths.dashboard.product.root,
          },
          { name: product?.title },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductNewEditForm currentProduct={product} />
    </Container>
  );
}

ProductEditView.propTypes = {
  product: PropTypes.object,
};
