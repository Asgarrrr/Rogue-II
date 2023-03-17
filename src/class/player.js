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

    constructor( XP = 1 ) {

        super( 0, 8, 16, 0 );

        this.direction  = null;
        this.type       = "player";
        this.ATK        = 10;

        // —— Experience related properties
        this.XP     = XP;
        this.level  = ( ) => Math.ceil( ( Math.sqrt( 1 + ( 8 * this.XP ) / 100 ) - 1 ) / 2 );
        this.maxXP  = ( ) => ( Math.ceil( this.level() ) * ( Math.ceil( this.level() ) + 1 ) ) * 100;

        document.getElementById( "HPBar" ).style.background = `linear-gradient(90deg, #992020 ${( ( this.HP / this.maxHP ) * 100 )}%, #180e12 ${( ( this.HP / this.maxHP ) * 100 )}%)`;
        document.getElementById( "HPCurrent" ).innerHTML = this.HP;
        document.getElementById( "HPMax" ).innerHTML = this.maxHP;
        document.getElementById( "XPBar" ).style.background = `linear-gradient(90deg, #FFAF6599 ${( ( this.XP / this.maxXP() ) * 100 )}%, #180e12 ${( ( this.XP / this.maxXP() ) * 100 )}%)`;
        document.getElementById( "XPLvl" ).innerHTML = this.level();
    }

    /**
     * @description Update the position of the player ( and the camera )
     * @returns     { void }
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
            else if ( Keyboard.pressed( " " ) )
                return this.turnDone();

            if ( this.direction ) {

                const m = this.move( this.direction );

                if ( m === false )
                    return; // Invalid turn

                if ( m !== true ) {

                    if ( m instanceof Entity ) {

                        switch ( m.type ) {

                            case "monster":
                                this.attack( m )
                                break;

                            case "shop":
                                m.hello( )
                                break;

                        }
                    }

                }

                this.turnDone();

            }

        }

        super.update();

        Renderer.camera.x = this.x;
        Renderer.camera.y = this.y;

    }

    /**
     * @description Called when the player die
     * @returns     { void }
     * @override
     * @see         Entity.die
     */
    die() {
        super.die();
        game.gameOver();
    }

    /**
     * @description Update the HP bar
     * @param       { number } hp - The new HP
     * @returns     { void }
     */
    setHP( hp ) {
        super.setHP( hp );
        document.getElementById( "HPBar" ).style.background = `linear-gradient(90deg, #992020 ${( ( this.HP / this.maxHP ) * 100 )}%, #180e12 ${( ( this.HP / this.maxHP ) * 100 )}%)`;
        document.getElementById( "HPCurrent" ).innerHTML = this.HP;
        document.getElementById( "HPMax" ).innerHTML = this.maxHP;
    }

    setXP( xp ) {

        const levelBefore = this.level();

        this.XP += xp;

        if ( this.level() > levelBefore ) {

            // Block rendering


            document.getElementById( "XPLvl" ).innerHTML = this.level();

            Renderer.display.context.fillStyle = "#FFAF65";
            Renderer.display.context.font = "20px Arial";
            Renderer.display.context.fillText( `Level up!`, 0, 0 );
            Renderer.display.context.fillStyle = "#FFFFFF";
            Renderer.display.context.font = "12px Arial";
            Renderer.display.context.fillText( `You are now level ${this.level()}`, 0, 20 );

        }

        document.getElementById( "XPBar" ).style.background = `linear-gradient(90deg, #FFAF6599 ${( ( this.XP / this.maxXP() ) * 100 )}%, #180e12 ${( ( this.XP / this.maxXP() ) * 100 )}%)`;
    }


    reward( from ) {

        console.log( "Rewarding player" );

        this.setXP( 60 );

    }

}

export default Player;
