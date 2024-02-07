'use client';

import PropTypes from 'prop-types';

import { GuestGuard } from 'src/auth/guard';
import AuthClassicLayout from 'src/layouts/auth/classic';

import Header from 'src/layouts/main/header';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <>
    {/* <Header /> */}
    <GuestGuard>
      <AuthClassicLayout>{children}</AuthClassicLayout>
    </GuestGuard>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
