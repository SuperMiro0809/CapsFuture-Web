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
//
import PostNewEditForm from '../post-new-edit-form';

// ----------------------------------------------------------------------

export default function PostCreateView() {
  const { t } = useTranslate();
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('create-new-post')}
        links={[
          {
            name: t('dashboard', { ns: 'headers' }),
            href: paths.dashboard.root,
          },
          {
            name: t('posts', { ns: 'headers' }),
            href: paths.dashboard.post.root,
          },
          {
            name: t('create', { ns: 'common' }),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PostNewEditForm />
    </Container>
  );
}
