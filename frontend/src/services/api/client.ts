import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG } from './config';

class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public code?: string,
        public details?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

async function fetchWithRetry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000
): Promise<T> {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error('Failed after retries');
}

export const createApiClient = (baseURL: string = '/api'): AxiosInstance => {
    const client = axios.create({
        baseURL,
        headers: API_CONFIG.defaultHeaders,
    });

    client.interceptors.response.use(
        (response) => {
            console.log(`API Response [${response.config.method?.toUpperCase()}] ${response.config.url}:`, response.data);
            return response;
        },
        (error: AxiosError) => {
            console.error('API Error:', {
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });

            if (error.code === 'ECONNREFUSED') {
                throw new ApiError(
                    'Unable to connect to the API server',
                    503,
                    'API_CONNECTION_ERROR',
                    { baseURL }
                );
            }

            throw new ApiError(
                error.response?.data?.message || 'API request failed',
                error.response?.status,
                error.response?.data?.code || 'API_ERROR',
                error.response?.data
            );
        }
    );

    return client;
};

export const apiClient = createApiClient(); 