import { MapHomeView } from 'src/sections/map/views';
import { getLocations } from 'src/api/location';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Map',
};

async function getData(filters) {
  const { data: locations, error } = await getLocations(filters);

  return { locations, error };
}

export default async function MapPage({ params, searchParams }) {
  const { lang } = params;

  const { search } = searchParams;

  const filters = [{ id: 'name', value: search }];

  const { locations, error } = await getData(filters);

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <MapHomeView locations={locations} />;
}
