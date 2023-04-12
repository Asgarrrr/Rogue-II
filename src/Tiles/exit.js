import {
    WSManager, Renderer
} from "../lib/index";

import Tile from "../class/tile";

import Game from "../class/game";

export default class Exit extends Tile {

    constructor( sx, sy, x, y, blocking = false, subTiles = false ) {

        super( sx, sy, x, y, blocking, subTiles );

    }

    exit( ) {

        WSManager.nextLevel(
            Game.player.ID
        );

        WSManager.test(
            Game.map._ID
        );

        WSManager.askForMap(
            Game.player.ID
        )

    }

    update(delta) {


        //
        // WSManager.nextLevel(
        //     Game.player

    }



}