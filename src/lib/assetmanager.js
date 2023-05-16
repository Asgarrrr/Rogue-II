
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

            const image     = new Image();
            image.onload    = ( ) => resolve( this.images.set( key, image ) );
            image.onerror   = ( ) => reject( );
            image.src = src;

        });

    }

    /**
     * @method      getSpriteImage
     * @description Returns a sprite image from the AssetManager.
     * @param       {string} imageKey The name of the image.
     * @param       {number} dx The x position of the sprite.
     * @param       {number} dy The y position of the sprite.
     * @returns     {Image}
     */
    getSpriteImage( imageKey, dx, dy) {

        const image = this.images.get( imageKey )

        return { image, dx, dy, width : image.width, height : image.height }

    }
}

export default new AssetManager( );