export interface ProductImage {
    id: number;
    documentId: string;
    altText: string;
    usedFor: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    file: Array<{
        id: number;
        documentId: string;
        name: string;
        alternativeText: string | null;
        caption: string | null;
        width: number;
        height: number;
        formats: {
            small?: {
                ext: string;
                url: string;
                hash: string;
                mime: string;
                name: string;
                path: string | null;
                size: number;
                width: number;
                height: number;
                sizeInBytes: number;
            };
            medium?: {
                ext: string;
                url: string;
                hash: string;
                mime: string;
                name: string;
                path: string | null;
                size: number;
                width: number;
                height: number;
                sizeInBytes: number;
            };
            thumbnail?: {
                ext: string;
                url: string;
                hash: string;
                mime: string;
                name: string;
                path: string | null;
                size: number;
                width: number;
                height: number;
                sizeInBytes: number;
            };
        };
        hash: string;
        ext: string;
        mime: string;
        size: number;
        url: string;
        previewUrl: string | null;
        provider: string;
        provider_metadata: any;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    }>;
}

export interface ProductImageData {
    id: number;
    attributes: ProductImage;
}

export interface ProductImageResponse {
    data: ProductImageData[];
}

export interface ProductCategory {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    description: Array<{
        type: string;
        children: Array<{
            text: string;
            type: string;
        }>;
    }>;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    images: ProductImage[];
}

export interface Product {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    description: Array<{
        type: string;
        children: Array<{
            text: string;
            type: string;
        }>;
    }>;
    specifications: Record<string, string> | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    product_category: ProductCategory;
    productimages: ProductImage[];
    versions: {
        data: Array<{
            id: number;
            attributes: ProductVersion;
        }>;
    };
}

export interface ProductResponse {
    data: Product[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface ProductVersion {
    id: number;
    documentId: string;
    name: string;
    version: string;
    description: Array<{
        type: string;
        children: Array<{
            text: string;
            type: string;
        }>;
    }>;
    specs: Spec[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface ProductVersionResponse {
    data: ProductVersion[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface SpecKey {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface Spec {
    id: number;
    documentId: string;
    value: string;
    spec_key: SpecKey;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    productVersion: ProductVersion;
} 