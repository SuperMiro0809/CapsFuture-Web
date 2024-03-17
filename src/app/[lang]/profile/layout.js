'use client';

import PropTypes from 'prop-types';

import { AuthGuard } from 'src/auth/guard';
import MainLayout from 'src/layouts/main';


// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
