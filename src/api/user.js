'use server'

import axios from 'src/utils/axios';
import { REST_API } from 'src/config-global';

export async function getUsers(pagination, order, filters) {
  let URL = `${REST_API}/users?page=${pagination.page}&limit=${pagination.limit}`;

  if (filters.length > 0) {
    filters.forEach((filter) => {
      if (filter.value) {
        URL += `&${filter.id}=${filter.value}`;
      }
    })
  }

  if (order?.orderBy && order?.direction) {
    URL += `&field=${order.orderBy}&direction=${order.direction}`;
  }

  return axios.get(URL);
}

export async function getUserById(id) {
  try {
    const URL = `${REST_API}/users/${id}`;

    const res = await axios.get(URL);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'object' ? error.message : error;
    throw message;
  }
}

export async function getAllUsers() {
  try {
    const URL = `${REST_API}/users/all`;

    const res = await axios.get(URL);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    return { error: message };
  }
}

export async function createUser(data) {
  try {
    const URL = `${REST_API}/users`;

    const res = await axios.post(URL, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'object' ? error.message : error;
    throw message;
  }
}

export async function editUser(id, data) {
  try {
    const URL = `${REST_API}/users/${id}?_method=PUT`;

    const res = await axios.post(URL, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'object' ? error.message : error;
    throw message;
  }
}

export async function deleteUser(id) {
  const URL = `${REST_API}/users/${id}`;

  try {
    const res = await axios.delete(URL);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'object' ? error.message : error;
    throw message;
  }
}

export async function deleteUsers(ids) {
  const URL = `${REST_API}/users/deleteMany`;

  try {
    const res = await axios.delete(URL, {
      data: { ids }
    });

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'object' ? error.message : error;
    throw message;
  }
}