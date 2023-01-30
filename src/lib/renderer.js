import Camera from "./camera";
import game from "../class/game";

class Renderer {

    display     = null;
    camera      = null;
    tileSize    = 16;
    /**
     * Creates the main game display
     * @param   { Number } width
     * @param   { Number } height
     * @returns { HTMLCanvasElement}
    */
    createDisplay( width, height ) {

        // —— Main game display
        const mgd    = document.createElement( "canvas" );
        mgd.id       = "main-game-display";
        mgd.width    = width;
        mgd.height   = height;
        this.display = {
            canvas : mgd,
            context: mgd.getContext( "2d" )
        };

        // this.display.canvas.addEventListener( "mousemove", ( e ) => {
        //     this.mouse = {
        //         x: e.clientX,
        //         y: e.clientY
        //     };
        // } );


        // // this.display.canvas.addEventListener( "mousemove", ( e ) => {

        // //     const x = e.clientX
        // //         , y = e.clientY;

        // //     console.log( x / 16, y / 16)

        // //     console.log( game.visible )
        // // } );

        document.querySelector( "#game" ).appendChild( mgd );

        this.camera = new Camera( width, height );
        return mgd;
    }


    /**
     * Renders a sprite image
     * @param   { Image } spriteImage
     * @param   { Number } x
     * @param   { Number } y
     * @param   { String } orientation
     * @param   { Number } state
     * @returns { void }
     * @todo    Add better support for animations ( currently set inner entity class )
     */
    render( spriteImage, x, y, orientation, state, withGrid = false ) {

        if ( !state )
            return;

        const renderX = this.camera.cx - this.camera.x + x
            , renderY = this.camera.cy - this.camera.y + y;

        // –– Only render the sprite if it is within the camera's view
        if (
            renderX >= 0 - this.tileSize * 2 &&
            renderX <= this.display.canvas.width + this.tileSize * 2 &&
            renderY >= 0 - this.tileSize * 2 &&
            renderY <= this.display.canvas.height + this.tileSize * 2
        ) {

            this.display.context.globalAlpha = state === 1 ? 0.4 : 1;

            // —— Depending on the orientation, we need to rotate the sprite
            if ( orientation === "left" ) {

                this.display.context.save();
                this.display.context.scale( -1, 1 );
                this.display.context.drawImage(
                    spriteImage.image,
                    spriteImage.dx * this.tileSize,
                    spriteImage.dy * this.tileSize,
                    this.tileSize,
                    this.tileSize,
                    -renderX - this.tileSize,
                    renderY,
                    this.tileSize,
                    this.tileSize
                );
                this.display.context.restore();

            } else {

                this.display.context.drawImage(
                    spriteImage.image,
                    spriteImage.dx * this.tileSize,
                    spriteImage.dy * this.tileSize,
                    this.tileSize,
                    this.tileSize,
                    renderX,
                    renderY,
                    this.tileSize,
                    this.tileSize
                );

            }

        }
    }

    die() {

        game.entities.splice( game.entities.indexOf( this ), 1 );
        game.scheduler.remove( this );

    }


}

export default new Renderer();