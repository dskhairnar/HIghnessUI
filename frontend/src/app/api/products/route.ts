import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/services/api/config';

async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            return response;
        } catch (error: any) {
            if (i === retries - 1) throw error;
            // Wait for 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    throw new Error('Failed to fetch after retries');
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        
        // Ensure populate parameters are included
        const params = new URLSearchParams(searchParams);
        if (!params.has('populate[product_category][populate]')) {
            params.append('populate[product_category][populate]', '*');
        }
        if (!params.has('populate[productimages][populate]')) {
            params.append('populate[productimages][populate]', '*');
        }

        const apiUrl = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.products}?${params.toString()}`;
        console.log('Proxying request to:', apiUrl);

        const response = await fetchWithRetry(apiUrl, {
            headers: API_CONFIG.defaultHeaders,
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('API error:', {
                status: response.status,
                statusText: response.statusText,
            });
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error in products API route:', error);
        
        // Check if it's a connection error
        if (error.cause?.code === 'ECONNREFUSED') {
            return NextResponse.json(
                { 
                    error: 'Unable to connect to the API server',
                    details: `Please make sure the server is running at ${API_CONFIG.baseURL}`,
                    code: 'API_CONNECTION_ERROR'
                },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { 
                error: 'Failed to fetch products',
                details: error.message,
                code: 'API_ERROR'
            },
            { status: 500 }
        );
    }
} 