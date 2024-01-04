'use server'

import axios from 'src/utils/axios';
import { REST_API } from 'src/config-global';

export async function getCampaigns(pagination, order, filters) {
    try {
        let URL = `${REST_API}/campaigns?page=${pagination.page}&limit=${pagination.limit}`;

        if(filters.length > 0) {
            filters.forEach((filter) => {
                URL += `&${filter.id}=${filter.value}`
            })
        }
    
        if(order?.field && order?.direction) {
            URL += `&field=${order.field}&direction=${order.direction}`;
        }

        const res = await axios.get(URL);
    
        return { status: res.status, data: res.data };
    } catch (error) {
        const message = error.message || 'Възникна грешка';
        throw message;
    }
}

export async function getCampaignById(id) {
    const URL = `${REST_API}/campaigns/${id}`;

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

export async function deleteCampaign(id) {
    try {
        const URL = `${REST_API}/campaigns/${id}`;

        const res = await axios.delete(URL);

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        throw message;
    }
}

export async function deleteCampaigns(ids) {
    try {
        const URL = `${REST_API}/campaigns/deleteMany`;

        const res = await axios.delete(URL, {
            data: { ids }
        });

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        throw message;
    }
}