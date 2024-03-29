import * as ROT from "rot-js";

import {
    Renderer,
    AssetManager,
    GameLoop,
    WSManager
} from "../lib/index";

import sprite from "../assets/Dungeon_Tileset.png";
import entities from "../assets/entities.png";
import dynamic from "../assets/dynAssets.png"
import flag from "../assets/testTrap.png";

import Minimap from "./minimap";
import Map from "./map.js";
import Player from "./player";
import TestEntity from "./Monster.js";
import Shop from "./shop"

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

    async init( {
        hero,
        socket
    }) {

        WSManager.init( socket );
        WSManager.ping( );

        if ( !hero )
            alert( "No hero selected" );

        Renderer.createDisplay( 512, 288 );
        Minimap.createDisplay( 128, 128 );

        await this.loadAssets();

        GameLoop.init({
            render: this.render,
            update: this.update
        });


        socket.emit( "map:askForMap", {
            token   : localStorage.getItem( "bearer" ),
            champID : hero._id
        } );

        socket.on( "map:askForMap", ( data ) => {

            // Reset the game
            this.entities = [];
            this.tiles = [];
            this.map = null;
            this.visible = { };
            Minimap.clear();

            this.map = new Map();
            this.map.generate( data );

            this.player = new Player( hero );
            this.player.gridX = data?.nsp?.x || hero.position.x || 1;
            this.player.gridY = data?.nsp?.y || hero.position.y || 1;
            this.player.x = this.player.gridX * 16;
            this.player.y = this.player.gridY * 16;
            this.player.maxHP = hero.health.max;
            this.player.defense = hero.defense;
            this.player.strength = hero.strength;
            this.player.vitality = hero.vitality;
            this.player.dexterity = hero.dexterity;
            this.player.setXP( hero.experience );

            this.player.setHP( hero.health.current );

            this.entities.push( this.player );

            for( const entity in data.entities ) {

                const {
                    _id,
                    position: { x, y },
                    sx, sy, health: { current: HP, max: MHP }
                } = data.entities[ entity ];

                const _entity = new TestEntity( _id, sx, sy, 0, 0 );

                console.log( HP, MHP )

                _entity.x           = x * 16;
                _entity.gridX       = x;
                _entity.y           = y * 16;
                _entity.gridY       = y;
                _entity.HP          = 10;
                _entity.maxHP       = 10;
                _entity.strength    = 2;
                _entity.defense     = 2;

                this.entities.push( _entity );

            }

            this.scheduler = new ROT.Scheduler.Simple();

            for ( const entity of this.entities )
                this.scheduler.add( entity, true );

            this.engine = new ROT.Engine( this.scheduler );
            this.engine.start();

            if( !GameLoop.accumulator )
                GameLoop.start();

        } );

        // Renderer.display.canvas.addEventListener( "mousemove", ( e ) => {
        //
        //     const rect = Renderer.display.canvas.getBoundingClientRect();
        //
        //     // –– Get the mouse position relative to the canvas ( take into account the width and height of the canvas )
        //     const x = ( e.clientX - rect.left ) / ( rect.right - rect.left ) * Renderer.display.canvas.width;
        //     const y = ( e.clientY - rect.top ) / ( rect.bottom - rect.top ) * Renderer.display.canvas.height;
        //
        //     this.mouse = { x, y };
        //
        // } );

        // document.addEventListener( "keydown", ( e ) => {
        //
        //     if ( e.key === "i" ) {
        //
        //         if ( !document.getElementById( "inventory" ).classList.contains( "hidden" ) ) {
        //             document.getElementById( "inventory" ).classList.add( "hidden" );
        //             document.getElementById( "cover" ).classList.remove( "hidden" )
        //             return;
        //         }
        //
        //         document.getElementById( "inventory" ).classList.remove( "hidden" );
        //         document.getElementById( "cover" ).classList.add( "hidden")
        //
        //         console.log( player.inventory );
        //
        //
        //     }
        //
        // } );

    }

    /**
     * Load all assets for the game
     */
    async loadAssets() {

        await Promise.all( [
            AssetManager.loadImage( "sprites", sprite ),
            AssetManager.loadImage( "entities", entities ),
            AssetManager.loadImage( "flag", flag ),
            AssetManager.loadImage( "dynamic", dynamic ),
        ]);

    }

    update( delta ) {

        for ( const entity of this.entities )
            entity.update( delta );

    }

    render() {

        const x = this.player.x / 16
            , y = this.player.y / 16;

        // –– Relatively expensive operation, so only do it when the player moves
        if ( ~~this.playerOPos.x != ~~x || ~~this.playerOPos.y != ~~y ) {

            console.log( "Player moved" )

            this.visible = { };

            // –– Calculate the field of view for the player
            const FOV = new ROT.FOV.PreciseShadowcasting( ( x, y ) => this.map.getTileAt( x, y )?.some( ( t ) => t.blocking ) ? 0 : 1 );

            // –– Determine which tiles are visible to the player
            FOV.compute( this.player.gridX, this.player.gridY, 10, ( x, y ) => this.visible[ `${ x },${ y }` ] = true );

            this.playerOPos = { x, y };

        }

        // Render the map elements
        for ( const tile of Object.values( this.map.tiles ) )
            tile.render( this.visible[ `${ tile.x / 16 },${ tile.y / 16 }` ] | 0 );

        // Render entities ( monsters, items, etc. )
        for ( const entity of this.entities )
            entity.render( this.visible[ `${ entity.gridX },${ entity.gridY }` ] | 0 )

        Minimap.update( this.visible, this.map.tiles, [ this.entities, this.player ] );

        // Draw squares around the mouse position ( only on floor tiles )
        // if ( this.mouse ) {
        //
        //     const x = ~~( this.mouse.x / 16 ) * 16;
        //     const y = ~~( this.mouse.y / 16 ) * 16;
        //
        //     const renderX = Renderer.camera.cx - Renderer.camera.x
        //         , renderY = Renderer.camera.cy - Renderer.camera.y;
        //
        //     const tile = this.map.getTileAt( ( x - renderX ) / 16, ( y - renderY ) / 16 )?.[ 0 ];
        //
        //     if ( tile && !tile.blocking && this.visible[ `${ tile.x / 16 },${ tile.y / 16 }` ] ) {
        //
        //         Renderer.display.context.fillStyle = "rgba( 255, 255, 255, 0.5 )";
        //         Renderer.display.context.fillRect( x, y, 16, 16 );
        //
        //     }
        //
        // }

    }

    gameOver( ) {

        GameLoop.stop();
        this.engine.lock();

        setTimeout( () => {

            window.alert( "You lose!" );
            window.location.reload();

        }, 100 )


        // if ( this.trigger )
        //     return;
        //
        // this.trigger = true;
        //
        // for( let i = 0; i < 100; i++) {
        //
        //     for ( const entity of this.entities ) {
        //
        //         // Get the entity's position
        //         const x = entity.x;
        //         const y = entity.y;
        //
        //         // Check possible movement directions
        //         const dirs = [
        //             [ x, y - 16 ],
        //             [ x, y + 16 ],
        //             [ x - 16, y ],
        //             [ x + 16, y ],
        //             [ x - 16, y - 16 ],
        //             [ x + 16, y - 16 ],
        //             [ x - 16, y + 16 ],
        //             [ x + 16, y + 16 ],
        //         ];
        //
        //         // Filter out invalid directions
        //         const validDirs = dirs.filter( ( [ x, y ] ) => {
        //
        //             // Check if the tile is walkable
        //             const tile = this.map.getTileAt( x / 16, y / 16 )?.[ 0 ];
        //
        //             if ( tile && !tile.blocking && this.visible[ `${ tile.x / 16 },${ tile.y / 16 }` ] ) return true;
        //
        //             return false;
        //
        //         } );
        //
        //         if ( !validDirs.length ) continue;
        //
        //         // Pick a random direction
        //         const [ newX, newY ] = validDirs[ ~~( Math.random() * validDirs.length ) ];
        //
        //         // Move the entity
        //         entity.move( newX, newY );


         //   }

        // }


        // if ( this.trig ) return;
        // this.trig = true


        // Skip turn for all entities







        // //GameLoop.stop();
        // // Skip turn for all entities
        // setInterval(() => {
        //     const e = this.scheduler.next();
        //     console.log( e )
        //     e.turns = true
        //     e.update( )
        // }, 1000);



        // const element = document.createElement( "div" );
        // element.classList.add( "game-over" );
        // // Add the element at the start of the #game
        // document.getElementById( "game" ).prepend( element );

        // element.style.outline = Renderer.display.canvas.width + "px solid #000000";
        // document.getElementById( "main-game-display" ).classList.add( "shake" );
        // document.getElementById( "main-game-display" ).style.backgroundColor = "black";
        // document.getElementById( "root" ).style.backgroundColor = "black";


    }

}

export default new Game( );