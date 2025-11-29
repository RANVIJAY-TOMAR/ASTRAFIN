import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Magnetic({ children }) {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);

        // Reduced magnetic strength and add boundary
        const maxDistance = 100;
        const distance = Math.sqrt(middleX * middleX + middleY * middleY);

        if (distance < maxDistance) {
            setPosition({ x: middleX * 0.12, y: middleY * 0.12 }); // Reduced from 0.2
        }
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;
    return (
        <motion.div
            style={{ position: "relative", display: "inline-block" }}
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.5 }}
        >
            {children}
        </motion.div>
    );
}
