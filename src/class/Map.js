import * as ROT from "rot-js";
import Tile from "./tile";
import Trap from "./trap";
import GroundTile from "./groundtile";
import Door from "../Tiles/Door";

class Map {

    tiles = {};

    constructor() {

        this.digger = new ROT.Map.Digger( 20, 20 );

        let width   = 0;
        let height  = 0;

        this.data   = [];
        this.tiles  = {};

        this.digger.create( ( x, y, wall ) => {

            this.data[ `${x},${y}` ] = wall;

            if ( wall )
                return;

            width   = Math.max( width, x );
            height  = Math.max( height, y );

            this.tiles[ `${x},${y}` ] = new Tile( 9, 0, x * 16, y * 16 );

        });

        for ( let x = 0; x <= width + 1; x++ ) {
            for ( let y = 0; y <= height + 1; y++ ) {

                const id = `${x},${y}`;

                if ( !this.tiles[ id ]) {

                    // Left
                    if ( this.tiles[`${x + 1},${y}`] && !this.tiles[`${x + 1},${y}`].blocking ) {
                        const selected = [ [ 0, 0 ], [ 0, 1 ], [ 0, 2 ], [ 0, 3 ] ][ Math.floor( Math.random() * 4 ) ];
                        this.tiles[id] = new Tile( ...selected, x * 16, y * 16, true );
                    }

                    // left
                    if ( this.tiles[`${x - 1},${y}`] && !this.tiles[`${x - 1},${y}`].blocking ) {
                        const selected = [ [ 5, 0 ], [ 5, 1 ], [ 5, 2 ], [ 5, 3 ] ][ Math.floor( Math.random() * 4 ) ];
                        this.tiles[id] = new Tile( ...selected, x * 16, y * 16, true);
                    }


                    // down
                    if ( this.tiles[`${x},${y + 1}`] && !this.tiles[`${x},${y + 1}`].blocking ) {
                        const selected = [ [ 1, 0 ], [ 2, 0 ], [ 3, 0 ], [ 4, 0 ] ][ Math.floor( Math.random() * 4 ) ];
                        this.tiles[id] = new Tile( ...selected, x * 16, y * 16, true);
                    }

                    // up
                    if ( this.tiles[`${x},${y - 1}`] && !this.tiles[`${x},${y - 1}`].blocking ) {
                        const selected = [ [ 1, 4 ], [ 2, 4 ], [ 3, 4 ], [ 4, 4 ] ][ Math.floor( Math.random() * 4 ) ];
                        this.tiles[id] = new Tile( ...selected, x * 16, y * 16, true);
                    }

                }
            }
        }

        for ( let x = width + 1; x >= 0; x-- ) {
            for ( let y = height + 1; y >= 0; y-- ) {

                // Get corners and edges
                const id = `${x},${y}`;

                if ( !this.tiles[ id ]) {

                    if ( this.tiles[ `${x - 1},${y - 1}` ] && !this.tiles[ `${x - 1},${y - 1}` ].blocking )
                        this.tiles[id] = new Tile( 5, 4, x * 16, y * 16, true);

                    if ( this.tiles[ `${x + 1},${y - 1}` ] && !this.tiles[ `${x + 1},${y - 1}` ].blocking )
                        this.tiles[id] = new Tile( 0, 4, x * 16, y * 16, true);

                    if ( this.tiles[ `${x - 1},${y + 1}` ] && !this.tiles[ `${x - 1},${y + 1}` ].blocking ) {
                        const selected = [ [ 5, 0 ], [ 5, 1 ], [ 5, 2 ], [ 5, 3 ] ][ Math.floor( Math.random() * 4 ) ];
                        this.tiles[id] = new Tile( ...selected, x * 16, y * 16, true);
                    }

                    if ( this.tiles[ `${x + 1},${y + 1}` ] && !this.tiles[ `${x + 1},${y + 1}` ].blocking ) {
                        const selected = [ [ 0, 0 ], [ 0, 1 ], [ 0, 2 ], [ 0, 3 ] ][ Math.floor( Math.random() * 4 ) ];
                        this.tiles[id] = new Tile( ...selected, x * 16, y * 16, true);
                    }

                } else {

                    if ( this.tiles[ `${x},${y}` ] && this.tiles[ `${x},${y}` ].blocking
                        && this.tiles[ `${x-1},${y}` ] && !this.tiles[ `${x-1},${y}` ].blocking
                        && this.tiles[ `${x+1},${y}` ] && !this.tiles[ `${x+1},${y}` ].blocking
                    ) {

                        if ( this.tiles[ `${x},${y-1}` ] && !this.tiles[ `${x},${y+1}` ].blocking ) {
                            this.tiles[id] = new Tile( 1, 0, x * 16, y * 16, true);
                        } else {
                            const selected = [ [ 0, 10 ], [ 0, 11 ], [ 0, 12 ], [ 0, 13 ] ][ Math.floor( Math.random() * 4 ) ];
                            this.tiles[id] = new Tile( ...selected, x * 16, y * 16, true);
                        }

                    }

                }

            }

        }

        for( const door of this.getDoors() ) {

            if( this.getTileAt( door[0] + 1, door[1] )?.[0]?.blocking && this.getTileAt( door[0] - 1, door[1] )?.[0]?.blocking )
                this.tiles[ `door_${ door[0] },${ door[1] }` ] = new Door( 6, 3, door[0] * 16, ( door[1] * 16 ), true, true );

            if( this.getTileAt( door[0], door[1] + 1 )?.[0]?.blocking && this.getTileAt( door[0], door[1] - 1 )?.[0]?.blocking )
                this.tiles[ `door_${ door[0] },${ door[1] }` ] = new Door( 6, 4, door[0] * 16, ( door[1] * 16 ), true, true )
        }

        for( const { _x1, _x2, _y1, _y2 } of this.getRooms() ) {

            // Random coordinates in the room
            const x = Math.floor( Math.random() * ( _x2 - _x1 ) ) + _x1;
            const y = Math.floor( Math.random() * ( _y2 - _y1 ) ) + _y1;

            const tile = this.getTileAt( x, y );

            if( !tile )
                continue;

            if( Math.random() > 0.5 )
                this.tiles[ `rock_${ x },${ y }` ] = new Tile( 8, 6, x * 16, ( y * 16 ), false, true );

        }

    }

    getTileAt( x, y ) {

        return Object.values( this.tiles ).filter( ( tile ) => tile.x === x * 16 && tile.y === y * 16 );

    }

    getDoors() {

        const doors = [];
        for ( const room of this.digger.getRooms() )
            room.getDoors( ( x, y ) => doors.push( [ x, y ] ) );

        return doors;

    }

    getRooms() {
        return this.digger.getRooms();
    }

}

export default Map;
