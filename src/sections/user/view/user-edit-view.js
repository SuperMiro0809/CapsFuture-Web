'use client';

import PropTypes from 'prop-types';
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
import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

export default function UserEditView({ user, roles }) {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('edit', { ns: 'common' })}
        links={[
          {
            name: t('dashboard', { ns: 'headers' }),
            href: paths.dashboard.root,
          },
          {
            name: t('users', { ns: 'forms' }),
            href: paths.dashboard.user.root,
          },
          { name: user?.full_name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm currentUser={user} roles={roles} />
    </Container>
  );
}

UserEditView.propTypes = {
  user: PropTypes.object,
  roles: PropTypes.array
};
