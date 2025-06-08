"use client"
import Head from "next/head";
import { useState } from "react";
import Header from "../components/Header";
import ProductList from "../components/ProductList";
import CategoryList from "../components/CategoryList";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";
import "../styles/globals.css";
// import "../styles/hero.module.css"; // HeroSection now imports its own styles

export default function Home() {
    // State to hold the search query, passed down to components that need it
    const [searchQuery, setSearchQuery] = useState<string>("");

    return (
        <>
            <Head>
                <title>Highness Display - Premium Display Solutions</title>
                <meta
                    name="description"
                    content="Highness Display - Your trusted partner for high-quality display solutions, LCD panels, and touch screen technology."
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Header component with search functionality */}
            <Header onSearch={setSearchQuery} />

            <main>
                {/* Hero Section */}
                <HeroSection />

                {/* Product Categories Section - Content within CategoryList has its own container/layout */}
                <section className="featured-categories">
                    {/* Heading is outside the CategoryList's internal container for potentially wider layouts */}
                    <h2>Product Categories</h2>
                    <CategoryList />
                </section>

                {/* <section className="featured-products">
                    <div className="container">
                        <h2>Featured Products</h2>
                        <ProductList showLoadMore={false}/>
                    </div>
                </section>

                <section className="all-products">
                    <div className="container">
                        <h2>All Products</h2>
                       
                        <ProductList searchQuery={searchQuery} />
                    </div>
                </section> */}
            </main>

            {/* Footer component */}
            <Footer />
        </>
    );
} 