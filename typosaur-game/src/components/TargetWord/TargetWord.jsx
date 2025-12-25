import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ANIMATION_CONFIG } from '../../constants/settings';
import './TargetWord.css';

const TargetWord = ({ text, targetPos, typedLength = 0, colorTheme }) => {
    const characters = useMemo(() => {
        return text.split('').map((char, index) => ({
            char,
            id: `${index}-${char}`,
            // Pre-calculate random physics parameters for each character
            physics: {
                angle: Math.random() * Math.PI * 2,
                force: Math.random() * (ANIMATION_CONFIG.MAX_RADIUS - ANIMATION_CONFIG.MIN_RADIUS) + ANIMATION_CONFIG.MIN_RADIUS,
                rotation: (Math.random() - 0.5) * ANIMATION_CONFIG.ROTATION_RANGE
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
                delay: (i / text.length) * ANIMATION_CONFIG.STAGGER_MAX_DELAY
            }
        }),
        exit: (custom) => {
            const { targetPos, physics } = custom;
            // Calculate scatter target
            const scatterX = Math.cos(physics.angle) * physics.force;
            const scatterY = Math.sin(physics.angle) * physics.force;

            const windowCenterX = window.innerWidth / 2;
            const windowCenterY = window.innerHeight / 2;

            // Target position is targetPos relative to window center
            const targetX = (targetPos?.x || 0) - windowCenterX;
            const targetY = (targetPos?.y || 0) - windowCenterY;

            return {
                x: [0, scatterX, targetX],
                y: [0, scatterY, targetY],
                opacity: [1, 1, 0],
                scale: [1, 0.8, 0],
                rotate: [0, physics.rotation, physics.rotation + 180],
                filter: ['blur(0px)', 'blur(0px)', 'blur(4px)'],
                transition: {
                    duration: ANIMATION_CONFIG.EXPLOSION_DURATION + ANIMATION_CONFIG.FLIGHT_DURATION,
                    times: [0, 0.3, 1], // 30% time scattering, 70% flying to cursor
                    ease: "easeInOut"
                }
            };
        }
    };

    return (
        <div className="target-word-container">
            {characters.map((item, index) => (
                <motion.span
                    key={item.id}
                    custom={{ targetPos, physics: item.physics, index }}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`target-char ${index < typedLength ? 'typed' : ''}`}
                    style={{
                        display: 'inline-block',
                        whiteSpace: 'pre',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        ...(index >= typedLength && colorTheme ? colorTheme : {})
                    }}
                >
                    {item.char}
                </motion.span>
            ))}
        </div>
    );
};

export default TargetWord;
