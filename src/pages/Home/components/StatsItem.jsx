import React, { useRef, useState, useEffect, memo } from 'react';
import { Col } from 'react-bootstrap';

/**
 * Animated counter component for statistics.
 * Uses IntersectionObserver to trigger counting when visible.
 */
const StatsItem = ({ icon: Icon, target, label, suffix = "", duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) observer.observe(elementRef.current);
        return () => observer.disconnect();
    }, [hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;

        let startValue = 0;
        const totalFrames = Math.round(duration / 16); // ~60fps
        const increment = target / totalFrames;

        let frame = 0;
        const timer = setInterval(() => {
            frame++;
            const nextValue = Math.min(Math.round(increment * frame), target);
            setCount(nextValue);

            if (nextValue >= target) clearInterval(timer);
        }, 16);

        return () => clearInterval(timer);
    }, [hasStarted, target, duration]);

    return (
        <Col lg={3} md={6} className="mb-4 mb-lg-0" ref={elementRef}>
            <div className="stat-card glass-card p-4 rounded-4 text-center h-100 hover-glow">
                <div className="stat-icon-wrapper mb-3 mx-auto shadow-sm">
                    <Icon size={24} />
                </div>
                <h2 className="display-5 fw-bold text-dark mb-1">
                    {count.toLocaleString()}{suffix}
                </h2>
                <p className="text-muted small fw-bold text-uppercase tracking-widest">{label}</p>
            </div>
        </Col>
    );
};

export default memo(StatsItem);
