'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getProductVersions, getProductBySlug } from '@/services/api/productApi';
import type { ProductVersion, Product } from '@/types/index';
import styles from './page.module.css';
import Link from 'next/link';

// Base64 encoded 1x1 transparent pixel for placeholder
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Helper function to get the correct image URL
const getImageUrl = (image: any) => {
    if (!image?.file?.[0]?.url) return PLACEHOLDER_IMAGE;
    return `https://cms.miraiyantra.com${image.file[0].url}`;
};

export default function ProductVersionsPage() {
    const params = useParams();
    const [versions, setVersions] = useState<ProductVersion[]>([]);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errorDetails, setErrorDetails] = useState<string | null>(null);
    const [isImageLoading, setIsImageLoading] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchData = async () => {
            if (!params?.productSlug) {
                setError('Product slug is missing.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                setErrorDetails(null);

                const productSlug = params.productSlug as string;
                console.log('Fetching product:', productSlug);

                // First get the product to get its ID
                const productData = await getProductBySlug(productSlug);
                setProduct(productData);

                if (!productData) {
                    throw new Error('Product not found');
                }

                console.log('Fetching versions for product:', productData.id);
                const response = await getProductVersions(productData.id);
                console.log('Versions response:', response);

                if (response.data && Array.isArray(response.data)) {
                    setVersions(response.data);
                    // Initialize image loading states
                    const initialLoadingStates = response.data.reduce((acc: { [key: string]: boolean }, version: ProductVersion) => {
                        if (version.productImages?.[0]) {
                            acc[version.id] = true;
                        }
                        return acc;
                    }, {});
                    setIsImageLoading(initialLoadingStates);
                } else {
                    console.log('Invalid response structure:', response);
                    setVersions([]);
                    setError('No versions found for this product');
                }
            } catch (err: any) {
                console.error('Error fetching data:', err);

                if (err.response?.data?.code === 'API_CONNECTION_ERROR') {
                    setError('Unable to connect to the server');
                    setErrorDetails(err.response.data.details);
                } else {
                    setError('Failed to load data');
                    setErrorDetails(err.response?.data?.details || err.message);
                }
                setVersions([]);
            } finally {
                setLoading(false);
            }
        };

        if (params?.productSlug) {
            fetchData();
        }
    }, [params?.productSlug]);

    const handleImageLoad = (versionId: number) => {
        setIsImageLoading(prev => ({
            ...prev,
            [versionId]: false
        }));
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading versions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.error}>
                <h2>{error}</h2>
                {errorDetails && <p>{errorDetails}</p>}
                {error === 'Unable to connect to the server' && (
                    <div className={styles.errorActions}>
                        <p>Please try the following:</p>
                        <ul>
                            <li>Check your internet connection</li>
                            <li>Try refreshing the page</li>
                            <li>Contact support if the issue persists</li>
                        </ul>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    {product?.name || 'Product Versions'}
                </h1>
                {product?.description?.[0]?.children?.[0]?.text && (
                    <p className={styles.description}>
                        {product.description[0].children[0].text}
                    </p>
                )}
            </div>

            {versions.length > 0 ? (
                <div className={styles.versionGrid}>
                    {versions.map((version) => (
                        <div key={version.id} className={styles.versionCard}>
                            <div className={styles.versionImage}>
                                {isImageLoading[version.id] && (
                                    <div className={styles.imageLoading}>
                                        <div className={styles.loadingSpinner}></div>
                                    </div>
                                )}
                                {version.productImages?.[0] ? (
                                    <Image
                                        key={version.productImages[0].documentId}
                                        src={getImageUrl(version.productImages[0])}
                                        alt={version.productImages[0].altText || version.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className={`${styles.image} ${isImageLoading[version.id] ? styles.imageLoading : ''}`}
                                        onLoad={() => handleImageLoad(version.id)}
                                        unoptimized
                                        priority={false}
                                    />
                                ) : (
                                    <div className={styles.placeholderImage}>
                                        <span>No Image Available</span>
                                    </div>
                                )}
                            </div>
                            <div className={styles.versionInfo}>
                                <h3 className={styles.versionName}>{version.name}</h3>
                                <p className={styles.versionDescription}>
                                    {version.description?.[0]?.children?.[0]?.text ||
                                        'No description available'}
                                </p>

                                {version.specs && version.specs.length > 0 && (
                                    <div className={styles.specifications}>
                                        <h4>Specifications</h4>
                                        <ul>
                                            {version.specs.map((spec) => (
                                                <li key={spec.id}>
                                                    <span className={styles.specKey}>
                                                        {spec.spec_key?.name || 'Specification'}:
                                                    </span>
                                                    <span className={styles.specValue}>
                                                        {spec.value}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className={styles.versionActions}>
                                    <Link href={`/products/${params?.categorySlug}/${params?.productSlug}/versions/${version.id}`} className={styles.contactButton}>
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.noVersions}>
                    <p>No versions found for this product.</p>
                </div>
            )}
        </div>
    );
} 