'use client';

import PropTypes from 'prop-types';
import { useEffect } from 'react';
// @mui
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams, usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// api
import { deleteUser, deleteUsers } from 'src/api/user';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useTable } from 'src/components/table';
import TableBuilder from 'src/components/table-builder';
import { useSnackbar } from 'src/components/snackbar';
// utils
import { makeQuery } from 'src/utils/url-query';
// i18n
import { useTranslate } from 'src/locales';

export default function UserListView({ users, usersCount, roles }) {
  const { t } = useTranslate();

  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const rolesOptions = roles.map((role) => ({ label: role.name, value: role.id }));

  const fullNameFilterValue = searchParams.get('full_name');
  const emailFilterValue = searchParams.get('email');
  const roleFilterValue = Number(searchParams.get('role')) || null;
  const tableFilters = [
    { type: 'search', name: 'full_name', placeholder: 'Търси по Име', value: fullNameFilterValue },
    { type: 'search', name: 'email', placeholder: 'Tърси по Имейл', value: emailFilterValue },
    { 
      type: 'select',
      name: 'role',
      placeholder: t('role', { ns: 'forms' }),
      options: rolesOptions,
      getOptionLabel: (option) => option?.label || rolesOptions.find((role) => role.value === option)?.label,
      isOptionEqualToValue: (option, value) => option.value === value,
      value: roleFilterValue
    },
  ];

  let defaultCurrentPage = 0;
  if (Number(searchParams.get('page'))) {
    defaultCurrentPage = Number(searchParams.get('page')) === 0 ? Number(searchParams.get('page')) : Number(searchParams.get('page')) - 1;
  }

  const defaultRowsPerPage = Number(searchParams.get('limit')) || 5;
  const defaultOrderBy = searchParams.get('orderBy') || 'full_name';
  const defaultOrder = searchParams.get('direction') || 'asc';

  const table = useTable({
    filters: tableFilters,
    defaultCurrentPage,
    defaultRowsPerPage,
    defaultOrderBy,
    defaultOrder
  });

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const TABLE_HEAD = [
    { id: 'full_name', type: 'text-with-image', label: t('full-name', { ns: 'forms' }), imageSelector: 'avatar_photo_path', imageVariant: 'circular' },
    { id: 'email', label: t('email', { ns: 'forms' }), width: 180 },
    { id: 'phone', label: t('phone', { ns: 'forms' }), width: 400 },
    { id: 'role_name', type: 'chip', label: t('role', { ns: 'forms' }), getColor: (value) => value === 'Admin' ? 'primary' : 'secondary', width: 100 }
  ];

  const handleDelete = async (ids) => {
    try {
      if (ids.length === 1) {
        const id = ids[0];

        await deleteUser(id);
      } else {
        await deleteUsers(ids);
      }

      enqueueSnackbar(t('delete-success'));
      router.refresh();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }

  useEffect(() => {
    const pagination = {
      page: table.page + 1,
      limit: table.rowsPerPage
    }

    const order = {
      orderBy: table.orderBy,
      direction: table.order
    }

    const query = makeQuery(searchParams, pagination, order, table.filters);

    router.push(`${pathname}${query}`);
  }, [pathname, router, searchParams, table.page, table.rowsPerPage, table.orderBy, table.order, table.filters])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('users', { ns: 'forms' })}
        links={[
          { name: t('dashboard', { ns: 'headers' }), href: paths.dashboard.root },
          { name: t('users', { ns: 'forms' }) }
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.user.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            color='secondary'
          >
            {t('new-user', { ns: 'profile' })}
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <TableBuilder
          table={table}
          tableHead={TABLE_HEAD}
          tableData={users}
          tableTotal={usersCount}
          tableFilters={tableFilters}
          deleteHandler={handleDelete}
        />
      </Card>
    </Container>
  );
}

UserListView.propTypes = {
  users: PropTypes.array,
  usersCount: PropTypes.number
}
