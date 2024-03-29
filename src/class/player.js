import {
    Keyboard,
    Renderer,
} from "../lib/index";

import Entity from "./entity";
import { WSManager } from "../lib/index";
import game from "./game";

/**
 * @class Player
 * @extends Entity
 * @description The player class
 */
class Player extends Entity {

    constructor( {
        name,
        health: {
            current : HP,
            max     : maxHP
        },
        strength,
        vitality,
        defense,
        dexterity,
        experience = 0,
        _id: ID,
        class: _class,
    }) {

        super( 0, 8 + parseInt( _class ), 16, 0 );

        this.ID         = ID;

        this.HP         = HP;
        this.maxHP      = maxHP;
        this.strength   = strength;
        this.vitality   = vitality;
        this.defense    = defense;
        this.dexterity  = dexterity;

        this.direction  = null;
        this.type       = "player";


        // —— Experience related properties
        this.XP     = experience;

        document.getElementById( "HPBar" ).style.background = `linear-gradient(90deg, #992020 ${( ( this.HP / this.maxHP ) * 100 )}%, #2f1a22 ${( ( this.HP / this.maxHP ) * 100 )}%)`;
        document.getElementById( "HPCurrent" ).innerHTML = this.HP;
        document.getElementById( "HPMax" ).innerHTML = this.maxHP;
        document.getElementById( "XPBar" ).style.background = `linear-gradient(90deg, #FFAF6599 ${( ( this.XP / this.maxXP() ) * 100 )}%, #2f1a22 ${( ( this.XP / this.maxXP() ) * 100 )}%)`;
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

                } else WSManager.playerMove( this.ID, this.gridX, this.gridY );

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
        console.log( this.type )
        game.gameOver();
        super.die();
    }

    /**
     * @description Update the HP bar
     * @param       { number } hp - The new HP
     * @returns     { void }
     */
    setHP( hp ) {
        super.setHP( hp );
        document.getElementById( "HPBar" ).style.background = `linear-gradient(90deg, #992020 ${( ( this.HP / this.maxHP ) * 100 )}%, #2f1a22 ${( ( this.HP / this.maxHP ) * 100 )}%)`;
        document.getElementById( "HPCurrent" ).innerHTML = this.HP;
        document.getElementById( "HPMax" ).innerHTML = this.maxHP;
        return this.HP;
    }

    setXP( xp ) {

        const levelBefore = this.level();

        this.XP += xp;

        if ( this.level() > levelBefore ) {

            document.getElementById( "XPLvl" ).innerHTML = this.level();

            Renderer.display.context.fillStyle = "#FFAF65";
            Renderer.display.context.font = "20px Arial";
            Renderer.display.context.fillText( `Level up!`, 0, 0 );
            Renderer.display.context.fillStyle = "#FFFFFF";
            Renderer.display.context.font = "12px Arial";
            Renderer.display.context.fillText( `You are now level ${this.level()}`, 0, 20 );

        }

        document.getElementById( "XPBar" ).style.background = `linear-gradient(90deg, #FFAF6599 ${( ( this.XP / this.maxXP() ) * 100 )}%, #2f1a22 ${( ( this.XP / this.maxXP() ) * 100 )}%)`;
    }


    reward( from ) {

        // Give between 50 and 100 XP
        this.setXP( ~~( Math.random() * 50 ) + 50 );
        WSManager.playerReward( this.ID, this.XP );

    }

}

export default Player;
