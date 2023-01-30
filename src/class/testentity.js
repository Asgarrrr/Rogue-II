
import game from "./game";
import Entity from "./entity";
import AStar from "rot-js/lib/path/AStar";

class TestEntity extends Entity {
    constructor( sx, sy, x, y ) {
        super( sx, sy, x, y, 0, true );
    }

    update() {

        if ( this.turn ) {

            if ( game.visible[ this.gridX + "," + this.gridY ] ) {

                const [ playerX, playerY ] = game.player.getPosition();

                var astar = new AStar( playerX, playerY, ( x, y ) => {
                    return game.map.data[ x + "," + y ] === 0;
                }, { topology: 4 } );

                const moves = [ ];

                astar.compute( this.gridX, this.gridY, ( x, y ) => {
                    moves.push( [ x, y ] );
                } );

                moves.shift();
                moves.pop();

                if ( moves.length > 0 ) {

                    const [ nextX, nextY ] = moves[ 0 ];
                    const direction = ( nextX > this.gridX ) ? "right" : ( nextX < this.gridX ) ? "left" : ( nextY > this.gridY ) ? "down" : "up";

                    this.move( direction );

                } else {

                    this.attack( game.player );
                }

                this.turnDone();

            } else {

                // —— If the monster can't see the player, move on a random direction
                this.move( [ "right", "left", "up", "down" ][
                    ~~( Math.random() * 4 )
                ] );
                this.turnDone();

            }

        }
        super.update();
    }

}

export default TestEntity;
