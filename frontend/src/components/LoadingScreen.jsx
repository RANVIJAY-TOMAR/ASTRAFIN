import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingScreen({ onLoadComplete }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Fixed 3.5 second loading duration
        const duration = 3500;
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);

            setProgress(newProgress);

            if (newProgress >= 100) {
                clearInterval(interval);
                setTimeout(() => onLoadComplete(), 300);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [onLoadComplete]);

    return (
        <motion.div
            className="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
            <div className="loading-content">
                {/* Animated Logo with Enhanced Effects */}
                <motion.div
                    className="loading-logo"
                    initial={{ scale: 0.3, opacity: 0, rotateY: -180 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    transition={{
                        duration: 1.2,
                        ease: [0.34, 1.56, 0.64, 1],
                        delay: 0.1
                    }}
                >
                    <motion.div
                        className="brand-logo-large"
                        animate={{
                            boxShadow: [
                                "0 8px 32px rgba(99, 102, 241, 0.4), 0 0 60px rgba(99, 102, 241, 0.2)",
                                "0 8px 48px rgba(99, 102, 241, 0.8), 0 0 100px rgba(99, 102, 241, 0.4)",
                                "0 8px 32px rgba(99, 102, 241, 0.4), 0 0 60px rgba(99, 102, 241, 0.2)",
                            ],
                            scale: [1, 1.05, 1],
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <motion.span
                            animate={{
                                textShadow: [
                                    "0 0 20px rgba(255, 255, 255, 0.5)",
                                    "0 0 40px rgba(255, 255, 255, 0.8)",
                                    "0 0 20px rgba(255, 255, 255, 0.5)",
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            A
                        </motion.span>
                    </motion.div>

                    <motion.h1
                        className="loading-title"
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                    >
                        ASTRAFIN
                    </motion.h1>

                    <motion.p
                        className="loading-subtitle"
                        initial={{ opacity: 0, letterSpacing: "0.5em" }}
                        animate={{ opacity: 1, letterSpacing: "0.2em" }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        AI Financial Advisor
                    </motion.p>
                </motion.div>

                {/* Enhanced Loading Bar with Shimmer */}
                <motion.div
                    className="loading-bar-container"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    <div className="loading-bar-track">
                        <motion.div
                            className="loading-bar-fill"
                            style={{ width: `${progress}%` }}
                            transition={{ duration: 0.1 }}
                        />
                        <motion.div
                            className="loading-bar-glow"
                            style={{ left: `${progress}%` }}
                            animate={{
                                opacity: [0.6, 1, 0.6],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </div>

                    <motion.div
                        className="loading-percentage"
                        key={Math.floor(progress)}
                        initial={{ scale: 1.2, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {Math.floor(progress)}%
                    </motion.div>

                    <motion.p
                        className="loading-text"
                        key={Math.floor(progress / 25)}
                        initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                    >
                        {progress < 25 && "🚀 Initializing AI systems..."}
                        {progress >= 25 && progress < 50 && "📊 Loading financial models..."}
                        {progress >= 50 && progress < 75 && "💎 Preparing your dashboard..."}
                        {progress >= 75 && "✨ Almost ready!"}
                    </motion.p>
                </motion.div>

                {/* Enhanced Orbiting Particles */}
                <div className="loading-particles">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <motion.div
                            key={i}
                            className="particle"
                            animate={{
                                rotate: 360,
                                scale: [1, 1.3, 1],
                                opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                                rotate: { duration: 4 + i * 0.5, repeat: Infinity, ease: "linear" },
                                scale: { duration: 2, repeat: Infinity, delay: i * 0.15 },
                                opacity: { duration: 2, repeat: Infinity, delay: i * 0.15 },
                            }}
                            style={{
                                '--angle': `${i * 45}deg`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Background Pulse Effect */}
            <motion.div
                className="loading-bg-pulse"
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
        </motion.div>
    );
}
