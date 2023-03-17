import {
    Renderer,
    AssetManager
} from "../lib/index";

import Tile from "../class/tile";

export default class Chest extends Tile {

    constructor( sx, sy, x, y, blocking = false, subTiles = false ) {

        super( sx, sy, x, y, blocking, subTiles );

        this.frames = AssetManager.getSpriteImage( "dynamic", this.sx, this.sy ).width / 16;

    }

    render( state = 0 ) {

        console.log( state )

        Renderer.render(
            AssetManager.getSpriteImage( "dynamic", this.sx, this.sy ),
            this.x,
            this.y,
            this.direction,
            state == 1 ? 2 : 1,
            this.blocking ? false : state == 1 ? ( this.subTiles ? false : true ) : false
        );


    }


    open() {

    }

    update(delta) {

    }



}