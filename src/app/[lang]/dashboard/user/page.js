import { UserListView } from 'src/sections/user/view';
// api
import { getUsers } from 'src/api/user';
import { getRoles } from 'src/api/role';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: User List',
};

async function getData(pagination, order, filters) {
  try {
    const usersRes = await getUsers(pagination, order, filters);
    const rolesRes = await getRoles();

    const result = usersRes.data;
    
    return { users: result.data, usersCount: result.total, roles: rolesRes.data };
  } catch (error) {
    return { error };
  }
}

export default async function UserListPage({ searchParams }) {
  const { page, limit, orderBy, direction, full_name, email, role } = searchParams;

  const pagination = { page: Number(page) || 1, limit: Number(limit) || 5 };

  const order = { orderBy, direction };

  const filters = [{ id: 'full_name', value: full_name }, { id: 'email', value: email }, { id: 'role', value: role }];

  const { users, userCount, roles, error } = await getData(pagination, order, filters);

  if(error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <UserListView users={users} usersCount={userCount} roles={roles} />;
}
