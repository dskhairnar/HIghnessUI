import React, { useState } from 'react';
import Image from 'next/image';
import { CMS_BASE_URL } from '@/services/api/config';
import styles from '../styles/productVersions.module.css';

interface ProductVersion {
    id: number;
    attributes: {
        name: string;
        description: string;
        specifications: string;
        images: {
            data: Array<{
                id: number;
                attributes: {
                    url: string;
                    alternativeText: string | null;
                    formats: {
                        thumbnail?: {
                            url: string;
                        };
                        small?: {
                            url: string;
                        };
                        medium?: {
                            url: string;
                        };
                    };
                };
            }>;
        };
    };
}

interface ProductVersionsProps {
    versions: ProductVersion[];
    onClose: () => void;
}

const ProductVersions: React.FC<ProductVersionsProps> = ({ versions, onClose }) => {
    const [selectedVersion, setSelectedVersion] = useState<ProductVersion | null>(null);

    const getImageUrl = (version: ProductVersion) => {
        const image = version.attributes.images.data[0];
        if (!image) return null;

        const format = image.attributes.formats.medium ||
            image.attributes.formats.small ||
            image.attributes.formats.thumbnail;

        const imageUrl = format ? format.url : image.attributes.url;
        return imageUrl.startsWith('http') ? imageUrl : `${CMS_BASE_URL}${imageUrl}`;
    };

    return (
        <div className={styles.versionsModal}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    ×
                </button>

                <div className={styles.versionsList}>
                    {versions.map((version) => (
                        <div
                            key={version.id}
                            className={`${styles.versionCard} ${selectedVersion?.id === version.id ? styles.selected : ''}`}
                            onClick={() => setSelectedVersion(version)}
                        >
                            <h3>{version.attributes.name}</h3>
                            {getImageUrl(version) && (
                                <div className={styles.versionImage}>
                                    <Image
                                        src={getImageUrl(version)!}
                                        alt={version.attributes.images.data[0]?.attributes.alternativeText || version.attributes.name}
                                        width={200}
                                        height={150}
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {selectedVersion && (
                    <div className={styles.versionDetails}>
                        <h2>{selectedVersion.attributes.name}</h2>
                        <div className={styles.description}>
                            <h3>Description</h3>
                            <p>{selectedVersion.attributes.description}</p>
                        </div>
                        <div className={styles.specifications}>
                            <h3>Specifications</h3>
                            <p>{selectedVersion.attributes.specifications}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductVersions; 