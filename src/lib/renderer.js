import Camera from "./camera";

class Renderer {

    display = null;
    camera = null;
    tileSize = 16;

    createDisplay(width, height) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        const display = {};
        display.canvas = canvas;
        display.context = context;
        this.display = display;
        document.querySelector("#app").appendChild(canvas);
        context.fillStyle = "#000000";
        this.camera = new Camera( width, height );
        return display;
    }

    render( spriteImage, x, y, direction, state ) {

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

            if ( direction === "left" ) {
                // Flip the sprite horizontally
                this.display.context.save();
                this.display.context.scale(-1, 1);
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
                return;

            }

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

export default new Renderer();