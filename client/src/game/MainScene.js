import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.player = null;
        this.ground = null;
        this.villain = null;
        this.isGameOver = false;
        this.activeLetterTweens = [];
        this.activeLetterTexts = [];

        // Animation constants for easy tuning
        this.LETTER_ANIMATION = {
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
        };
    }

    preload() {
        this.load.image('cat_raw', '/assets/cat_spritesheet.png');
        this.load.image('villain', '/villain.png');
    }

    create() {
        const { width, height } = this.scale;

        // --- Process Texture to Remove Checkerboard Background ---
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

        // 1. Background Villain
        this.villain = this.add.image(width / 2, height / 2, 'villain')
            .setOrigin(0.5)
            .setDisplaySize(width * 0.9, height * 0.9)
            .setAlpha(0.2);

        // 2. Ground
        const groundGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        groundGraphics.fillStyle(0xffffff);
        groundGraphics.fillRect(0, 0, 100, 4);
        groundGraphics.generateTexture('white_line', 100, 4);
        this.ground = this.add.tileSprite(0, height - 50, width, 4, 'white_line').setOrigin(0, 1);

        // 3. Player
        this.player = this.add.sprite(width * 0.15, height - 50, 'cat')
            .setOrigin(0.5, 1)
            .setScale(2.5);
        this.player.setTint(0xffffff);

        // 4. Animations
        if (!this.anims.exists('run')) {
            this.anims.create({
                key: 'run',
                frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 4 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.anims.exists('jump')) {
            this.anims.create({
                key: 'jump',
                frames: this.anims.generateFrameNumbers('cat', { start: 5, end: 9 }),
                frameRate: 10,
                repeat: 0
            });
        }

        if (!this.anims.exists('eat')) {
            this.anims.create({
                key: 'eat',
                frames: this.anims.generateFrameNumbers('cat', { start: 10, end: 14 }),
                frameRate: 10,
                repeat: 0
            });
        }

        this.player.play('run');

        // 5. Event Listeners
        this.game.events.on('TRIGGER_EAT', (data) => this.handleEat(data));
        this.game.events.on('TRIGGER_JUMP', () => this.handleJump());
        this.game.events.on('SET_SPEED', (speed) => this.currentSpeed = speed);

        this.cameras.main.setBackgroundColor('#f0f0f0');
    }

    changeBackgroundColor() {
        const hue = Math.random();
        const color = Phaser.Display.Color.HSLToColor(hue, 0.7, 0.9).color;
        this.cameras.main.setBackgroundColor(color);
    }

    cleanupLetterAnimations() {
        this.activeLetterTweens.forEach(tween => {
            if (tween && tween.isPlaying && tween.isPlaying()) {
                tween.stop();
            }
        });
        this.activeLetterTweens = [];

        this.activeLetterTexts.forEach(text => {
            if (text && text.scene) {
                text.destroy();
            }
        });
        this.activeLetterTexts = [];
    }

    handleEat(data) {
        if (this.isGameOver) return;

        // Support both string and object payload
        const word = (typeof data === 'string') ? data : data.word;
        const charPositions = (typeof data === 'object' && data.charPositions) ? data.charPositions : [];

        const centerFallbackX = this.scale.width / 2;
        const centerFallbackY = this.scale.height / 2;

        // Letter explosion animation
        if (word && word.length > 0) {
            const letters = word.split('');
            const targetX = this.player.x;
            const targetY = this.player.y - this.player.displayHeight / 3;
            const config = this.LETTER_ANIMATION;
            let maxTotalDuration = 0;



            // Cat eat animation
            // Ensure non-negative delay (maxTotalDuration is 0 when explosion is disabled)
            const eatTriggerTime = maxTotalDuration > 0 ? Math.max(0, maxTotalDuration - 400) : 0;
            this.time.delayedCall(eatTriggerTime, () => {
                if (!this.isGameOver) {
                    this.player.play('eat');
                    this.player.once('animationcomplete', () => {
                        if (!this.isGameOver && this.player.anims.currentAnim.key === 'eat') {
                            this.player.play('run');
                        }
                    });
                }
            });
        }

        // Flash villain
        this.tweens.add({
            targets: this.villain,
            alpha: 0.6,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                if (this.villain) {
                    this.villain.setAlpha(0.2);
                }
            }
        });
    }

    handleJump() {
        if (this.isGameOver || this.player.y < this.scale.height - 50) return;

        this.changeBackgroundColor();
        this.player.play('jump');
        this.tweens.add({
            targets: this.player,
            y: this.scale.height - 250,
            duration: 300,
            yoyo: true,
            ease: 'Sine.easeOut',
            onComplete: () => {
                if (!this.isGameOver) this.player.play('run');
            }
        });
    }

    update(time, delta) {
        if (this.isGameOver) return;
        this.ground.tilePositionX += 5;
    }

    shutdown() {
        this.cleanupLetterAnimations();
        this.game.events.off('TRIGGER_EAT');
        this.game.events.off('TRIGGER_JUMP');
        this.game.events.off('SET_SPEED');
    }
}