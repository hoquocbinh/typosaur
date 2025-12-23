import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.player = null;
        this.ground = null;
        this.villain = null;
        this.isGameOver = false;
    }

    preload() {
        // Load the raw image (with white background)
        this.load.image('cat_raw', '/assets/cat.png');
        this.load.image('villain', '/villain.png');
    }

    create() {
        const { width, height } = this.scale;

        // --- Process Texture to Remove White Background ---
        if (!this.textures.exists('cat')) {
            const rawTexture = this.textures.get('cat_raw');
            const sourceImage = rawTexture.getSourceImage();

            const canvas = document.createElement('canvas');
            canvas.width = sourceImage.width;
            canvas.height = sourceImage.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(sourceImage, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Simple heuristic: if pixel is close to white or grid grey
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Detect White (new cat) OR Checkerboard Greys
                if ((r > 200 && g > 200 && b > 200) ||
                    (Math.abs(r - g) < 20 && Math.abs(r - b) < 20 && r > 100)) {
                    data[i + 3] = 0;
                }
            }
            ctx.putImageData(imageData, 0, 0);

            // Add the processed texture to Phaser
            this.textures.addCanvas('cat', canvas);

            // Manually add frames to the new 'cat' texture
            const t = this.textures.get('cat');
            // Dynamic frame width calculation (3 frames)
            const fW = Math.floor(canvas.width / 3);
            const fH = canvas.height;

            t.add(0, 0, 0, 0, fW, fH);
            t.add(1, 0, fW, 0, fW, fH);
            t.add(2, 0, fW * 2, 0, fW, fH);
        }

        // ------------------------------------------------

        // 1. Background Villain (Giant and fading)
        this.villain = this.add.image(width / 2, height / 2, 'villain')
            .setOrigin(0.5)
            .setDisplaySize(width * 0.9, height * 0.9)
            .setAlpha(0.2);

        // 2. Ground TileSprite for scrolling
        const groundGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        groundGraphics.fillStyle(0xffffff);
        groundGraphics.fillRect(0, 0, 100, 4);
        groundGraphics.generateTexture('white_line', 100, 4);
        this.ground = this.add.tileSprite(0, height - 50, width, 4, 'white_line').setOrigin(0, 1);

        // 3. Player Character
        // Scale down significantly because source is huge (1024px height)
        this.player = this.add.sprite(width * 0.15, height - 50, 'cat')
            .setOrigin(0.5, 1)
            .setScale(0.2);
        this.player.setTint(0xffffff);

        // 4. Create Animations
        // New Sheet: 0, 1, 2 are running frames.
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('cat', { frames: [0, 1, 2] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: [{ key: 'cat', frame: 1 }],
            frameRate: 1
        });

        this.anims.create({
            key: 'eat',
            frames: [{ key: 'cat', frame: 0 }], // Reusing run frame for now
            frameRate: 1
        });

        this.player.play('run');

        // 5. Communications from React
        this.game.events.on('TRIGGER_EAT', () => this.handleEat());
        this.game.events.on('TRIGGER_JUMP', () => this.handleJump());
        this.game.events.on('SET_SPEED', (speed) => this.currentSpeed = speed);

        // Initial background color
        this.cameras.main.setBackgroundColor('#f0f0f0');
    }

    changeBackgroundColor() {
        const hue = Math.random(); // 0-1
        // 0.7 Saturation, 0.9 Lightness (Pastel)
        const color = Phaser.Display.Color.HSLToColor(hue, 0.7, 0.9).color;
        this.cameras.main.setBackgroundColor(color);
    }

    handleEat() {
        if (this.isGameOver) return;

        this.player.play('eat');

        // Lunge forward
        this.tweens.add({
            targets: this.player,
            x: this.scale.width * 0.3,
            duration: 150,
            yoyo: true,
            ease: 'Power2',
            onComplete: () => {
                if (!this.isGameOver) this.player.play('run');
            }
        });

        // Flash villain
        this.tweens.add({
            targets: this.villain,
            alpha: 0.6,
            duration: 100,
            yoyo: true,
            onComplete: () => this.villain.setAlpha(0.2)
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

        // Scroll ground
        this.ground.tilePositionX += 5;
    }
}
