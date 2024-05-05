import { Renderer } from "./Renderer";
import { settings } from "pixi.js";
import { Context } from "./Context";
import { setFOV, AlphaAnimator } from "./Util";
import { Entity } from "./Entity";

import {
    InputSystem,
    RenderSystem,
    ComponentType,
    CameraSystem,
    PositionAnimateSystem,
    RandomMoveSystem
} from "./Component/System/System"


import * as ROT from "rot-js";
import { HostileIA } from "./Component/IA/HostileIA";

export class Game {

    context = new Context({ 
        camera: { 
            x: 0, 
            y: 0, 
            w: window.innerWidth,
            h: window.innerHeight
        } 
    });

    constructor() {

        this.renderer = new Renderer({
            width: this.context.camera.w,
            height: this.context.camera.h,
            backgroundColor: 0x26131a,
            preserveDrawingBuffer: true,
            antialias: true
        });

        document.getElementById( "root" )?.appendChild( this.renderer.getView( ) );

    }

    async init() {
        
        await this.renderer.loadAssetsFromManifest( "spritesheet.json" );

        this.spawnObjects();
        this.loop();

    }

    spawnObjects() {

        const scale = 2;

        const digger = new ROT.Map.Digger( 100, 100, {
            roomWidth       : [ 13, 12 ],
            roomHeight      : [ 13, 12 ],
            corridorLength  : [ 1, 2  ]
        });

        digger.create((x, y, value) => {

            if ( value )
                return;

            this.context.map[ `${ x },${ y }` ] = [ ];
            const sprite = this.renderer.createFromTexture( "atile004" );

            if ( sprite ) {

                sprite.anchor.set(0.5)

                const tint = ROT.RNG.getItem([
                    "0x6f50ff",
                    "0x2f50ff",
                    "0xffffff"
                ]);

                if ( tint )
                    sprite.tint = tint;

                sprite.scale.set( scale );
                sprite.position.set( x * 16 * scale, y * 16 * scale );
                sprite.alpha = 0;

                this.context.tiles[ `${ x },${ y }` ] = {
                    sprite,
                    worldPosition: { x: x * 16 * scale, y: y * 16 * scale },
                    gridPosition: { x, y },
                    walkable: true,
                    alphaAnimator: new AlphaAnimator({
                        start: 0,
                        end: 0,
                        duration: 250,
                        sprite
                    })
                };

                this.renderer.addToScene( sprite, "Tile" );

              }

        });

        const playerSprite = this.renderer.createFromTexture( "priest2" );
        const playerCoord = this.context.findFreeGridCell();

        if ( playerSprite && playerCoord ) {

            const [ x, y ] = playerCoord.split( "," ).map( ( c ) => parseInt( c ) );

            playerSprite.alpha = 1;
            playerSprite.scale.set( scale );
            playerSprite.position.set( x * 16 * scale, y * 16 * scale );
            playerSprite.animationSpeed = 0.04;
            playerSprite.play();
            playerSprite.anchor.set(0.5)

            this.renderer.addToScene( playerSprite, "Entity" );

            const player = new Entity( this.context );
            const visionRadius = 10;

            player.addComponent([
                { type: ComponentType.Camera, data: { } },
                { type: ComponentType.FOV, data: { visionRadius } },
                { type: ComponentType.Render, data: { sprite: playerSprite } },
                { type: ComponentType.Position, data: { x, y } },
                { type: ComponentType.Input, data: { } },
            ]);

            this.context.addEntity( player, playerCoord );
            setFOV( x, y, visionRadius, this.context );

        }

        // Make some random entities
        for ( let i = 0; i < 10; i++ ) {

            const ms = this.renderer.createFromTexture( "skeleton" );
            const mc = this.context.findFreeGridCell();

            if ( ms && mc ) {

                const [ x, y ] = mc.split( "," ).map( ( c ) => parseInt( c ) );
                
                ms.alpha = 1;
                ms.scale.set( scale );
                ms.position.set( x * 16 * scale, y * 16 * scale );
                ms.animationSpeed = (Math.random() * 0.04);
                ms.play();
                ms.anchor.set(0.5)
                
                ms.eventMode = "static";
                
                ms.on('pointerdown', (event) => { alert('clicked!'); });
                ms.on('pointerover', (event) => { ms.tint = 0x00ff00; });
                ms.on('pointerout', (event) => { ms.tint = 0xffffff; });

                this.renderer.addToScene( ms, "Entity" );

                const monster = new Entity( this.context );

                monster.addComponent([
                    { type: ComponentType.Render, data: { sprite: ms } },
                    { type: ComponentType.Position, data: { x, y } },
                    { type: ComponentType.HostileIA, data: { } },
                ]);

                this.context.addEntity( monster, mc );

            }

        }
        
    }

    loop( ) {

        let oldTime = Date.now()
          , newTime = 0;

        const systems = [
            new InputSystem( ),
            new RenderSystem( ),
            new PositionAnimateSystem( ),
            new CameraSystem( ),
            // new RandomMoveSystem( ),
            // new HostileIA( )
        ];

        const animate = () => {

            newTime = Date.now();

            let deltaTime = newTime - oldTime;
            oldTime = newTime;
            deltaTime = ( deltaTime < 0 ) ? 0 : ( deltaTime > 1000 ) ? 1000 : deltaTime;

            for ( const tile of Object.values( this.context.tiles ) ) {

                const { worldPosition, gridPosition, sprite } = tile;

                const visibility = this.context.visibleCoords[
                    `${ gridPosition.x },${ gridPosition.y }`
                ];

                if (
                    visibility === undefined
                    && sprite.alpha > 0
                    && tile.alphaAnimator.end !== 0
                ) {
                    tile.alphaAnimator.restart( sprite.alpha, 0.3 );
                } else if (
                    visibility !== undefined
                    && visibility !== tile.alphaAnimator.end
                ) {
                    tile.alphaAnimator.restart( sprite.alpha, visibility || 0 );
                }

                tile.alphaAnimator.tick( deltaTime );

                sprite.position.set(
                    worldPosition.x - this.context.camera.x,
                    worldPosition.y - this.context.camera.y
                );

            }

            this.context.delta = ( deltaTime * 60 ) / 1000;
            this.context.processEntities( systems );
            this.renderer.render();
            requestAnimationFrame( animate );
        };
    
        requestAnimationFrame( animate );

    }

}