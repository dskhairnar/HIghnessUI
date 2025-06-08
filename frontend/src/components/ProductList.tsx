'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import type { Product } from '@/types/index';
import styles from '../styles/productList.module.css';

interface ProductListProps {
    searchQuery?: string;
    showLoadMore?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ searchQuery = '', showLoadMore = true }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/products?page=${page}&search=${searchQuery}`);
                const data = await response.json();

                if (data.data) {
                    setProducts(prevProducts =>
                        page === 1 ? data.data : [...prevProducts, ...data.data]
                    );
                    setHasMore(data.meta.pagination.page < data.meta.pagination.pageCount);
                } else {
                    setError('Failed to load products');
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page, searchQuery]);

    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    if (loading && page === 1) {
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
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className={styles.retryButton}>
                    Try Again
                </button>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className={styles.empty}>
                <p>No products found.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {showLoadMore && hasMore && (
                <div className={styles.loadMore}>
                    <button
                        onClick={handleLoadMore}
                        className={styles.loadMoreButton}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductList; 