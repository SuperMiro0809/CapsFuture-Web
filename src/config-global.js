import { paths } from 'src/routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;

export const MAPBOX_API = process.env.NEXT_PUBLIC_MAPBOX_API;

export const REST_API = process.env.NEXT_PUBLIC_REST_API;

export const GOOGLE_MAPS = {
    url: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API,
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
};

export const ASSETS = process.env.NEXT_PUBLIC_ASSETS;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.home; // as '/'
