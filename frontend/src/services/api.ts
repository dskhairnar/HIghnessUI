import axios, { AxiosInstance } from 'axios';
import { ProductVersionResponse, ProductResponse, ProductCategoryResponse } from '@/types/product';
import { Product, Category } from '@/types';

// Create a configured axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response [${response.config.method?.toUpperCase()}] ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const CMS_BASE_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.miraiyantra.com';
const API_BASE_URL = `${CMS_BASE_URL}/api`;

// Base64 encoded 1x1 transparent pixel
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Helper function to get image URL from a populated image object
export const getImageUrl = (image: { url?: string, formats?: any, documentId?: string, file?: Array<{ url: string }> } | null | undefined): string => {
  // If no image object or no URL, return placeholder
  if (!image) return PLACEHOLDER_IMAGE;
  
  // If we have a direct URL from the populated image object (legacy or if Strapi structure changes)
  if (image.url) {
    // If the URL is already absolute, return it
    if (image.url.startsWith('http')) {
      return image.url;
    }
    // Otherwise, prepend the CMS base URL
    return `${CMS_BASE_URL}${image.url}`;
  }

  // If the image object has a 'file' array and the first file has a url (new Strapi populate structure)
  if (image.file && image.file.length > 0 && image.file[0].url) {
     const fileUrl = image.file[0].url;
     // Handle absolute vs relative URL for the file url
     if (fileUrl.startsWith('http')) {
         return fileUrl;
     }
     return `${CMS_BASE_URL}${fileUrl}`;
  }

  // If we have formats (Strapi's image variations - might still be relevant depending on Strapi setup)
  if (image.formats) {
    // Try to get the smallest format first (thumbnail)
    const format = image.formats.thumbnail || image.formats.small || image.formats.medium || image.formats.large;
    if (format?.url) {
      return `${CMS_BASE_URL}${format.url}`;
    }
  }

  // If we only have documentId (legacy case - keep as a fallback but note it's deprecated)
  if (image.documentId) {
    console.warn('Using documentId for image URL is deprecated. Please update to use populated image objects with url.');
    return `${CMS_BASE_URL}/uploads/${image.documentId}`;
  }

  // Fallback to placeholder
  return PLACEHOLDER_IMAGE;
};

// Helper function to extract text from rich text description
export const extractDescriptionText = (description: Array<{
  type: string;
  children: Array<{
    text: string;
    type: string;
  }>;
}>): string => {
  if (!description || !Array.isArray(description)) return '';
  return description
    .map(block => block.children?.map(child => child.text).join('') || '')
    .join(' ')
    .trim();
};

// Product Versions
export const getProductVersions = async (): Promise<ProductVersionResponse> => {
  try {
    const [specsResponse, imagesResponse] = await Promise.all([
      apiClient.get('/product-versions?populate=specs'),
      apiClient.get('/product-versions?populate=productImages')
    ]);

    const mergedData = specsResponse.data.data.map((version: any) => {
      const imageVersion = imagesResponse.data.data.find((v: any) => v.id === version.id);
      return {
        ...version,
        productImages: imageVersion?.productImages || []
      };
    });

    return { data: mergedData, meta: specsResponse.data.meta };
  } catch (error) {
    throw error;
  }
};

// Products
export const getProducts = async (page = 1, pageSize = 12): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/products?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProduct = async (slug: string): Promise<{ data: Product }> => {
  try {
    const response = await apiClient.get(`/products?slug=${slug}`);
    return { data: response.data.data[0] };
  } catch (error) {
    throw error;
  }
};

export interface ProductCategory {
    id: number;
    // documentId is likely on the image object, not the category
    title: string;
    slug: string;
    description: Array<{
        type: string;
        children: Array<{
            text: string;
            type: string;
        }>;
    }>;
    images: Array<{
        id: number;
        // documentId might be here, but the 'url' is what's needed for the file path
        documentId?: string; // Made optional as 'url' is the primary need
        altText?: string; // Made optional as per common API responses
        url: string; // Added the url field
        // Other potential fields like 'formats' could be added here if needed
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

interface ApiResponse {
    data: ProductCategory[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

let categoriesCache: {
    data: ProductCategory[];
    timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchProductCategories(): Promise<ProductCategory[]> {
    try {
        // Ensure populate[images][populate]=* is present to get the image object with the nested file url
        const response = await fetch(`${API_BASE_URL}/product-categories?populate[images][populate]=*`);

        if (!response.ok) {
            throw new Error('Failed to fetch product categories');
        }

        const data: ApiResponse = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching product categories:', error);
        throw error;
    }
}

export async function getProductCategories(): Promise<ProductCategory[]> {
    // Check cache first
    if (categoriesCache && Date.now() - categoriesCache.timestamp < CACHE_DURATION) {
        return categoriesCache.data;
    }

    try {
        const categories = await fetchProductCategories();
        // Update cache
        categoriesCache = {
            data: categories,
            timestamp: Date.now()
        };
        return categories;
    } catch (error) {
        console.error('Error in getProductCategories:', error);
        throw error;
    }
}

// This function might need adjustment based on how products/versions are structured and link to images
export function getProductCategoryBySlug(categories: ProductCategory[], slug: string): ProductCategory | undefined {
    return categories.find(category => category.slug === slug);
}

export async function getCategory(slug: string): Promise<{ data: Category }> {
  try {
    // This endpoint might also need populate=images if it returns category data
    const response = await apiClient.get(`/product-categories?slug=${slug}`);
    // Assuming response structure is similar { data: [{...}] }
    return { data: response.data.data[0] };
  } catch (error) {
    throw error;
  }
} 