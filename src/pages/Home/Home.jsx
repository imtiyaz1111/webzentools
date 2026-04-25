import React, { useMemo } from 'react';
import { Container, Row } from 'react-bootstrap';
import { Zap, Grid, Rocket, ShieldCheck } from 'lucide-react';

// Data & Hooks
import { categories, allTools } from '../../data/toolsData';
import useToolSearch from '../../hooks/useToolSearch';

// Components
import SEO from '../../components/SEO';
import Hero from './components/Hero';
import Features from './components/Features';
import CategoriesGrid from './components/CategoriesGrid';
import TrendingTools from './components/TrendingTools';
import BentoStats from './components/BentoStats';
import StatsItem from './components/StatsItem';
import TopToolsShowcase from './components/TopToolsShowcase';
import ComparisonTable from './components/ComparisonTable';
import FAQ from './components/FAQ';

// Styles
import "./Home.css";

/**
 * Home Page Component
 * Represents the main landing page of WebzenTools.
 */
const Home = () => {
    // Phase 3: Centralized Search Logic
    const { 
        searchQuery, 
        setSearchQuery, 
        filteredTools, 
        handleSearchSubmit 
    } = useToolSearch();

    // Data for sections
    const trendingTools = useMemo(() => allTools.slice(0, 6), []);

    return (
        <div className="home-premium-wrapper">
            {/* SEO Optimization */}
            <SEO 
                title="WebzenTools | 100+ Free Online Browser Utilities"
                description="Access premium developer, image, AI, and finance tools. Fast, secure, and 100% browser-based with zero data uploads."
                keywords="online tools, json formatter, image compressor, emi calculator, webzentools"
            />

            {/* ===== HERO SECTION ===== */}
            <Hero 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearchSubmit={handleSearchSubmit}
                filteredTools={filteredTools}
            />

            {/* ===== HOW IT WORKS SECTION ===== */}
            <Features />

            {/* ===== CATEGORIES SECTION ===== */}
            <CategoriesGrid categories={categories} />

            {/* ===== TRENDING TOOLS SECTION ===== */}
            <TrendingTools tools={trendingTools} />

            {/* ===== BENTO GRID / WHY CHOOSE US ===== */}
            <BentoStats />

            {/* ===== STATS ANIMATION SECTION ===== */}
            <section className="stats-in-motion-section py-5 my-5">
                <Container className="glass-card p-5 rounded-5 border-0 shadow-2xl">
                    <Row className="g-4 text-center">
                        <StatsItem icon={Zap} target={120} label="Tools Available" suffix="+" />
                        <StatsItem icon={Grid} target={50000} label="Happy Users" suffix="+" />
                        <StatsItem icon={Rocket} target={100} label="Uptime" suffix="%" />
                        <StatsItem icon={ShieldCheck} target={100} label="Privacy Safe" suffix="%" />
                    </Row>
                </Container>
            </section>

            {/* ===== TOP TOOLS SHOWCASE SECTION ===== */}
            <TopToolsShowcase />


            {/* ===== COMPARISON SECTION ===== */}
            <ComparisonTable />

            {/* ===== FAQ SECTION ===== */}
            <FAQ />
        </div>
    );
};

export default Home;
