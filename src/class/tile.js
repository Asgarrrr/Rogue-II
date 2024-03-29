import {
    Renderer,
    AssetManager,
    WSManager
} from "../lib/index";

import Game from "./game.js";

class Tile {

    constructor(
        sx, sy, x, y,
        blocking = false,
        subTiles = false,
    ) {
        this.sx = sx;
        this.sy = sy;
        this.x = x;
        this.y = y;
        this.blocking = blocking;
        this.subTiles = subTiles
        this.alreadyRendered = false;
    }

    render( state = 0 ) {

        if ( !state && !this.alreadyRendered )
            return;

        if ( state === 1 && !this.alreadyRendered )
            this.alreadyRendered = true;

        Renderer.render(
            AssetManager.getSpriteImage( "sprites", this.sx, this.sy ),
            this.x,
            this.y,
            this.direction,
            state == 1 ? 2 : 1,
            this.blocking ? false : state == 1 ? ( this.subTiles ? false : true ) : false
        );


    }

    update( delta ) {}
}

export default Tile;
