export interface ProductImage {
  id: number;
  documentId: string;
  altText: string;
  usedFor: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ProductImageData {
  id: number;
  attributes: ProductImage;
}

export interface ProductImageResponse {
  data: ProductImageData[];
}

export interface Product {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  productimages: ProductImageResponse;
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

export interface Category {
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
  images: ProductImageResponse;
}

export interface ProductCategoryResponse {
  data: Category[];
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
  title: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  specs: Array<{
    id: number;
    name: string;
    value: string;
  }>;
  productImages: ProductImageResponse;
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