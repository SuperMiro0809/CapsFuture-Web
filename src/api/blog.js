'use server'

import axios from 'src/utils/axios';
import { REST_API } from 'src/config-global';

export async function getPosts(pagination, order, filters, lang) {
  try {
    let URL = `${REST_API}/posts?page=${pagination.page}&limit=${pagination.limit}&lang=${lang}`;

    if (filters.length > 0) {
      filters.forEach((filter) => {
        URL += `&${filter.id}=${filter.value}`
      })
    }

    if (order?.field && order?.direction) {
      URL += `&field=${order.field}&direction=${order.direction}`;
    }

    const res = await axios.get(URL);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = error.message || 'Възникна грешка';
    throw message;
  }
}

export async function getPostBySlug(slug, lang) {
  try {
    const URL = `${REST_API}/posts/${slug}?lang=${lang}`;

    const res = await axios.get(URL);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'object' ? error.message : error;
    throw message;
  }
}

export async function createPost(data) {
  try {
    const URL = `${REST_API}/posts`;

    const res = await axios.post(URL, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = error.message || 'Възникна грешка';
    throw message;
  }
}

export async function editPost(id, data) {
  try {
    const URL = `${REST_API}/posts/${id}?_method=PUT`;

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

export async function deletePost(id) {
  try {
    const URL = `${REST_API}/posts/${id}`;

    const res = await axios.delete(URL);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    throw message;
  }
}

export async function deletePosts(ids) {
  try {
    const URL = `${REST_API}/posts/deleteMany`;

    const res = await axios.delete(URL, {
      data: { ids }
    });

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    throw message;
  }
}