'use client';

import { useState, useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';
import { getProducts } from '@/services/api';
import type { Product } from "../types";

interface ProductListProps {
    initialProducts?: Product[];
    showLoadMore?: boolean;
    searchQuery?: string;
}

export default function ProductList({ initialProducts = [], showLoadMore = true, searchQuery }: ProductListProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [loading, setLoading] = useState(!initialProducts.length);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [allFetchedProducts, setAllFetchedProducts] = useState<Product[]>(initialProducts);

    const loadProducts = useCallback(async (pageNum: number) => {
        try {
            setLoading(true);
            const response = await getProducts(pageNum);
            const newProducts = response.data;

            if (pageNum === 1) {
                setAllFetchedProducts(newProducts);
            } else {
                setAllFetchedProducts(prev => [...prev, ...newProducts]);
            }

            setHasMore(newProducts.length > 0);
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!initialProducts.length) {
            loadProducts(1);
        }
    }, [initialProducts.length, loadProducts]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = allFetchedProducts.filter(product => 
                product.attributes.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setProducts(filtered);
            setHasMore(false);
        } else {
            setProducts(allFetchedProducts);
        }
    }, [searchQuery, allFetchedProducts]);

    const handleLoadMore = useCallback(() => {
        const nextPage = page + 1;
        setPage(nextPage);
        loadProducts(nextPage);
    }, [page, loadProducts]);

    const shouldShowLoadMoreButton = showLoadMore && hasMore && !searchQuery;

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="product-list">
            <div className="product-grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {loading && <p>Loading products...</p>}
            
            {shouldShowLoadMoreButton && (
                <div className="load-more-container">
                    <button
                        className="load-more-button"
                        onClick={handleLoadMore}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
             {!loading && products.length === 0 && searchQuery && (
                <p>No products found matching your search.</p>
            )}
             {!loading && products.length === 0 && !searchQuery && !hasMore && (
                <p>No products available.</p>
            )}
        </div>
    );
} 