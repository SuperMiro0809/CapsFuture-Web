import { UserCreateView } from 'src/sections/user/view';
// api
import { getRoles } from 'src/api/role';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Create a new user',
};

async function getData() {
  try {
    const res = await getRoles();

    return { roles: res.data };
  } catch (error) {
    return { error };
  }
}

export default async function UserCreatePage() {
  const { roles, error } = await getData();

  if(error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <UserCreateView roles={roles} />;
}
