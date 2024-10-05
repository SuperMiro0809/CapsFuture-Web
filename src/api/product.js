'use server'

import axios from 'src/utils/axios';
import { REST_API } from 'src/config-global';

export async function getProducts(pagination, order, filters, lang) {
  let URL = `${REST_API}/products?page=${pagination.page}&limit=${pagination.limit}&lang=${lang}`;

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

  try {
    const res = await axios.get(URL);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    throw message;
  }
}

export async function getAllProducts(lang, filters = []) {
  let URL = `${REST_API}/products/all?lang=${lang}`;

  if (filters.length > 0) {
    filters.forEach((filter) => {
      if (filter.value) {
        URL += `&${filter.id}=${filter.value}`;
      }
    })
  }

  try {
    const res = await axios.get(URL);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    return { error: message };
  }
}

export async function getProductById(id) {
  const URL = `${REST_API}/products/${id}`;

  try {
    const res = await axios.get(URL);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    return { error: message };
  }
}

export async function getProductDetails(lang, slug) {
  const URL = `${REST_API}/products/${slug}/details?lang=${lang}`;

  try {
    const res = await axios.get(URL);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    return { error: message };
  }
}

export async function getLatestProducts(lang) {
  const URL = `${REST_API}/products/latest?lang=${lang}`;

  try {
    const res = await axios.get(URL);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    return { error: message };
  }
}

export async function createProduct(data) {
  const URL = `${REST_API}/products`;

  try {
    const res = await axios.post(URL, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    throw message;
  }
}

export async function editProduct(id, data) {
  const URL = `${REST_API}/products/${id}?_method=PUT`;

  try {
    const res = await axios.post(URL, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    throw message;
  }
}

export async function deleteProduct(id) {
  const URL = `${REST_API}/products/${id}`;

  try {
    const res = await axios.delete(URL);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    throw message;
  }
}

export async function deleteProducts(ids) {
  const URL = `${REST_API}/products/deleteMany`;

  try {
    const res = await axios.delete(URL, {
      data: { ids }
    });

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    throw message;
  }
}