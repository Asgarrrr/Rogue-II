
import { HOSTILE_IA_SYSTEM_FLAGS } from "../System/System";
import { BaseIA } from "./BaseIA.js";
import { ComponentType } from "../System/System";
import AStar from "rot-js/lib/path/astar.js";
import { DIRS, RNG } from "rot-js";

export class HostileIA extends BaseIA {

    constructor( ) {
        super( );
    }

    act( e, c ) {

        if ( !( e.has( HOSTILE_IA_SYSTEM_FLAGS ) && c.entityTurn === e.index ) )
            return;

        // —— Get the entity position, considering PositionAnimate if available.
        let {
            data: {
                x: mx,
                y: my
            }
        } = e.get( ComponentType.Position );

        let pAnimate = e.get( ComponentType.PositionAnimate );

        if ( pAnimate ) {
            mx = pAnimate.data.end.x;
            my = pAnimate.data.end.y;
        }

        // —— If the entity is out of vision, do a random move.

        const path = [ ];

        if ( !c.visibleCoords[ `${ mx },${ my }` ] ) {

            const directions = [ ];

            for ( const [ dx, dy ] of DIRS[ 4 ] ) {
                if ( c.map[ `${ mx + dx },${ my + dy }` ]?.length === 0 )
                    directions.push( [ dx, dy ] );
            }

            if ( directions.length ) {

                const [ dx, dy ] = RNG.getItem( directions )
                path.push( [ mx + dx, my + dy ] );
            
            }


        } else {

            // —— If the entity is in vision, calculate the path to the player and move to the first tile of the path.
            const player = Object.values( c.entities )?.[ 0 ];

            let {
                data: {
                    x: px,
                    y: py
                }
            } = player.get( ComponentType.Position );

            pAnimate = player.get( ComponentType.PositionAnimate );

            if ( pAnimate ) {
                px = pAnimate.data.end.x;
                py = pAnimate.data.end.y;
            }

            // —— Extract the entities positions and the tiles walkability. Exclude the entity and the player.
            const entities = { };

            for ( const [ key, entity ] of Object.entries( c.entities ) ) {

                const { x, y } = entity.get( ComponentType.Position).data
                    , pAnimate = entity.get( ComponentType.PositionAnimate );

                entities[ key ] = pAnimate
                    ? { x: pAnimate.data.end.x, y: pAnimate.data.end.y }
                    : { x, y };

            }

            delete entities[ e.index ];
            delete entities[ player.index ];

            const walkable = ( x, y ) => {

                if ( !c.tiles[ `${ x },${ y }` ] )
                    return false;

                return !( c.tiles[ `${ x },${ y }` ]?.walkable && Object.values( entities ).find( ( e ) => e.x === x && e.y === y ) );

            }

            const astar = new AStar( px, py, walkable, { topology: 4 } );

            astar.compute( mx, my, ( x, y ) => {
                path.push( [ x, y ] );
            } );

            // —— Remove the first tile of the path, which is the entity position, and the last tile, which is the player position.
            path.shift( );
            path.pop( );

        }


        if ( path.length > 0 ) {

            const [ dx, dy ] = path[ 0 ];

            e.removeComponent( ComponentType.PositionAnimate );

            e.addComponent( [{
                type: ComponentType.PositionAnimate,
                data: {
                    start: { x: mx, y: my },
                    end: {
                        x: dx,
                        y: dy
                    },
                    counter: 0,
                    duration: 10
                }
            }] );

            c.moveEntity(
                e.index,
                `${ mx },${ my }`,
                `${ dx },${ dy }`
            );
    
        }

        e.endTurn( );

    }

}