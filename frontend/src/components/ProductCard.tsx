'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/index';
import styles from '../styles/productCard.module.css';
import { CMS_BASE_URL } from '@/services/api/config';
import ProductVersions from './ProductVersions';

// Base64 encoded 1x1 transparent pixel for placeholder
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Helper function to get the correct image URL
const getImageUrl = (image: any) => {
    if (!image?.file?.[0]?.url) return PLACEHOLDER_IMAGE;
    return `https://cms.miraiyantra.com${image.file[0].url}`;
};

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
    const [imageError, setImageError] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [showVersions, setShowVersions] = useState(false);

    // Get the first image from the productimages array
    const firstImage = product.productimages?.[0];
    const imageUrl = !imageError && firstImage?.documentId
        ? getImageUrl(firstImage)
        : PLACEHOLDER_IMAGE;

    // Extract text from description
    const descriptionText = product.description?.[0]?.children?.[0]?.text || '';

    const hasVersions = product.versions?.data.length > 0;

    return (
        <>
            <div className={styles.card}>
                <Link href={`/products/${product.slug}`} className={styles.imageLink}>
                    <div className={styles.imageContainer}>
                        {isImageLoading && !imageError && (
                            <div className={styles.placeholderImage}>
                                <span>Loading...</span>
                            </div>
                        )}
                        {!imageError && (
                            <Image
                                src={imageUrl}
                                alt={product.name || 'Product image'}
                                fill
                                style={{ objectFit: 'cover' }}
                                className={styles.image}
                                onError={() => setImageError(true)}
                                onLoad={() => setIsImageLoading(false)}
                                unoptimized
                            />
                        )}
                        {imageError && (
                            <div className={styles.placeholderImage}>
                                <span>No Image Available</span>
                            </div>
                        )}
                    </div>
                </Link>
                <div className={styles.content}>
                    <h3 className={styles.title}>
                        <Link href={`/products/${product.slug}`}>
                            {product.name}
                        </Link>
                    </h3>
                    <p className={styles.description}>
                        {descriptionText}
                    </p>
                    {hasVersions && (
                        <button
                            className={styles.versionsButton}
                            onClick={() => setShowVersions(true)}
                        >
                            View Versions
                        </button>
                    )}
                </div>
            </div>

            {showVersions && product.versions && (
                <ProductVersions
                    versions={product.versions.data}
                    onClose={() => setShowVersions(false)}
                />
            )}
        </>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard; 