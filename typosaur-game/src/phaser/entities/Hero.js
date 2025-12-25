export default class Hero {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = this.scene.add.sprite(x, y, 'cat')
            .setOrigin(0.5, 1)
            .setScale(1.5);
        this.sprite.setTint(0xffffff);

        this.createAnimations();
        this.play('run');
    }

    createAnimations() {
        if (!this.scene.anims.exists('run')) {
            this.scene.anims.create({
                key: 'run',
                frames: this.scene.anims.generateFrameNumbers('cat', { start: 0, end: 4 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists('jump')) {
            this.scene.anims.create({
                key: 'jump',
                frames: this.scene.anims.generateFrameNumbers('cat', { start: 5, end: 9 }),
                frameRate: 10,
                repeat: 0
            });
        }

        if (!this.scene.anims.exists('eat')) {
            this.scene.anims.create({
                key: 'eat',
                frames: this.scene.anims.generateFrameNumbers('cat', { start: 10, end: 14 }),
                frameRate: 10,
                repeat: 0
            });
        }
    }

    play(animationKey) {
        this.sprite.play(animationKey);
    }

    jump() {
        if (this.sprite.y < this.scene.scale.height - 50) return;

        this.play('jump');
        this.scene.tweens.add({
            targets: this.sprite,
            y: this.scene.scale.height - 250,
            duration: 300,
            yoyo: true,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.play('run');
            }
        });
    }

    eat() {
        this.play('eat');
        this.sprite.once('animationcomplete', () => {
            if (this.sprite.anims.currentAnim.key === 'eat') {
                this.play('run');
            }
        });
    }

    getPosition() {
        return { x: this.sprite.x, y: this.sprite.y };
    }

    getDisplayHeight() {
        return this.sprite.displayHeight;
    }
}
