import {api} from './api';
import { Config } from '../types';

export async function fetchConfig(): Promise<Config> {
    try {
        const response = await api.get<Config>('/config');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch config:', error);
        throw error;
    }
}
