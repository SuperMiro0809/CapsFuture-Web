'use server'

import axios from 'src/utils/axios';
import { REST_API } from 'src/config-global';

export async function getLocations(filters) {
  try {
    let URL = `${REST_API}/locations?`;

    if (filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.value) {
          URL += `&${filter.id}=${filter.value}`;
        }
      })
    }

    const res = await axios.get(URL);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    return { error: message };
  }

}

export async function getLocationById(id) {
  try {
    const URL = `${REST_API}/locations/${id}`;

    const res = await axios.get(URL);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    return { error: message };
  }
}

export async function createLocation(data) {
  try {
    const URL = `${REST_API}/locations`;

    const res = await axios.post(URL, data);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    return { error: message };
  }
}

export async function editLocation(id, data) {
  try {
    const URL = `${REST_API}/locations/${id}`;

    const res = await axios.put(URL, data);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    return { error: message };
  }
}

export async function deleteLocation(id) {
  try {
    const URL = `${REST_API}/locations/${id}`;

    const res = await axios.delete(URL);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    return { error: message };
  }
}

// ----------------------------------------------------------------------

export async function getLocationTypes() {
  try {
    const URL = `${REST_API}/locations/types`;

    const res = await axios.get(URL);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    return { error: message };
  }
}
