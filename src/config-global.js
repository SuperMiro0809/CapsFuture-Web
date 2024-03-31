import { paths } from 'src/routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;

export const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN;

export const ECONT_API = process.env.NEXT_PUBLIC_ECONT_API;

export const DSK = {
    api: process.env.NEXT_PUBLIC_DSK_API,
    username: process.env.NEXT_PUBLIC_DSK_USERNAME,
    password: process.env.NEXT_PUBLIC_DSK_PASSWORD
};

export const MAIL = {
    host: process.env.NEXT_PUBLIC_MAIL_HOST,
    port: process.env.NEXT_PUBLIC_MAIL_PORT,
    user: process.env.NEXT_PUBLIC_MAIL_USER,
    password: process.env.NEXT_PUBLIC_MAIL_PASSWORD
}

export const MAPBOX_API = process.env.NEXT_PUBLIC_MAPBOX_API;

export const REST_API = process.env.NEXT_PUBLIC_REST_API;

export const GOOGLE_MAPS = {
    url: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API,
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
};

export const ASSETS = process.env.NEXT_PUBLIC_ASSETS;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.home; // as '/'
