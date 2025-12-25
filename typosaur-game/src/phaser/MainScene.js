import Phaser from 'phaser';
import Hero from './entities/Hero';
import Villain from './entities/Villain';
import { GAME_CONFIG } from '../constants/settings';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.hero = null;
        this.ground = null;
        this.villain = null;
        this.isGameOver = false;
    }

    preload() {
        this.load.image('cat_raw', '/assets/cat_spritesheet.png');
        this.load.image('villain', '/villain.png');
    }

    create() {
        const { width, height } = this.scale;

        // --- Process Texture logic kept inline or extracted to helper? ---
        // For now, keep it here or extract to a Utils file if complex.
        this.processCatTexture();

        // 1. Background Villain
        this.villain = new Villain(this, width / 2, height / 2);

        // 2. Ground
        const groundGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        groundGraphics.fillStyle(0xffffff);
        groundGraphics.fillRect(0, 0, 100, 4);
        groundGraphics.generateTexture('white_line', 100, 4);
        this.ground = this.add.tileSprite(0, height - 50, width, 4, 'white_line').setOrigin(0, 1);

        // 3. Player (Hero)
        this.hero = new Hero(this, width * 0.15, height - 50);

        // 4. Event Listeners
        this.game.events.on(GAME_CONFIG.EVENTS.TRIGGER_EAT, (data) => this.handleEat(data));
        this.game.events.on(GAME_CONFIG.EVENTS.TRIGGER_JUMP, () => this.hero.jump());
        this.game.events.on(GAME_CONFIG.EVENTS.SET_SPEED, (speed) => this.currentSpeed = speed);

        this.cameras.main.setBackgroundColor('#f0f0f0');
    }

    processCatTexture() {
        if (!this.textures.exists('cat')) {
            const rawTexture = this.textures.get('cat_raw');
            const sourceImage = rawTexture.getSourceImage();

            const canvas = document.createElement('canvas');
            canvas.width = sourceImage.width;
            canvas.height = sourceImage.height;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(sourceImage, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Simple background removal logic
                const isColor = (r > g + 20) || (r > b + 20);
                const isDark = r < 50 && g < 50 && b < 50;

                if (!isColor && !isDark) {
                    data[i + 3] = 0;
                }
            }
            ctx.putImageData(imageData, 0, 0);

            this.textures.addCanvas('cat', canvas);

            const frameWidth = Math.floor(canvas.width / 5);
            const frameHeight = Math.floor(canvas.height / 3);

            const t = this.textures.get('cat');
            for (let i = 0; i < 5; i++) t.add(i, 0, i * frameWidth, 0, frameWidth, frameHeight);
            for (let i = 0; i < 5; i++) t.add(i + 5, 0, i * frameWidth, frameHeight, frameWidth, frameHeight);
            for (let i = 0; i < 5; i++) t.add(i + 10, 0, i * frameWidth, frameHeight * 2, frameWidth, frameHeight);
        }
    }

    changeBackgroundColor() {
        const hue = Math.random();
        const color = Phaser.Display.Color.HSLToColor(hue, 0.7, 0.9).color;
        this.cameras.main.setBackgroundColor(color);
    }

    handleEat(data) {
        if (this.isGameOver) return;

        // Flash villain
        this.villain.flash();

        // Trigger eat animation
        // Timing logic from config
        const explosionDuration = GAME_CONFIG.LETTER_ANIMATION.BASE_EXPLOSION_DURATION; // unused in phaser now?
        // Actually React controls flight duration: 1.2s + 0.5s explosion = 1.7s
        // We set delay to 1500ms in previous edit

        // Use a slightly safer synced value or pass from React?
        // For now hardcode or use constant matching React
        const eatTriggerTime = 1500;

        this.time.delayedCall(eatTriggerTime, () => {
            if (!this.isGameOver) {
                this.hero.eat();
            }
        });
    }

    update(time, delta) {
        if (this.isGameOver) return;
        this.ground.tilePositionX += 5;
    }

    shutdown() {
        this.game.events.off(GAME_CONFIG.EVENTS.TRIGGER_EAT);
        this.game.events.off(GAME_CONFIG.EVENTS.TRIGGER_JUMP);
        this.game.events.off(GAME_CONFIG.EVENTS.SET_SPEED);
    }
}
