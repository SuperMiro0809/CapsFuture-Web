'use server'

import axios from 'src/utils/axios';
import { REST_API } from "src/config-global";

export async function getOrders(lang) {
    const URL = `${REST_API}/orders?lang=${lang}`;

    try {
        const res = await axios.get(URL);

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        return { error: message };
    }
}

export async function createOrder(data) {
    const URL = `${REST_API}/orders`;

    try {
        const res = await axios.post(URL, data);

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        return { error: message };
    }
}

export async function getOrderPaymentAccess(orderNumber, token) {
    const URL = `${REST_API}/orders/${orderNumber}/payment/access?token=${token}`;

    try {
        const res = await axios.get(URL);
        
        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        return { error: message };
    }
}

export async function editPaymentStatus(orderNumber, data) {
    const URL = `${REST_API}/orders/${orderNumber}/payment/status`;

    try {
        const res = await axios.put(URL, data);

        return { status: res.data, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        return { error: message };
    }
}