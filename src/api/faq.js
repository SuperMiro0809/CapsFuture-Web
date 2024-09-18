'use server'

import axios from 'src/utils/axios';
import { REST_API } from 'src/config-global';

export async function getAllFaqs(lang) {
    const URL = `${REST_API}/faqs?lang=${lang}`;

    try {
        const res = await axios.get(URL);

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        return { error: message };
    }
}

export async function createManyFaqs(data) {
    const URL = `${REST_API}/faqs/createMany`;

    try {
        const res = await axios.post(URL, data);

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        return { error: message };
    }
}

export async function editManyFaqs(data) {
    const URL = `${REST_API}/faqs/updateMany`;

    try {
        const res = await axios.put(URL, data);

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        return { error: message };
    }
}

export async function deleteManyFaqs(ids) {
    const URL = `${REST_API}/faqs/deleteMany`;

    try {
        const res = await axios.delete(URL, {
            data: { ids }
        });

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        return { error: message };
    }
}