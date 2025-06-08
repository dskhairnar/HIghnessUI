import { API_CONFIG } from './config';
import { apiClient } from './client';
import type { Category, CategoryResponse } from './types';

export const getProductCategories = async (): Promise<CategoryResponse> => {
  const url = new URL(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.categories}`);
  url.searchParams.append('populate[images][populate]', '*');
  
  const response = await apiClient.get<CategoryResponse>(url.toString());
  return response.data;
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const url = new URL(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.categories}`);
  url.searchParams.append('filters[slug][$eq]', slug);
  url.searchParams.append('populate[images][populate]', '*');
  
  const response = await apiClient.get<CategoryResponse>(url.toString());
  return response.data.data[0] || null;
};

export function extractDescriptionText(description: Array<{
  type: string;
  children: Array<{
    text: string;
    type: string;
  }>;
}>): string {
  if (!description || !Array.isArray(description)) return '';
  return description
    .map(block => block.children?.map(child => child.text).join('') || '')
    .join(' ')
    .trim();
} 