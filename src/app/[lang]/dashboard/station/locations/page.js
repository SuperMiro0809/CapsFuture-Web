import { StationLocationsListView } from 'src/sections/station/locations/views';
// api
import { getLocations } from 'src/api/location';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Station Locations',
};

async function getData() {
  const { data, error } = await getLocations([]);

  return { locations: data, error };
}

export default async function StationLocationsPage({ params }) {
  const { lang } = params;

  const { locations, error } = await getData();

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <StationLocationsListView locations={locations} />;
}
