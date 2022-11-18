import * as ROT from "rot-js";

import {
    Renderer,
    AssetManager,
    GameLoop,
    Keyboard
} from "../lib/index";

import sprite from "../assets/Dungeon_Tileset.png";
import entities from "../assets/entities.png";
import flag from "../assets/testTrap.png";

import Minimap from "./minimap";
import GameMap from "./map";
import Player from "./player";
import TestEntity from "./testentity";

class Game {

    constructor() {

        this.entities   = [];
        this.tiles      = [];
        this.map        = null;
        this.render     = this.render.bind( this );
        this.update     = this.update.bind( this );
        this.engine     = null;
        this.visible    = { };

        this.playerOPos = { x: null, y: null };
    }

    async init( ) {

        Renderer.createDisplay( 512, 288 );
        Minimap.createDisplay( 128, 128 );

        await this.loadAssets();

        GameLoop.init({
            render: this.render,
            update: this.update
        });

        this.map = new GameMap();

        // Create a new player entity
        const player = new Player();
        this.player = player;
        const tile = Object.values( this.map.tiles )[ 0 ];
        player.x = tile.x;
        player.gridX = parseInt( tile.x / 16 );
        player.y = tile.y;
        player.gridY = parseInt( tile.y / 16 );
        this.entities.push( player );

        for ( let i = 0; i < 5; i++ ) {

            // Create a new test entity, and place it in a random room
            const entity = new TestEntity( 0, [ 0, 2, 4, 6 ][ Math.floor( Math.random() * 5 ) ], 0, 0 );
            const room = this.map.getRooms()[~~( Math.random() * this.map.getRooms().length )];

            const { _x1, _x2, _y1, _y2 } = room;

            // TODO: Check if the tile is walkable
            entity.x = ~~( Math.random() * ( _x2 - _x1 ) + _x1 ) * 16;
            entity.gridX = parseInt( entity.x / 16 );
            entity.y = ~~( Math.random() * ( _y2 - _y1 ) + _y1 ) * 16;
            entity.gridY = parseInt( entity.y / 16 );
            this.entities.push( entity );

        }

        const scheduler = new ROT.Scheduler.Simple();

        for (const entity of this.entities)
            scheduler.add( entity, true );

        this.engine = new ROT.Engine( scheduler );
        this.engine.start();

        GameLoop.start();
    }

    /**
     * Load all assets for the game
     */
    async loadAssets() {

        await AssetManager.loadImage("sprites", sprite);
        await AssetManager.loadImage("entities", entities );
        await AssetManager.loadImage("flag", flag );

    }

    update( delta ) {

        this.entities.forEach( ( entity ) => entity.update( delta ) );

    }

    render() {

        const [ x, y ] = [
            this.player.x / 16,
            this.player.y / 16
        ];

        // Relatively expensive operation, so only do it when the player moves
        if ( ~~this.playerOPos.x != ~~x || ~~this.playerOPos.y != ~~y ) {

            this.visible = { };

            // Calculate the field of view for the player
            const FOV = new ROT.FOV.PreciseShadowcasting( ( x, y ) =>
                this.map.getTileAt( x, y )?.some( ( tile ) => tile.blocking ) ? 0 : 1
            );

            // Determine which tiles are visible to the player
            FOV.compute( this.player.gridX, this.player.gridY, 10, ( x, y ) => {
                this.visible[ `${ x },${ y }` ] = true;
            });

            this.playerOPos = { x, y };

        }

        for ( const tile of ( Object.values( this.map.tiles ).filter( ( tile ) => !tile.subTiles ) ) )
            tile.render( this.visible[ `${ tile.x / 16 },${ tile.y / 16 }` ] | 0 )

        // Render sub-tiles ( doors, windows, etc. )
        for ( const tile of ( Object.values( this.map.tiles ).filter( ( tile ) => tile.subTiles ) ) )
            tile.render( this.visible[ `${ tile.x / 16 },${ tile.y / 16 }` ] | 0 )

        // Render entities ( monsters, items, etc. )
        for ( const entity of this.entities ) {
            entity.render( this.visible[ `${ entity.gridX },${ entity.gridY }` ] | 0 )
            // entities.hunt( player );
        };

        Minimap.update( this.visible, this.map.tiles, [ this.entities, this.player ] );


    }

}

export default new Game();