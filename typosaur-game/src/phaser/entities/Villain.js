export default class Villain {
    constructor(scene, x, y) {
        this.scene = scene;
        const { width, height } = scene.scale;

        this.image = this.scene.add.image(x, y, 'villain')
            .setOrigin(0.5)
            .setDisplaySize(width * 0.9, height * 0.9)
            .setAlpha(0.2);
    }

    flash() {
        this.scene.tweens.add({
            targets: this.image,
            alpha: 0.6,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                if (this.image) {
                    this.image.setAlpha(0.2);
                }
            }
        });
    }
}
