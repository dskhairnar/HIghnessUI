export const CMS_BASE_URL = 'https://cms.miraiyantra.com';
export const CMS_API_URL = `${CMS_BASE_URL}/api`;

export const API_CONFIG = {
    baseURL: CMS_API_URL,
    endpoints: {
        products: '/products',
        categories: '/product-categories',
        productVersions: '/product-versions'
    },
    queryParams: {
        populate: {
            category: 'populate[product_category][populate]=*',
            images: 'populate[productimages][populate]=*',
            categoryImages: 'populate[images][populate]=*',
            versions: 'populate[versions][populate]=*'
        },
        categories: {
            populate: {
                images: {
                    populate: '*'
                }
            }
        },
        products: {
            populate: {
                product_category: {
                    populate: '*'
                },
                productimages: {
                    populate: '*'
                }
            }
        }
    },
    defaultHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
} as const;

export type ApiConfig = typeof API_CONFIG;

export const DEFAULT_PAGINATION = {
    page: 1,
    pageSize: 12,
    limit: 8
} as const;

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes 