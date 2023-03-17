
import {
    AssetManager
} from "../lib/index";

import Tile from "../class/tile";

export default class Door extends Tile {

    constructor( sx, sy, x, y, blocking = false, subTiles = false ) {

        super( sx, sy, x, y, blocking, subTiles );

        this.frames = AssetManager.getSpriteImage( "sprites", this.sx, this.sy ).width / 16;
        this.lastFrame  = 0;
        this.lastUpdate = 0;

    }

    open() {

        if ( this.sx === 6 && this.sy === 3 )
            ( this.sx = 7, this.sy = 4 );

        else if ( this.sx === 6 && this.sy === 4 )
            ( this.sx = 6, this.sy = 3, this.y = this.y - 8 );

        this.blocking = false;

    }

    update(delta) {

    }



}