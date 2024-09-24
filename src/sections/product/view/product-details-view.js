'use client';

import PropTypes from 'prop-types';
import { useState, useEffect, useCallback, useTransition } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
// api
import { editProduct } from 'src/api/product';
// locales
import { useTranslate } from 'src/locales';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import { useSnackbar } from 'src/components/snackbar';
//
import ProductDetailsSummary from '../product-details-summary';
import ProductDetailsToolbar from '../product-details-toolbar';
import ProductDetailsCarousel from '../product-details-carousel';
import ProductDetailsDescription from '../product-details-description';

// ----------------------------------------------------------------------

export default function ProductDetailsView({ product, productError }) {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const router = useRouter();

  const [currentTab, setCurrentTab] = useState('description');

  const [active, setActive] = useState('');

  const [isEditActivePending, startEditActiveTransition] = useTransition();

  const { enqueueSnackbar } = useSnackbar();

  const PRODUCT_ACTIVE_OPTIONS = [
    { label: t('active', { ns: 'common' }), value: 1 },
    { label: t('inactive', { ns: 'common' }), value: 0 }
  ];

  useEffect(() => {
    if (product) {
      setActive(product?.active);
    }
  }, [product]);

  const handleChangeActive = useCallback(async (newValue) => {
    const data = new FormData();
    data.append('active', Number(newValue));
    // :)
    // <3

    startEditActiveTransition(async () => {
      try {
        const res = await editProduct(product.id, data);

        enqueueSnackbar(t('edit-success', { ns: 'messages' }));
        router.refresh();
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    });
  }, []);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const renderError = (
    <EmptyContent
      filled
      title={productError}
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.product.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Back to List
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderProduct = product && (
    <>
      <ProductDetailsToolbar
        backLink={paths.dashboard.product.root}
        editLink={paths.dashboard.product.edit(`${product?.id}`)}
        liveLink={paths.store.details(`${product?.slug}`)}
        active={active}
        onChangeActive={handleChangeActive}
        isActiveLoading={isEditActivePending}
        activeOptions={PRODUCT_ACTIVE_OPTIONS}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }} sx={{ mb: 5 }}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel product={product} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          <ProductDetailsSummary disabledActions product={product} />
        </Grid>
      </Grid>

      <Card>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {[
            {
              value: 'description',
              label: t('description', { ns: 'forms' }),
            },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {currentTab === 'description' && (
          <ProductDetailsDescription description={product?.description} />
        )}
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {productError && renderError}

      {product && renderProduct}
    </Container>
  );
}

ProductDetailsView.propTypes = {
  id: PropTypes.string,
};
