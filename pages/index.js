import Head from 'next/head';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import { getRequestCounts } from '../lib/db';
import Image from 'next/image';

export async function getStaticProps() {
    const stats = await getRequestCounts(); 
    return {
        props: { stats },
        revalidate: 10
    };
}

export default function Home({ stats }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    const handleExploreClick = () => {
        setIsLoading(true);
        router.push('/docs');
    };
    
    const loadingText = "Loading...".split("").map((char, index) => (
        <span key={index} style={{'--i': index + 1}}>{char === ' ' ? '\u00A0' : char}</span>
    ));

    return (
        <div className={styles.container}>
            <Head>
                <title>LIPP - API | Welcome</title>
            </Head>

            {isLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={`${styles.wavyText} shiny-text`}>
                        {loadingText}
                    </div>
                </div>
            )}

            <div className={styles.content}>
                <h1 className={`${styles.title} shiny-text`}>LIPP - API</h1>
                <p className={styles.description}>
                    REST API yang simpel, cepat, dan elegan untuk berbagai kebutuhan.
                </p>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <h3>{new Intl.NumberFormat().format(stats.total_requests)}</h3>
                        <p>Total Requests</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>{new Intl.NumberFormat().format(stats.today_requests)}</h3>
                        <p>Requests Today</p>
                    </div>
                </div>

                <button onClick={handleExploreClick} className={styles.exploreButton}>
                    Explore Documentation
                </button>
                
                <h2 className={styles.thanksTitle}>Thanks To</h2>

                <div 
                    className={styles.creatorCard}
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                >
                    <div className={styles.creatorCardContent}>
                        <div className={styles.creatorAvatarWrapper}>
                            <Image 
                                src="/profile.png"
                                alt="LippWangsaff"
                                width={80}
                                height={80}
                                className={styles.creatorAvatar}
                            />
                        </div>
                        <h2 className={styles.creatorName}>LippWangsaff</h2>
                        <p className={styles.creatorRole}>Prompt Engineer</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
