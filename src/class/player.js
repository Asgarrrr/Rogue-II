import {
    Keyboard,
    Renderer,
} from "../lib/index";

import Entity from "./entity";

import game from "./game";

/**
 * @class Player
 * @extends Entity
 * @description The player class
 */
class Player extends Entity {

    constructor() {
        super( 0, 9, 16, 0 );
        this.direction  = null;
        this.type       = "player";
    }

    /**
     * @method update
     * @description Update the position of the player ( and the camera )
     * @returns {void}
     */
    update() {

        if ( this.turn ) {

            this.direction = null;

            if ( Keyboard.pressed( "ArrowRight" ) )
                this.direction = "right";
            else if ( Keyboard.pressed( "ArrowLeft" ) )
                this.direction = "left";
            else if ( Keyboard.pressed( "ArrowUp" ) )
                this.direction = "up";
            else if ( Keyboard.pressed( "ArrowDown" ) )
                this.direction = "down";

            if ( this.direction ) {

                const m = this.move( this.direction );

                if ( !m )
                    return;

                if ( m === true )
                    console.log( this.HP );
                else if ( Array.isArray( m ) ) {

                    if ( m[ 0 ] === "monster" )
                        m[ 1 ].takeDamage( 5 );

                }

                this.turnDone();

            }

        }

        super.update();

        Renderer.camera.x = this.x;
        Renderer.camera.y = this.y;

    }

    takeDamage( damage ) {

        this.HP -= damage || 1;

        if ( this.HP <= 0 )
            game.gameOver();

    }

}

export default Player;
