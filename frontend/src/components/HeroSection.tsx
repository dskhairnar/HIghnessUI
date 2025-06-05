'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../styles/hero.module.css';

interface HeroSectionProps {
    // Define any props if needed
}

const heroImages = [
    {
        src: '/images/heroimg/transparent-display_bus-Banner_Img.jpg',
        alt: 'Transparent Display Bus Banner',
        title: 'Transparent Display',
        link: '/products/transparent-display', // Placeholder link
        tags: ['Transparent', 'Bus']
    },
    {
        src: '/images/heroimg/medical-1.jpg',
        alt: 'Medical Display',
        title: 'Medical Displays',
        link: '/products/medical', // Placeholder link
        tags: ['Industrial', 'Medical']
    },
    {
        src: '/images/heroimg/ships-1.jpg',
        alt: 'Maritime Display',
        title: 'Maritime Displays',
        link: '/products/maritime', // Placeholder link
        tags: ['Maritime', 'Industrial']
    },
    {
        src: '/images/heroimg/mission.jpg',
        alt: 'Mission Critical Display',
        title: 'Mission Critical',
        link: '/products/mission-critical', // Placeholder link
        tags: ['Industrial', 'Military']
    },
    {
        src: '/images/heroimg/metro-1.jpg',
        alt: 'Metro Display',
        title: 'Metro Displays',
        link: '/products/metro', // Placeholder link
        tags: ['Transportation']
    },
    {
        src: '/images/heroimg/avionics.jpg',
        alt: 'Avionics Display',
        title: 'Avionics Displays',
        link: '/products/avionics', // Placeholder link
        tags: ['Aerospace', 'Industrial']
    },
    {
        src: '/images/heroimg/assembly1.jpg',
        alt: 'Assembly Display',
        title: 'Assembly Displays',
        link: '/products/assembly', // Placeholder link
        tags: ['Industrial']
    },
    {
        src: '/images/heroimg/industrial.jpg',
        alt: 'Industrial Display',
        title: 'Industrial Displays',
        link: '/products/industrial', // Placeholder link
        tags: ['Industrial']
    },
    {
        src: '/images/heroimg/train.jpg',
        alt: 'Train Display',
        title: 'Train Displays',
        link: '/products/train', // Placeholder link
        tags: ['Transportation']
    }
];

const HeroSection: React.FC<HeroSectionProps> = () => {
    const router = useRouter();
    const cardsContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = cardsContainerRef.current;
        if (!container) return;

        const scrollInterval = setInterval(() => {
            const cardWidth = container.clientWidth; // Get the current width of the container (which is 100vw)
            const currentScroll = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;

            if (currentScroll < maxScroll) {
                // Scroll to the next card
                container.scrollTo({
                    left: currentScroll + cardWidth,
                    behavior: 'smooth',
                });
            } else {
                // Loop back to the first card
                container.scrollTo({
                    left: 0,
                    behavior: 'smooth',
                });
            }
        }, 5000); // Scroll every 5 seconds

        return () => {
            clearInterval(scrollInterval);
        };
    }, []); // Empty dependency array to run the effect once on mount

    const handleCardClick = (link: string) => {
        router.push(link);
    };

    return (
        <section className={styles['hero-section']}>
            <div className={styles['hero-content']}>
                <h1 className={styles['hero-heading']}>
                    Redefining Display Solutions
                </h1>
                <p className={styles['hero-description']}>
                    Highnesss, Inc. provides state-of-the-art LCD and AMOLED
                    display solutions, along with comprehensive support services,
                    to a wide range of industries throughout the Americas.
                </p>
            </div>
            <div
                className={styles['hero-cards-container']}
                ref={cardsContainerRef} // Attach ref to the container
            >
                <div className={styles['hero-cards']}>
                    {heroImages.map((image, index) => (
                        <div
                            key={index}
                            className={styles['hero-card']}
                            onClick={() => handleCardClick(image.link)}
                            style={{ cursor: 'pointer' }} // Add cursor style to indicate interactivity
                        >
                            <div className={styles['hero-card-image']}>
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    style={{ objectFit: 'cover' }}
                                />
                                {image.tags && image.tags.length > 0 && (
                                    <div className={styles['hero-card-tags']}>
                                        {image.tags.map((tag, tagIndex) => (
                                            <span key={tagIndex} className={styles['hero-card-tag']}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {/* Keep the Link for the Explore button */}
                                <Link href={image.link} className={styles['explore-button-overlay']}>
                                    Explore {image.title}
                                </Link>
                            </div>
                            <div className={styles['hero-card-info']}>
                                <h3>{image.title}</h3>
                                {/* Add more detailed info here if available */}
                                {/* <p>Add brief description here</p> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection; 