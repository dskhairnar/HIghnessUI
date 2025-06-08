'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProductCategories } from '@/services/api';
import { CMS_BASE_URL } from '@/services/api/config';
import type { Category } from '@/services/api/types';
import styles from '../styles/categoryList.module.css';

// Base64 encoded 1x1 transparent pixel
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

interface CategoryListProps {
    onCategorySelect?: (categoryId: number) => void;
    selectedCategoryId?: number;
}

const CategoryList: React.FC<CategoryListProps> = ({ onCategorySelect }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getProductCategories();
                if (isMounted && response.data) {
                    setCategories(response.data);
                    if (response.data.length > 0) {
                        setHoveredCategory(response.data[0]);
                    }
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
                if (isMounted) {
                    setError('Failed to load categories');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCategories();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleMouseEnter = (category: Category) => {
        setIsImageLoading(true);
        setHoveredCategory(category);
    };

    const handleImageLoad = () => {
        setIsImageLoading(false);
    };

    const getImageUrl = (category: Category) => {
        const image = category.images[0]?.file[0];
        if (!image) return PLACEHOLDER_IMAGE;
        
        // Try to get the best available format
        const format = image.formats.medium || image.formats.small || image.formats.thumbnail;
        const imageUrl = format ? format.url : image.url;
        
        // Prepend CMS base URL if the URL is relative
        return imageUrl.startsWith('http') ? imageUrl : `${CMS_BASE_URL}${imageUrl}`;
    };

    const getDescription = (category: Category) => {
        return category.description[0]?.children[0]?.text || 'No description available.';
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading categories...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.error}>
                <p>Error: {error}</p>
                <button onClick={() => window.location.reload()} className={styles.retryButton}>
                    Try Again
                </button>
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className={styles.empty}>
                <p>No categories found.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.imageColumn}>
                <div className={styles.imageWrapper}>
                    {isImageLoading && (
                        <div className={styles.imageLoading}>
                            <div className={styles.loadingSpinner}></div>
                        </div>
                    )}
                    <Image
                        key={hoveredCategory ? getImageUrl(hoveredCategory) : PLACEHOLDER_IMAGE}
                        src={hoveredCategory ? getImageUrl(hoveredCategory) : PLACEHOLDER_IMAGE}
                        alt={hoveredCategory?.images[0]?.altText || hoveredCategory?.title || 'Category Image'}
                        fill
                        style={{ objectFit: 'cover' }}
                        className={`${styles.displayImage} ${isImageLoading ? styles.imageLoading : ''}`}
                        onLoad={handleImageLoad}
                        unoptimized={!hoveredCategory}
                        priority={true}
                    />
                </div>
                {hoveredCategory && (
                    <div className={styles.descriptionArea}>
                        <h3>{hoveredCategory.title}</h3>
                        <p>{getDescription(hoveredCategory)}</p>
                        <Link
                            href={`/products/${hoveredCategory.slug}`}
                            className={styles.exploreButton}
                        >
                            Explore Products
                        </Link>
                    </div>
                )}
            </div>

            <div className={styles.listColumn}>
                <ul className={styles.categoryList}>
                    {categories.map((category, index) => (
                        <li
                            key={category.id}
                            className={`${styles.categoryItem} ${hoveredCategory?.id === category.id ? styles.active : ''}`}
                            onMouseEnter={() => handleMouseEnter(category)}
                            style={{ '--item-index': index } as React.CSSProperties}
                        >
                            <Link
                                href={`/products/${category.slug}`}
                                className={styles.categoryLink}
                                onClick={(e) => {
                                    if (onCategorySelect) {
                                        e.preventDefault();
                                        onCategorySelect(category.id);
                                    }
                                }}
                            >
                                {category.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CategoryList; 