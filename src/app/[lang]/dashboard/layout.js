'use client';

import PropTypes from 'prop-types';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <AuthGuard>
      <RoleBasedGuard
        hasContent
        roles={['Admin']}
        sx={{
          position: 'relative',
          transform: 'translate(0, -50%)',
          top: '50%'
        }}
      >
        <DashboardLayout>{children}</DashboardLayout>
      </RoleBasedGuard>
    </AuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
