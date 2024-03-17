import axios from 'axios';

import { REST_API } from 'src/config-global';

import { getTokenCookie } from './token-cookie';

// ----------------------------------------------------------------------

const isServer = () => {
  return typeof window === 'undefined';
}

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: REST_API });

axiosInstance.interceptors.request.use(async (config) => {
  let accessToken = '';

  if (isServer()) {
    accessToken = await getTokenCookie();
  } else {
    const res = await fetch('http://localhost:3032/api/auth/token');
    const resData = await res.json();
    accessToken = resData?.token;
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
},
  (error) => {
    console.log(error)
  }
)

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    profile: '/auth/profile',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    changePassword: (id) => `/auth/${id}/change-password`
  },
  post: {
    list: '/post/list',
    details: '/post/details',
    latest: '/post/latest',
    search: '/post/search',
  },
  product: {
    list: '/product/list',
    details: '/product/details',
    search: '/product/search',
  },
};
