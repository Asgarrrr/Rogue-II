
/**
 * @class       AssetManager
 * @description AssetManager is a class that manages assets such as images, sounds, and data.
 */
class AssetManager {

    images = new Map( );

    /**
     * @method      loadImage
     * @description Loads an image into the AssetManager.
     * @param       {string} key The name of the image.
     * @param       {string} src The source of the image.
     * @returns     {Promise}
     */
    loadImage( key, src ) {
        return new Promise( ( resolve, reject ) => {

            const image = new Image();
            image.onload    = () => resolve( this.images.set( key, image ) );
            image.onerror   = () => reject();
            image.src = src;

        });
    }

    /**
     * @method      getSpriteImage
     * @description Returns a sprite image from the AssetManager.
     * @param       {string} key The name of the image.
     * @param       {number} sx The x position of the sprite.
     * @param       {number} sy The y position of the sprite.
     * @returns     {Image}
     */
    getSpriteImage( imageKey, dx, dy) {
        return {
            image   : this.images.get( imageKey ),
            dx,
            dy,
            width   : this.images.get(imageKey).width,
            height  : this.images.get(imageKey).height
        }
    }
}

export default new AssetManager();