import { StationLocationsEditView } from 'src/sections/station/locations/views';
// api
import { getLocationById, getLocationTypes } from 'src/api/location';
import { getAllUsers } from 'src/api/user';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Locations Edit',
}

async function getData(id) {
  try {
    const { data: location, error: locationError } = await getLocationById(id);

    if (locationError) throw locationError;

    const { data: locationTypes, error: locationTypesError } = await getLocationTypes();

    if (locationTypesError) throw locationTypesError;

    const { data: users, error: usersError } = await getAllUsers();

    if (usersError) throw usersError;

    return { location, locationTypes, users };
  } catch (error) {
    return { error };
  }
}

export default async function StationLocationsCreatePage({ params }) {
  const { id } = params;

  const { location, locationTypes, users, error } = await getData(id);

  if (error) {
    return <div>{error}</div>
  }

  return <StationLocationsEditView location={location} locationTypes={locationTypes} users={users} />
}