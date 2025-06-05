'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/header.module.css';
import { getProductCategories, ProductCategory } from '../services/api';

interface HeaderProps {
    onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getProductCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Failed to load categories');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(searchQuery);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(`.${styles.dropdown}`)) {
                setIsProductsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles['header-container']}>
                <div className={styles['header-top']}>
                    <div className={styles['header-logo']}>
                        <Link href="/">
                            <Image
                                src="/logo.png"
                                alt="Highness Logo"
                                width={150}
                                height={40}
                                priority
                                quality={100}
                            />
                        </Link>
                    </div>

                    <div className={styles['header-actions']}>
                        <form onSubmit={handleSearch} className={styles['search-form']}>
                            <input
                                type="search"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles['search-input']}
                            />
                            <button type="submit" className={styles['search-button']}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </button>
                        </form>

                        <div className={styles['region-selector']}>
                            <select className={styles['region-select']}>
                                <option value="us">Highness US</option>
                            </select>
                        </div>

                        <Link href="/contact" className={styles['contact-button']}>
                            Contact Us
                        </Link>

                        <button
                            className={`${styles['menu-toggle']} ${isMenuOpen ? styles.active : ''}`}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>

                <nav className={`${styles['header-nav']} ${isMenuOpen ? styles.active : ''}`}>
                    <ul className={styles['nav-list']}>
                        <li><Link href="/">Home</Link></li>
                        <li className={`${styles['dropdown']} ${isProductsOpen ? styles.active : ''}`}>
                            <div
                                className={styles['dropdown-trigger']}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsProductsOpen(!isProductsOpen);
                                }}
                            >
                                <span>Products</span>
                                <span className={`${styles['dropdown-indicator']} ${isProductsOpen ? styles.active : ''}`}>▼</span>
                            </div>
                            <ul className={styles['dropdown-menu']}>
                                {isLoading ? (
                                    <li className={styles['dropdown-loading']}>Loading...</li>
                                ) : error ? (
                                    <li className={styles['dropdown-error']}>{error}</li>
                                ) : categories.length === 0 ? (
                                    <li className={styles['dropdown-empty']}>No categories found</li>
                                ) : (
                                    categories.map((category) => (
                                        <li key={category.id}>
                                            <Link
                                                href={`/products/${category.slug}`}
                                                onClick={() => setIsProductsOpen(false)}
                                            >
                                                {category.title}
                                            </Link>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </li>
                        <li><Link href="/automotive">Automotive</Link></li>
                        <li><Link href="/industrial">Industrial</Link></li>
                        <li><Link href="/medical">Medical</Link></li>
                        <li><Link href="/rugged">Rugged</Link></li>
                        <li><Link href="/it">IT</Link></li>
                        <li><Link href="/consumer">Consumer</Link></li>
                        <li className={styles['dropdown']}>
                            <div className={styles['dropdown-trigger']}>
                                <Link href="/about">About Us</Link>
                                <span className={styles['dropdown-indicator']}>▼</span>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header; 