import { Renderer, AssetManager } from "../lib/index";
import game from "./game";

class Entity {

    constructor( sx, sy, x, y, map, type, hostile = false ) {

        this.type        = type;
        this.hostile     = hostile;

        // —— Map related properties
        this.sx          = sx;
        this.sy          = sy;
        this.x           = x;
        this.y           = y;
        this.gridX       = parseInt( x / 16, 10 );
        this.gridY       = parseInt( y / 16, 10 );
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
        this.ATK        = 2;
        this.DEF        = 10;
        this.SPD        = 10;
        this.LUK        = 10;

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

        this.hasTakeDamage = false;

    }

    render( state = 0 ) {

        if ( !state )
            return;

        const sprite = AssetManager.getSpriteImage( "entities", this.sx + this.lastFrame, this.sy );

        // if hasTakeDamage is true, then we need to render the entity with a red filter
        if ( this.hasTakeDamage ) {

            // Change the color of the sprite
            const canvas = document.createElement( "canvas" );
            canvas.width = sprite.width;
            canvas.height = sprite.height;
            const context = canvas.getContext( "2d" );

            context.drawImage( sprite.image, 0, 0, sprite.width, sprite.height, 0, 0, sprite.width, sprite.height );

            const imageData = context.getImageData( 0, 0, sprite.width, sprite.height );
            const data = imageData.data;

            for ( let i = 0; i < data.length; i += 4 ) {
                data[ i ] = 255;
                data[ i + 1 ] = 0;
                data[ i + 2 ] = 0;
            }

            context.putImageData( imageData, 0, 0 );

            const newSprite = new Image();
            newSprite.src = canvas.toDataURL();

            sprite.image = newSprite;


            Renderer.render(
                sprite,
                this.x,
                this.y,
                this.orientation,
                state === 1 ? 2 : 1,
            );

        } else {

            Renderer.render(
                AssetManager.getSpriteImage( "entities", this.sx + this.lastFrame, this.sy ),
                this.x,
                this.y,
                this.orientation,
                state === 1 ? 2 : 1,
            );

        }

        if ( this.lastUpdate + 200 < Date.now() ) {

            if ( ++this.lastFrame >= this.frames )
                this.lastFrame = 0;

            this.lastUpdate = Date.now();

        }

        if ( this.hostile ) {

            const renderX = Renderer.camera.cx - Renderer.camera.x + this.x
                , renderY = Renderer.camera.cy - Renderer.camera.y + this.y;

            // —— Draw the HP bar ( green part )
            Renderer.display.context.fillStyle = "rgba( 0, 255, 0, 0.2 )";
            Renderer.display.context.fillRect( renderX, renderY - 5, ( this.HP / this.maxHP ) * 16, 2 );

            // —— Draw the HP bar ( red part )
            Renderer.display.context.fillStyle = "rgba( 255, 0, 0, 0.2 )";
            Renderer.display.context.fillRect( renderX + ( this.HP / this.maxHP ) * 16, renderY - 5, ( ( this.maxHP - this.HP ) / this.maxHP ) * 16, 2 );

        }

    }

    async act() {

        game.engine.lock();
        this.type === "player"
            ? setTimeout( ( ) => ( this.turn = true ), 120  )
            : ( this.turn = true );

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

        let result   = false
          , newGridX = this.gridX
          , newGridY = this.gridY;

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
            if ( game.entities[ i ].gridX == newGridX && game.entities[ i ].gridY == newGridY )
                return game.entities[ i ];

        if ( game.map.tiles[ `door_${ newGridX },${ newGridY }` ]?.blocking ) {
            game.map.tiles[ `door_${ newGridX },${ newGridY }` ].open();
            result = true;
        }

        if ( !game.map.tiles[`${ newGridX },${ newGridY }`]?.blocking ) {
            this.gridX = newGridX;
            this.gridY = newGridY;
            result = true;
        }

        return result;
    }

    /**
     * @method moveToCell
     * @description Sets the entity position
     * @param {Number} X - The X coordinate of the tile
     * @param {Number} Y - The Y coordinate of the tile
     */
    moveToCell( X, Y ) {

        this.gridX = X;
        this.gridY = Y;

        return true;

    }

    /**
     * @method getPosition
     * @description Returns the entity position
     * @returns {Array} The entity position
     */
    getPosition() {
        return [ this.gridX, this.gridY ];
    }

    attack( target ) {

        console.log( "alp")

        target.hasTakeDamage = true;

        // —— Calculate the relative position of the target
        const [ targetX  , targetY   ] = target.getPosition()
            , [ attackerX, attackerY ] = this.getPosition()

            , relativeX = attackerX - targetX
            , relativeY = attackerY - targetY;

        // —— Reverse if target.type == "player"
        if ( target.type == "player" ) {
            if ( relativeX > 0 )
                this.x -= 10;
            else if ( relativeX < 0 )
                this.x += 10;
            else if ( relativeY > 0 )
                this.y -= 10;
            else if ( relativeY < 0 )
                this.y += 10;
        } else {

            // —— Calculate the direction of the attack ( move px )
            if ( relativeX > 0 )
                this.x += 10;
            else if ( relativeX < 0 )
                this.x -= 10;
            else if ( relativeY > 0 )
                this.y += 10;
            else if ( relativeY < 0 )
                this.y -= 10;

        }

        // —— Block game engine for 200ms
        game.engine.lock();
        setTimeout( ( ) => {

            target.hasTakeDamage = false;

            if ( target.setHP( target.HP - this.ATK ) <= 0 ) {

                target.die( );

                if ( this.type == "player" )
                    this.reward( target );

            }

            game.engine.unlock();

        }, 200 );

    }

    die() {
        game.entities.splice( game.entities.indexOf( this ), 1 );
        game.scheduler.remove( this );
    }

    setHP( HP ) {

        this.HP = HP;

        if ( this.HP > this.maxHP )
            this.HP = this.maxHP;

        return this.HP;

    }

}

export default Entity;
