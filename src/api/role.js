'use server'

import axios from 'src/utils/axios';
import { REST_API } from 'src/config-global';

export async function getRoles() {
    const URL = `${REST_API}/roles`;

    return axios.get(URL);
}