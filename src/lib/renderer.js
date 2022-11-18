import Camera from "./camera";

class Renderer {

    display     = null;
    camera      = null;
    tileSize    = 16;

    createDisplay( width, height ) {

        // Main game display
        const mgd    = document.createElement( "canvas" );
        mgd.id       = "main-game-display";
        mgd.width    = width;
        mgd.height   = height;
        this.display = {
            canvas : mgd,
            context: mgd.getContext( "2d" )
        };

        document.querySelector( "#game" ).appendChild( mgd );

        this.camera = new Camera( width, height );
        return mgd;
    }

    render( spriteImage, x, y, orientation, state ) {

        let renderX = this.camera.cx - this.camera.x + x;
        let renderY = this.camera.cy - this.camera.y + y;

        if (
            renderX >= 0 - this.tileSize * 2 &&
            renderX <= this.display.canvas.width + this.tileSize * 2 &&
            renderY >= 0 - this.tileSize * 2 &&
            renderY <= this.display.canvas.height + this.tileSize * 2
        ) {

            if ( !state )
                return;

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
}

export default new Renderer();