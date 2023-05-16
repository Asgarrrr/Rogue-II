
import game from "./game";
import Entity from "./entity";
import AStar from "rot-js/lib/path/astar";

import { WSManager } from "../lib/index.js";

export default class Monster extends Entity {

    constructor(
        ID,
        sx = 0,
        sy = [ 0, 2, 4, 6 ][ ~~( Math.random() * 4 ) ],
        x,
        y,
        isMonster = true,
        isHostile = true,
        HP  = 10,
        MHP = 10,
        ATK = 3,
        VIT = 1,
        DEF = 1,
        DEX = 1
    ) {

        if ( !ID )
            throw new Error( "No ID provided" );

        super( sx, sy, x, y, "monster", true );

        this.ID = ID;
        this.precalculatedPath = [ ];

    }

    update( ) {

        if ( this.turn ) {
            // —— If the monster can see the player, move towards the player
            if ( game.visible[ `${ this.gridX },${ this.gridY }`  ] ) {

                const [ playerX, playerY ] = game.player.getPosition();
                let a
                if ( !this.precalculatedPath.length ) {

                    new AStar(
                        playerX, playerY, ( x, y ) => {
                            return game.map.data[ x + "," + y ] === 0
                        }, { topology: 4 }
                    )

                } else {

                }

                new AStar(
                    playerX, playerY, ( x, y ) => {
                        return game.map.data[ x + "," + y ] === 0
                    }, { topology: 4 }
                )



                    .compute( this.gridX, this.gridY, ( x, y ) => {
                    moves.push( [ x, y ] );
                } );


            }

        }

    }

}
