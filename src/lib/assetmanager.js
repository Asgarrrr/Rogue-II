class AssetManager {
    images = new Map();

    loadImage(key, src) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                this.images.set(key, image);
                console.log(this.images);
                resolve();
            };
            image.onerror = () => reject();
            image.src = src;
        });
    }

    getSpriteImage(imageKey, dx, dy) {
        return {
            image: this.images.get(imageKey),
            dx,
            dy,
            width: this.images.get(imageKey).width,
            height: this.images.get(imageKey).height
        }
    }
}

export default new AssetManager();
