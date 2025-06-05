import { Product, ProductResponse, ProductVersionResponse } from './product';

export interface Category {
    id: number;
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
        documentId?: string;
        altText?: string;
        url: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export type { Product, ProductResponse, ProductVersionResponse }; 