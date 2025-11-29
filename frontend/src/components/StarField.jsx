import { useEffect, useRef } from 'react';

export default function StarField() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = '';
        const starCount = 300;

        // Star color palette
        const starColors = [
            '#ffffff', // White (common)
            '#aabbff', // Blue
            '#ffddaa', // Yellow
            '#ffaaaa', // Red giant
        ];

        // Create stars
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');

            const x = Math.random() * 100;
            const y = Math.random() * 100;

            const size = Math.random() < 0.85
                ? Math.random() * 1.5 + 0.5
                : Math.random() * 3 + 2;

            const duration = Math.random() * 4 + 2;
            const delay = Math.random() * 5;
            const opacity = Math.random() * 0.8 + 0.2;

            const colorIndex = Math.random() < 0.7 ? 0 : Math.floor(Math.random() * starColors.length);
            const color = starColors[colorIndex];

            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.setProperty('--duration', `${duration}s`);
            star.style.setProperty('--delay', `${delay}s`);
            star.style.setProperty('--opacity', opacity);
            star.style.setProperty('--star-color', color);

            container.appendChild(star);
        }

        // Parallax effect removed - stars are now completely static
        return () => {
            container.innerHTML = '';
        };
    }, []);

    return <div id="star-field" ref={containerRef}></div>;
}
