'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getProductsByCategorySlug } from '@/services/api/productApi';
import type { Product, ProductVersion } from '@/types/index';
import styles from './page.module.css';
import Link from 'next/link';

// Base64 encoded 1x1 transparent pixel for placeholder
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Helper function to get the correct image URL
const getImageUrl = (image: any) => {
    if (!image?.file?.[0]?.url) return PLACEHOLDER_IMAGE;
    return `https://cms.miraiyantra.com${image.file[0].url}`;
};

export default function CategoryProductsPage() {
    const params = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errorDetails, setErrorDetails] = useState<string | null>(null);
    const [isImageLoading, setIsImageLoading] = useState<{ [key: string]: boolean }>({});
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [versions, setVersions] = useState<{ [key: number]: ProductVersion[] }>({});
    const [loadingVersions, setLoadingVersions] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        const fetchProducts = async () => {
            if (!params?.categorySlug) {
                setError('Category slug is missing.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                setErrorDetails(null);

                const categorySlug = params.categorySlug as string;
                console.log('Fetching products for category:', categorySlug);

                const response = await getProductsByCategorySlug(categorySlug);
                console.log('Products response:', response);

                if (response.data && Array.isArray(response.data)) {
                    setProducts(response.data);
                    // Initialize image loading states
                    const initialLoadingStates = response.data.reduce((acc: { [key: string]: boolean }, product: Product) => {
                        if (product.productimages?.[0]) {
                            acc[product.id] = true;
                        }
                        return acc;
                    }, {});
                    setIsImageLoading(initialLoadingStates);
                } else {
                    console.log('Invalid response structure:', response);
                    setProducts([]);
                    setError('No products found for this category');
                }
            } catch (err: any) {
                console.error('Error fetching products:', err);

                if (err.response?.data?.code === 'API_CONNECTION_ERROR') {
                    setError('Unable to connect to the server');
                    setErrorDetails(err.response.data.details);
                } else {
                    setError('Failed to load products');
                    setErrorDetails(err.response?.data?.details || err.message);
                }
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (params?.categorySlug) {
            fetchProducts();
        }
    }, [params?.categorySlug]);

    const handleImageLoad = (productId: number) => {
        setIsImageLoading(prev => ({
            ...prev,
            [productId]: false
        }));
    };

    const handleCheckVersions = async (productId: number) => {
        if (selectedProductId === productId) {
            setSelectedProductId(null);
            return;
        }

        setSelectedProductId(productId);

        if (!versions[productId]) {
            setLoadingVersions(prev => ({ ...prev, [productId]: true }));
            try {
                const response = await fetch(
                    `https://cms.miraiyantra.com/api/product-versions?filters[product][id][$eq]=${productId}&populate[specs][populate][spec_key]=true&populate[specs][populate][productVersion]=true`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setVersions(prev => ({ ...prev, [productId]: data.data }));
            } catch (err) {
                console.error('Error fetching versions:', err);
            } finally {
                setLoadingVersions(prev => ({ ...prev, [productId]: false }));
            }
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading products...</p>
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
                    {products[0]?.product_category?.title ||
                        params?.categorySlug
                            ?.toString()
                            .split('-')
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                </h1>
                {products[0]?.product_category?.description?.[0]?.children?.[0]?.text && (
                    <p className={styles.categoryDescription}>
                        {products[0].product_category.description[0].children[0].text}
                    </p>
                )}
            </div>

            {products.length > 0 ? (
                <div className={styles.productGrid}>
                    {products.map((product) => (
                        <div key={product.id} className={styles.productCard}>
                            <div className={styles.productImage}>
                                {isImageLoading[product.id] && (
                                    <div className={styles.imageLoading}>
                                        <div className={styles.loadingSpinner}></div>
                                    </div>
                                )}
                                {product.productimages?.[0] ? (
                                    <Image
                                        key={product.productimages[0].documentId}
                                        src={getImageUrl(product.productimages[0])}
                                        alt={product.productimages[0].altText || product.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className={`${styles.image} ${isImageLoading[product.id] ? styles.imageLoading : ''}`}
                                        onLoad={() => handleImageLoad(product.id)}
                                        unoptimized
                                        priority={false}
                                    />
                                ) : (
                                    <div className={styles.placeholderImage}>
                                        <span>No Image Available</span>
                                    </div>
                                )}
                            </div>
                            <div className={styles.productInfo}>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <p className={styles.productDescription}>
                                    {product.description?.[0]?.children?.[0]?.text ||
                                        'No description available'}
                                </p>

                                {product.specifications && (
                                    <div className={styles.specifications}>
                                        <h4>Specifications</h4>
                                        <ul>
                                            {Object.entries(product.specifications).map(
                                                ([key, value]) => (
                                                    <li key={key}>
                                                        <span className={styles.specKey}>{key}:</span>
                                                        <span className={styles.specValue}>{value}</span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}

                                <div className={styles.productActions}>
                                    <Link
                                        href={`/products/${params.categorySlug}/${product.slug}/versions`}
                                        className={styles.contactButton}
                                    >
                                        Check Versions
                                    </Link>
                                </div>

                                {selectedProductId === product.id && (
                                    <div className={styles.versionsSection}>
                                        {loadingVersions[product.id] ? (
                                            <div className={styles.loading}>
                                                <div className={styles.loadingSpinner}></div>
                                                <p>Loading versions...</p>
                                            </div>
                                        ) : versions[product.id]?.length > 0 ? (
                                            <div className={styles.versionsList}>
                                                <h4>Available Versions</h4>
                                                {versions[product.id].map((version) => (
                                                    <div key={version.id} className={styles.versionCard}>
                                                        <h5>{version.name}</h5>
                                                        <p>{version.description?.[0]?.children?.[0]?.text || 'No description available'}</p>
                                                        {version.specs && version.specs.length > 0 && (
                                                            <div className={styles.versionSpecs}>
                                                                <h6>Specifications</h6>
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
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className={styles.noVersions}>No versions available for this product.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.noProducts}>
                    <p>No products found in this category.</p>
                </div>
            )}
        </div>
    );
}
