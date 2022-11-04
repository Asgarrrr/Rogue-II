import {
    Renderer,
    AssetManager
} from "../lib/index";

class Tile {

    constructor(sx, sy, x, y, blocking = false) {
        this.sx = sx;
        this.sy = sy;
        this.x = x;
        this.y = y;
        this.blocking = blocking;
    }

    render() {
        Renderer.render(
            AssetManager.getSpriteImage("sprites", this.sx, this.sy),
            this.x,
            this.y
        );
    }

    update(delta) {}
}

export default Tile;
