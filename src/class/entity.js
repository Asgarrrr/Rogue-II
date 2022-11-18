import {
    Renderer,
    AssetManager
} from "../lib/index";

import game from "./game";

class Entity {

    constructor( sx, sy, x, y, map ) {

        this.hostile     = false;

        // —— Map related properties
        this.sx          = sx;
        this.sy          = sy;
        this.x           = x;
        this.y           = y;
        this.gridX       = parseInt( x / 16 );
        this.gridY       = parseInt( y / 16 );
        this.map         = map;
        this.direction   = null;
        this.orientation = null;

        // —— Animation related properties
        this.frames      = AssetManager.getSpriteImage( "entities", this.sx, this.sy ).width / 16;
        this.lastFrame   = 0;
        this.lastUpdate  = 0;

        this.turn        = false;

        // —— Statistic properties
        this.HP         = 20;
        this.maxHP      = 20;
        this.ATK        = 10;
        this.DEF        = 10;
        this.SPD        = 10;
        this.LUK        = 10;
        this.EXP        = 0;
        this.level      = 1;
        this.gold       = 0;

        this.inventory  = [];
        this.equipment  = {
            head    : null,
            body    : null,
            legs    : null,
            feet    : null,
            weapon  : null,
            shield  : null
        };

    }

    render( state = 0 ) {

        if ( !state )
            return;

        Renderer.render(
            AssetManager.getSpriteImage( "entities", this.sx + this.lastFrame, this.sy ),
            this.x,
            this.y,
            this.orientation,
            state == 1 ? 2 : 1
        );

        if ( this.lastUpdate + 200 < Date.now() ) {

            if ( ++this.lastFrame >= this.frames )
                this.lastFrame = 0;

            this.lastUpdate = Date.now();

        }

    }

    async act() {

        game.engine.lock();
        this.type === "player" ? setTimeout( ( ) => ( this.turn = true ), 120 ) : ( this.turn = true );

    }

    turnDone() {

        this.turn = false;
        game.engine.unlock();

    }

    update( delta ) {

        const speed = 2;

        if ( this.gridX * 16 > this.x )
            this.x += speed;
        else if ( this.gridX * 16 < this.x )
            this.x -= speed;
        else if ( this.gridY * 16 > this.y )
            this.y += speed;
        else if ( this.gridY * 16 < this.y )
            this.y -= speed;

    }

    move( direction ) {

        let result = false;
        let newGridX = this.gridX;
        let newGridY = this.gridY;

        switch ( direction ) {
            case "right":
                this.orientation = "right";
                newGridX++;
                break;
            case "left":
                this.orientation = "left";
                newGridX--;
                break;
            case "up":
                newGridY--;
                break;
            case "down":
                newGridY++;
                break;
        }

        for ( let i = 0; i < game.entities.length; i++ )
            if ( game.entities[i].gridX == newGridX && game.entities[i].gridY == newGridY )
                return [ "monster", game.entities[i] ];

        if ( game.map.tiles[ `door_${newGridX},${newGridY}` ]?.blocking ) {
            game.map.tiles[`door_${newGridX},${newGridY}`].open();
            result = true;
        }

        if (
            !game.map.tiles[`${newGridX},${newGridY}`]?.blocking
        ) {
            this.gridX = newGridX;
            this.gridY = newGridY;
            result = true;
        }
        return result;
    }
}

export default Entity;
