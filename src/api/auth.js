'use server'

import axios, { endpoints } from 'src/utils/axios';

export async function register(data) {
    const res = await axios.post(endpoints.auth.register, data);

    return { status: res.data, data: res.data };
}

export async function login(data) {
    try {
        const res = await axios.post(endpoints.auth.login, data);

        return { status: res.data, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        throw message;
    }
}

export async function logout() {
    const res = await axios.get(endpoints.auth.logout);

    return { status: res.data, data: res.data };
}

export async function profile() {
    const res = await axios.get(endpoints.auth.profile);

    return { status: res.data, data: res.data };
}