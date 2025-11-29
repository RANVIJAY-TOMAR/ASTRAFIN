import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import Magnetic from './Magnetic';

export default function Sidebar() {
    const [activeChip, setActiveChip] = useState('Empathy first');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const chips = [
        { vibe: 'Empathy first', caption: "We'll take our time.", label: 'I need calm guidance' },
        { vibe: "Let's celebrate", caption: 'Big energy, clear steps.', label: "I'm celebrating something" },
        { vibe: 'Fast lane', caption: 'Prioritizing timelines.', label: "I'm on a tight timeline" },
    ];

    const sidebarVariants = {
        expanded: { width: '320px', opacity: 1, x: 0 },
        collapsed: { width: '80px', opacity: 1, x: 0 },
        mobileClosed: { x: '-100%', opacity: 0, position: 'absolute', zIndex: 50 },
        mobileOpen: { x: 0, opacity: 1, width: '280px', position: 'absolute', zIndex: 50 }
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <>
            {/* Mobile Toggle */}
            {isMobile && (
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 60 }}
                >
                    {isMobileOpen ? <X /> : <Menu />}
                </button>
            )}

            <motion.aside
                className={`sidebar glass-panel ${isCollapsed ? 'collapsed' : ''}`}
                initial={isMobile ? "mobileClosed" : "expanded"}
                animate={isMobile ? (isMobileOpen ? "mobileOpen" : "mobileClosed") : (isCollapsed ? "collapsed" : "expanded")}
                variants={sidebarVariants}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="brand">
                    <div className="brand-logo">A</div>
                    {!isCollapsed && (
                        <motion.div
                            className="brand-name"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            AstraFin
                        </motion.div>
                    )}
                </div>

                {!isMobile && (
                    <Magnetic>
                        <button className="collapse-btn" onClick={toggleSidebar}>
                            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </button>
                    </Magnetic>
                )}

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', overflow: 'hidden' }}>
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <p className="text-label" style={{ marginBottom: '1rem' }}>Your Journey</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <JourneyStep label="Discovery" sub="Understanding your needs" active />
                                    <JourneyStep label="Analysis" sub="Crunching the numbers" />
                                    <JourneyStep label="Options" sub="Tailored solutions" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                            >
                                <p className="text-label" style={{ marginBottom: '1rem' }}>Context</p>
                                <div className="context-chips">
                                    {chips.map((chip) => (
                                        <Magnetic key={chip.vibe}>
                                            <button
                                                className={`context-chip ${activeChip === chip.vibe ? 'active' : ''}`}
                                                onClick={() => setActiveChip(chip.vibe)}
                                            >
                                                {chip.label}
                                            </button>
                                        </Magnetic>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                    {!isCollapsed ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span className="text-label">Trust Score</span>
                                <span className="text-label" style={{ color: 'white' }}>98/100</span>
                            </div>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '98%' }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                    style={{ height: '100%', background: 'var(--accent-primary)' }}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ width: '40px', height: '4px', background: 'var(--accent-primary)', borderRadius: '2px' }}></div>
                        </div>
                    )}
                </div>
            </motion.aside>

            {/* Mobile Overlay */}
            {isMobile && isMobileOpen && (
                <motion.div
                    className="mobile-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40, backdropFilter: 'blur(4px)' }}
                />
            )}
        </>
    );
}

function JourneyStep({ label, sub, active }) {
    return (
        <div style={{ display: 'flex', gap: '0.75rem', opacity: active ? 1 : 0.4 }}>
            <div style={{ width: '2px', background: active ? 'white' : 'var(--border-subtle)', borderRadius: '2px' }}></div>
            <div>
                <strong style={{ display: 'block', fontSize: '0.9rem' }}>{label}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{sub}</span>
            </div>
        </div>
    );
}
