import { UserEditView } from 'src/sections/user/view';
// api
import { getUserById } from 'src/api/user';
import { getRoles } from 'src/api/role';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: User Edit',
};

async function getData(id) {
  try {
    const userRes = await getUserById(id);
    const rolesRes = await getRoles();

    return { user: userRes.data, roles: rolesRes.data };
  } catch (error) {
    return { error };
  }
}

export default async function UserEditPage({ params }) {
  const { id } = params;

  const { user, roles, error } = await getData(id);

  if (error) {
    return <div>{JSON.stringify(errpr)}</div>
  }

  return <UserEditView user={user} roles={roles} />;
}
