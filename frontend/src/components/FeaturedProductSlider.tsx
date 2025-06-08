'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedProducts, getImageUrl } from '@/services/api';
import { Product } from '@/types';
import styles from '../styles/FeaturedProductSlider.module.css';

const FeaturedProductSlider: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getFeaturedProducts(8); // Fetch 8 featured products
                setProducts(response.data);
            } catch (err) {
                console.error('Error fetching featured products:', err);
                setError('Failed to load featured products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Loading featured products...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error: {error}</div>;
    }

    if (products.length === 0) {
        return <div className={styles.noProducts}>No featured products found.</div>;
    }

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>Featured Products</h2>
            <div className={styles.sliderContainer}>
                <div className={styles.productGrid}>
                    {products.map((product) => (
                        <div key={product.id} className={styles.productCard}>
                            {product.productimages && product.productimages.data.length > 0 && (
                                <Image
                                    src={getImageUrl(product.productimages.data[0].attributes)}
                                    alt={product.title}
                                    width={300} // Adjust as needed
                                    height={200} // Adjust as needed
                                    className={styles.productImage}
                                />
                            )}
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{product.title}</h3>
                                <p className={styles.cardDescription}>
                                    {product.description.length > 100 ? product.description.substring(0, 97) + '...' : product.description}
                                </p>
                                <Link href={`/products/${product.slug}`} className={styles.viewDetailsButton}>
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProductSlider; 