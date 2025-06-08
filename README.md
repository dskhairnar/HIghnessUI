# HighnessUI API Documentation

## Table of Contents

- [Overview](#overview)
- [Base Configuration](#base-configuration)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [API Functions](#api-functions)
- [Response Structures](#response-structures)
- [Error Handling](#error-handling)
- [Image Handling](#image-handling)
- [Examples](#examples)

## Overview

This documentation details the API integration with the Strapi CMS backend for the HighnessUI application. The API is built using Axios and follows RESTful principles.

## Base Configuration

### API Client Setup

```typescript
// Base URL
const CMS_BASE_URL = "https://cms.miraiyantra.com";

// Default Headers
const defaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
```

### Default Pagination

```typescript
const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 12,
  limit: 8,
};
```

## API Endpoints

### 1. Products API (`/products`)

#### List All Products

```typescript
GET /products
Query Parameters:
- pagination[page]: number
- pagination[pageSize]: number
- populate[product_category][populate]: '*'
- populate[productimages][populate]: '*'
```

#### Get Product by Slug

```typescript
GET /products
Query Parameters:
- filters[slug][$eq]: string
- populate[product_category][populate]: '*'
- populate[productimages][populate]: '*'
```

#### Get Products by Category

```typescript
GET /products
Query Parameters:
- filters[product_category][slug][$eq]: string
- populate[product_category][populate]: '*'
- populate[productimages][populate]: '*'
```

### 2. Product Versions API (`/product-versions`)

#### List All Versions

```typescript
GET /product-versions
Query Parameters:
- populate[specs][populate][spec_key]: 'true'
- populate[specs][populate][productVersion]: 'true'
```

### 3. Categories API (`/product-categories`)

#### List All Categories

```typescript
GET /product-categories
Query Parameters:
- populate[images][populate]: '*'
```

#### Get Category by Slug

```typescript
GET /product-categories
Query Parameters:
- filters[slug][$eq]: string
- populate[images][populate]: '*'
```

## Data Models

### Product

```typescript
interface Product {
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
  product_category: ProductCategory;
  productimages: ProductImage[];
  versions?: {
    data: Array<{
      id: number;
      attributes: ProductVersion;
    }>;
  };
}
```

### Product Version

```typescript
interface ProductVersion {
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
```

### Category

```typescript
interface Category {
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
  images: CategoryImage[];
}
```

## API Functions

### Product Functions

```typescript
// Get all products with pagination
async function getProducts(
  page = DEFAULT_PAGINATION.page,
  pageSize = DEFAULT_PAGINATION.pageSize
): Promise<ProductResponse>;

// Get product by slug
async function getProductBySlug(slug: string): Promise<Product>;

// Get products by category slug
async function getProductsByCategorySlug(
  categorySlug: string
): Promise<ProductResponse>;

// Get featured products
async function getFeaturedProducts(
  limit = DEFAULT_PAGINATION.limit
): Promise<ProductResponse>;
```

### Version Functions

```typescript
// Get all product versions with specs and images
async function getProductVersions(): Promise<ProductVersionResponse>;
```

### Category Functions

```typescript
// Get all categories
async function getProductCategories(): Promise<CategoryResponse>;

// Get category by slug
async function getCategoryBySlug(slug: string): Promise<Category | null>;
```

## Response Structures

### Standard Response Format

```typescript
interface ApiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
```

## Error Handling

### API Error Class

```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}
```

### Retry Mechanism

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T>;
```

### Common Error Codes

- `API_CONNECTION_ERROR`: Unable to connect to the API server
- `API_ERROR`: General API request failure

## Image Handling

### Image URL Construction

```typescript
// Base URL for images
const CMS_BASE_URL = "https://cms.miraiyantra.com";

// Placeholder image for fallback
const PLACEHOLDER_IMAGE = "data:image/png;base64,...";
```

### Image Formats

```typescript
interface ImageFormats {
  thumbnail?: {
    url: string;
    width: number;
    height: number;
  };
  small?: {
    url: string;
    width: number;
    height: number;
  };
  medium?: {
    url: string;
    width: number;
    height: number;
  };
}
```

## Examples

### Fetching Products by Category

```typescript
// Example: Fetching products for a specific category
const categorySlug = "tft-lcd-module";
const response = await getProductsByCategorySlug(categorySlug);
const products = response.data;
```

### Fetching Product Versions

```typescript
// Example: Fetching versions with specs
const versions = await getProductVersions();
const versionsWithSpecs = versions.data.map((version) => ({
  name: version.name,
  specs: version.specs.map((spec) => ({
    key: spec.spec_key?.name,
    value: spec.value,
  })),
}));
```

### Error Handling Example

```typescript
try {
  const products = await getProducts();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error: ${error.message}`);
    console.error(`Status: ${error.status}`);
    console.error(`Code: ${error.code}`);
    console.error(`Details:`, error.details);
  }
}
```

## Caching

The API client implements a caching mechanism with a default duration of 5 minutes:

```typescript
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
```

## Best Practices

1. **Error Handling**

   - Always use try-catch blocks when making API calls
   - Handle specific error cases appropriately
   - Implement retry logic for failed requests

2. **Data Population**

   - Use the populate parameter to fetch related data
   - Be specific about which relations to populate
   - Avoid over-populating to minimize response size

3. **Pagination**

   - Always implement pagination for list endpoints
   - Use appropriate page sizes
   - Handle pagination metadata in the response

4. **Image Handling**

   - Use appropriate image formats based on context
   - Implement fallback images
   - Consider lazy loading for images

5. **Type Safety**
   - Use TypeScript interfaces for all API responses
   - Validate response data against expected types
   - Handle optional fields appropriately
