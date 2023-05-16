import game from "./game";
import Entity from "./entity";
import AStar from "rot-js/lib/path/astar.js";
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

    }

    update( ) {

        // —— When it's the monster's turn
        if ( this.turn ) {
            // —— If the monster can see the player, move towards the player
            if ( game.visible[ this.gridX + "," + this.gridY ] ) {

                const [ playerX, playerY ] = game.player.getPosition();

                // —— Create a new AStar instance to find the path to the player
                const astar = new AStar( playerX, playerY, ( x, y ) => {
                    return game.map.data[ x + "," + y ] === 0;
                }, { topology: 4 } );

                const moves = [ ];

                astar.compute( this.gridX, this.gridY, ( x, y ) => {
                    moves.push( [ x, y ] );
                } );

                // —— Remove the monster's current position from the moves array and the last position ( the player's position )
                moves.shift();
                moves.pop();

                // —— If the monster is not next to the player, move towards the player
                if ( moves.length > 0 ) {

                    const [ nextX, nextY ] = moves[ 0 ];
                    const direction = ( nextX > this.gridX ) ? "right" : ( nextX < this.gridX ) ? "left" : ( nextY > this.gridY ) ? "down" : "up";

                    if ( this.move( direction ) )
                        WSManager.entityMove( this.ID, this.gridX, this.gridY );

                } else {

                    // —— If the monster is next to the player, attack the player
                    this.attack( game.player );
                }

            } else {

                // —— If the monster can't see the player, move on a random direction
                if ( this.move( [ "right", "left", "up", "down" ][ ~~( Math.random() * 4 ) ] ) )
                    WSManager.entityMove( this.ID, this.gridX, this.gridY );

            }

            this.turnDone();

        }
        super.update();

    }

}