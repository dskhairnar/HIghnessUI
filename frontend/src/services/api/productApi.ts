import { apiClient } from './client';
import { API_CONFIG, DEFAULT_PAGINATION } from './config';
import type { Product, ProductResponse, ProductVersionResponse, SingleProductVersionResponse } from '@/types/index';

export const getProductVersions = async (productId: number): Promise<ProductVersionResponse> => {
    const params = new URLSearchParams({
        'filters[product][id][$eq]': productId.toString(),
        'populate[specs][populate][spec_key]': 'true',
        'populate[specs][populate][productVersion]': 'true',
        'populate[productImages][populate]': '*'
    });

    const response = await apiClient.get(
        `${API_CONFIG.endpoints.productVersions}?${params.toString()}`
    );
    return response.data;
};

export const getProducts = async (
    page = DEFAULT_PAGINATION.page,
    pageSize = DEFAULT_PAGINATION.pageSize
): Promise<ProductResponse> => {
    const params = new URLSearchParams({
        'pagination[page]': page.toString(),
        'pagination[pageSize]': pageSize.toString(),
        'populate[product_category][populate]': '*',
        'populate[productimages][populate]': '*'
    });

    const response = await apiClient.get(
        `${API_CONFIG.endpoints.products}?${params.toString()}`
    );
    return response.data;
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
    const params = new URLSearchParams({
        'filters[slug][$eq]': slug,
        'populate[product_category][populate]': '*',
        'populate[productimages][populate]': '*'
    });

    const response = await apiClient.get(
        `${API_CONFIG.endpoints.products}?${params.toString()}`
    );
    return response.data.data[0];
};

export const getProductsByCategorySlug = async (categorySlug: string): Promise<ProductResponse> => {
    const params = new URLSearchParams({
        'filters[product_category][slug][$eq]': categorySlug,
        'populate[product_category][populate]': '*',
        'populate[productimages][populate]': '*'
    });

    const response = await apiClient.get(
        `${API_CONFIG.endpoints.products}?${params.toString()}`
    );
    return response.data;
};

export const getFeaturedProducts = async (limit = DEFAULT_PAGINATION.limit): Promise<ProductResponse> => {
    const params = new URLSearchParams({
        'pagination[limit]': limit.toString(),
        'populate[product_category][populate]': '*',
        'populate[productimages][populate]': '*'
    });

    const response = await apiClient.get(
        `${API_CONFIG.endpoints.products}?${params.toString()}`
    );
    return response.data;
};

export const getProductVersionById = async (versionId: string): Promise<SingleProductVersionResponse> => {
    const params = new URLSearchParams({
        'filters[id][$eq]': versionId,
        'populate[specs][populate][spec_key]': 'true',
        'populate[specs][populate][productVersion]': 'true',
        'populate[productImages][populate]': '*'
    });

    const response = await apiClient.get(
        `${API_CONFIG.endpoints.productVersions}?${params.toString()}`
    );
    return response.data.data[0];
}; 