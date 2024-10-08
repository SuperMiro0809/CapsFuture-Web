'use server'

import axios from 'src/utils/axios';
import { REST_API } from 'src/config-global';

export async function getPosts(pagination, order, filters, lang) {
  try {
    let URL = `${REST_API}/posts?page=${pagination.page}&limit=${pagination.limit}&lang=${lang}`;

    if (filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.value) {
          URL += `&${filter.id}=${filter.value}`
        }
      })
    }

    if (order?.orderBy && order?.direction) {
      URL += `&field=${order.orderBy}&direction=${order.direction}`;
    }

    const res = await axios.get(URL);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = error.message || 'Възникна грешка';
    throw message;
  }
}

export async function getAllPosts(lang, order = {}, filters = []) {
  let URL = `${REST_API}/posts/all?lang=${lang}`;

  if (filters.length > 0) {
    filters.forEach((filter) => {
      if (filter.value) {
        URL += `&${filter.id}=${filter.value}`
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
    return { error: message };
  }
}

export async function getPostBySlug(slug, lang) {
  try {
    const URL = `${REST_API}/posts/${slug}?lang=${lang}`;

    const res = await axios.get(URL);

    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'object' ? error.message : error;
    return { error: message }
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

// ----------------------------------------------------------------------

export async function createComment(postId, data) {
  try {
    const URL = `${REST_API}/posts/${postId}/comments`;

    const res = await axios.post(URL, data);
    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    return { error: message };
  }
}

export async function createReply(postId, commentId, data) {
  try {
    const URL = `${REST_API}/posts/${postId}/comments/${commentId}/reply`;

    const res = await axios.post(URL, data);
    return { status: res.status, data: res.data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    return { error: message };
  }
}