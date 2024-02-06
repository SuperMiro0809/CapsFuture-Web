import { StationLocationsCreateView } from 'src/sections/station/locations/views';
// api
import { getLocationTypes } from 'src/api/location';
import { getAllUsers } from 'src/api/user';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Locations Create',
}

async function getData() {
  try {
    const { data: locationTypes, error: locationTypesError } = await getLocationTypes();

    if (locationTypesError) throw locationTypesError;

    const { data: users, error: usersError } = await getAllUsers();

    if (usersError) throw usersError;

    return { locationTypes, users };

  } catch (error) {
    return { error };
  }
}

export default async function StationLocationsCreatePage() {
  const { locationTypes, users, error } = await getData();

  if (error) {
    return <div>{error}</div>
  }

  return <StationLocationsCreateView locationTypes={locationTypes} users={users} />
}