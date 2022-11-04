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
        this.camera = new Camera(width, height);
        console.log(this.camera);
        return display;
    }

    render(spriteImage, x, y, direction) {
        let renderX = this.camera.cx - this.camera.x + x;
        let renderY = this.camera.cy - this.camera.y + y;
        if (
            renderX >= 0 - this.tileSize * 2 &&
            renderX <= this.display.canvas.width + this.tileSize * 2 &&
            renderY >= 0 - this.tileSize * 2 &&
            renderY <= this.display.canvas.height + this.tileSize * 2
        ) {

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