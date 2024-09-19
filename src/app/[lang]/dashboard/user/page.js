import { UserListView } from 'src/sections/user/view';
// api
import { getAllUsers } from 'src/api/user';
import { getRoles } from 'src/api/role';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: User List',
};

async function getData() {
  try {
    const { data: users, error: usersError } = await getAllUsers();

    if (usersError) throw usersError;

    const rolesRes = await getRoles();
    
    return { users, roles: rolesRes.data };
  } catch (error) {
    return { error };
  }
}

export default async function UserListPage() {
  const { users, roles, error } = await getData();

  if(error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <UserListView users={users} roles={roles} />;
}
