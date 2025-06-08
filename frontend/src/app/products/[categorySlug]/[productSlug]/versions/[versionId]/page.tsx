'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getProductVersionById } from '@/services/api/productApi';
import type { ProductVersion, ProductSpec } from '@/types/index';
import styles from './page.module.css';

const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const getImageUrl = (image: any) => {
    if (!image?.file?.[0]?.url) return PLACEHOLDER_IMAGE;
    return `https://cms.miraiyantra.com${image.file[0].url}`;
};

export default function ProductVersionDetailPage() {
    const params = useParams();
    const [version, setVersion] = useState<ProductVersion | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errorDetails, setErrorDetails] = useState<string | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(true);

    useEffect(() => {
        const fetchVersionDetails = async () => {
            if (!params?.versionId) {
                setError('Version ID is missing.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                setErrorDetails(null);

                const versionId = params.versionId as string;
                console.log('Fetching version details for ID:', versionId);

                const response = await getProductVersionById(versionId);
                console.log('Version details response:', response);

                if (response) {
                    setVersion(response);
                    if (response.productImages?.[0]) {
                        setIsImageLoading(true);
                    } else {
                        setIsImageLoading(false);
                    }
                } else {
                    setError('Version not found.');
                }
            } catch (err: any) {
                console.error('Error fetching version details:', err);
                if (err.response?.data?.code === 'API_CONNECTION_ERROR') {
                    setError('Unable to connect to the server');
                    setErrorDetails(err.response.data.details);
                } else {
                    setError('Failed to load version details');
                    setErrorDetails(err.response?.data?.details || err.message);
                }
                setVersion(null);
            } finally {
                setLoading(false);
            }
        };

        if (params?.versionId) {
            fetchVersionDetails();
        }
    }, [params?.versionId]);

    const handleImageLoad = () => {
        setIsImageLoading(false);
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading version details...</p>
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

    if (!version) {
        return (
            <div className={styles.noData}>
                <p>No version details available.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    {version.name || 'Product Version Details'}
                </h1>
                {version.description?.[0]?.children?.[0]?.text && (
                    <p className={styles.description}>
                        {version.description[0].children[0].text}
                    </p>
                )}
            </div>

            <div className={styles.contentGrid}>
                <div className={styles.imageContainer}>
                    {isImageLoading && version.productImages?.[0] && (
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
                            className={`${styles.image} ${isImageLoading ? styles.imageLoading : ''}`}
                            onLoad={handleImageLoad}
                            unoptimized
                            priority={false}
                        />
                    ) : (
                        <div className={styles.placeholderImage}>
                            <span>No Image Available</span>
                        </div>
                    )}
                </div>
                <div className={styles.specificationsTable}>
                    <h2>Specifications</h2>
                    {version.specs && version.specs.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Specifications</th>
                                </tr>
                            </thead>
                            <tbody>
                                {version.specs.map((spec: ProductSpec) => (
                                    <tr key={spec.id}>
                                        <td>{spec.spec_key?.name || 'N/A'}</td>
                                        <td>{spec.value || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No detailed specifications available for this version.</p>
                    )}
                </div>
            </div>

            <div className={styles.additionalActions}>
                <button className={styles.contactButton}>
                    Contact Sales
                </button>
            </div>
        </div>
    );
} 