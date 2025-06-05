'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/services/api';

// Base64 encoded 1x1 transparent pixel
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

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
    specifications: {
        height: string;
    };
    productimages: Array<{
        id: number;
        documentId: string;
        altText: string;
        usedFor: string;
    }>;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
    const [imageError, setImageError] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);

    // Get the first image from the productimages array
    const firstImage = product.productimages?.[0];
    const imageUrl = !imageError && firstImage?.documentId
        ? getImageUrl(firstImage.documentId)
        : PLACEHOLDER_IMAGE;

    // Extract text from description
    const descriptionText = product.description?.[0]?.children?.[0]?.text || '';

    return (
        <Link href={`/products/${product.slug}`} className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                <div className="relative h-48 w-full">
                    {isImageLoading && !imageError && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                    )}
                    {!imageError && (
                        <Image
                            src={imageUrl}
                            alt={product.name || 'Product image'}
                            fill
                            className={`object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                            onError={() => setImageError(true)}
                            onLoad={() => setIsImageLoading(false)}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                            quality={75}
                            unoptimized={imageUrl === PLACEHOLDER_IMAGE}
                        />
                    )}
                    {imageError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400">No image available</span>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>
                    {descriptionText && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {descriptionText}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard; 