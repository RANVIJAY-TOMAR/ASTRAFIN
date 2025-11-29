import { motion } from "framer-motion";

export default function Typewriter({ text, speed = 0.015 }) { // Faster speed
    const sentenceVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: speed,
            },
        },
    };

    const letterVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.05 } // Quick fade
        },
    };

    return (
        <motion.span
            variants={sentenceVariants}
            initial="hidden"
            animate="visible"
            style={{ willChange: 'opacity' }}
        >
            {text.split("").map((char, index) => (
                <motion.span key={`${char}-${index}`} variants={letterVariants}>
                    {char}
                </motion.span>
            ))}
        </motion.span>
    );
}
