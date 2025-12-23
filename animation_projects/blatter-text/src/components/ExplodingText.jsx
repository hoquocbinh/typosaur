import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CONFIG } from '../config';

const ExplodingText = ({ text, mousePos }) => {
    const characters = useMemo(() => {
        return text.split('').map((char, index) => ({
            char,
            id: `${index}-${char}`,
            // Pre-calculate random physics parameters for each character
            physics: {
                angle: Math.random() * Math.PI * 2,
                force: Math.random() * (CONFIG.MAX_RADIUS - CONFIG.MIN_RADIUS) + CONFIG.MIN_RADIUS,
                rotation: (Math.random() - 0.5) * CONFIG.ROTATION_RANGE
            }
        }));
    }, [text]);

    const variants = {
        initial: {
            opacity: 0,
            scale: 0.5,
            y: 20,
            filter: 'blur(10px)'
        },
        animate: (i) => ({
            opacity: 1,
            scale: 1,
            y: 0,
            filter: 'blur(0px)',
            x: 0,
            rotate: 0,
            transition: {
                duration: 0.8,
                ease: [0.2, 0.65, 0.3, 0.9],
                delay: (i / text.length) * CONFIG.STAGGER_MAX_DELAY // Stagger entrance based on config
            }
        }),
        exit: (custom) => {
            const { mousePos, physics, index } = custom;
            // Calculate scatter target
            const scatterX = Math.cos(physics.angle) * physics.force;
            const scatterY = Math.sin(physics.angle) * physics.force;

            // We need to calculate the relative position to the mouse
            // Since we don't know the exact screen position of this char easily without refs,
            // we'll assume the text center is roughly relative (0,0) of the container 
            // or rely on the visual effect that they just fly 'towards' the mouse vector.
            // An approximation: Use window center offset if the text is centered, 
            // or pass container ref. For now, we assume text is centered on screen.

            const windowCenterX = window.innerWidth / 2;
            const windowCenterY = window.innerHeight / 2;

            // Target position is mouse position relative to window center
            // But since the element is AT center, it's just mousePos - center.
            const targetX = mousePos.x - windowCenterX;
            const targetY = mousePos.y - windowCenterY;

            return {
                x: [0, scatterX, targetX],
                y: [0, scatterY, targetY],
                opacity: [1, 1, 0],
                scale: [1, 0.8, 0],
                rotate: [0, physics.rotation, physics.rotation + 180],
                filter: ['blur(0px)', 'blur(0px)', 'blur(4px)'],
                transition: {
                    duration: CONFIG.EXPLOSION_DURATION + CONFIG.FLIGHT_DURATION,
                    times: [0, 0.3, 1], // 30% time scattering, 70% flying to cursor
                    ease: "easeInOut"
                }
            };
        }
    };

    return (
        <div className="exploding-text-container">
            {characters.map((item, index) => (
                <motion.span
                    key={item.id}
                    custom={{ mousePos, physics: item.physics, index }}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="exploding-char"
                    style={{ display: 'inline-block', whiteSpace: 'pre' }}
                >
                    {item.char}
                </motion.span>
            ))}
        </div>
    );
};

export default ExplodingText;
