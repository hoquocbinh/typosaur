export const GAME_CONFIG = {
    INITIAL_TIME: 5000,
    MIN_TIME_LIMIT: 10000,
    TIMER_DECREMENT: 100, // ms
    PENALTY_TIME: 500, // ms
    SCORE_MULTIPLIER: 100, // Time reduction per score

    // Animation Config (formerly in MainScene)
    LETTER_ANIMATION: {
        BASE_EXPLOSION_DURATION: 700,
        BASE_CONVERGE_DURATION: 1600,
        FADE_OUT_DURATION: 300,
        TIME_VARIATION: 0.3,
        LETTER_DELAY: 30,
        SCATTER_MIN: 350,
        SCATTER_MAX: 700,
        ROTATION_MIN: 180,
        ROTATION_MAX: 360,
        SCALE_EXPLOSION: 2.2,
        SCALE_MIN: 0.5,
        SCALE_FINAL: 0.3,
        WOBBLE_AMPLITUDE: 15,
        WOBBLE_FREQUENCY: 4,
        DEPTH: 10000
    },

    // Phaser Event Names
    EVENTS: {
        TRIGGER_EAT: 'TRIGGER_EAT',
        TRIGGER_JUMP: 'TRIGGER_JUMP',
        SET_SPEED: 'SET_SPEED'
    }
};

export const ANIMATION_CONFIG = {
    // Animation timing (seconds)
    EXPLOSION_DURATION: 0.5,
    FLIGHT_DURATION: 1.2,
    STAGGER_MAX_DELAY: 0.5,

    // Visual Physics
    MIN_RADIUS: 300,  // Min scatter distance
    MAX_RADIUS: 600, // Max scatter distance
    ROTATION_RANGE: 360, // Character spin amount
};

export const COLOR_THEMES = {
    DEFAULT: {
        color: '#00ffff',
        background: 'none',
        WebkitBackgroundClip: 'border-box',
        backgroundClip: 'border-box',
        textShadow: '0 0 10px rgba(0, 255, 255, 0.8)'
    }, // Cyan
    LEVEL_1: {
        color: '#00ff00',
        background: 'none',
        WebkitBackgroundClip: 'border-box',
        backgroundClip: 'border-box',
        textShadow: '0 0 10px rgba(0, 255, 0, 0.8)'
    }, // Green
    LEVEL_2: {
        color: '#ff00ff',
        background: 'none',
        WebkitBackgroundClip: 'border-box',
        backgroundClip: 'border-box',
        textShadow: '0 0 10px rgba(255, 0, 255, 0.8)'
    }, // Magenta
    LEVEL_3: {
        color: '#ff0000',
        background: 'none',
        WebkitBackgroundClip: 'border-box',
        backgroundClip: 'border-box',
        textShadow: '0 0 10px rgba(255, 0, 0, 0.8)'
    }  // Red
};
