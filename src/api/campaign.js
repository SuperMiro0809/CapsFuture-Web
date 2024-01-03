'use server'

import { cookies } from 'next/headers';

import axios from 'src/utils/axios';
import { REST_API } from 'src/config-global';

export async function getCampaigns(pagination) {
    const URL = `${REST_API}/campaigns?page=${pagination.page}&limit=${pagination.limit}`;

    const res = await axios.get(URL);

    return { status: res.status, data: res.data };
}

export async function createCampaign(data) {
    try {
        const URL = `${REST_API}/campaigns`;

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