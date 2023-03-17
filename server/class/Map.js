import * as ROT from "rot-js";


class Map {

    constructor(  ) {

        this.tiles  = { };
        this.data   = [ ];

    }

    /**
     * Generate a new map
     * @name        generate
     * @description Generate a new map
     * @param       { Number } width
     * @param       { Number } height
    */
    generate( width, height ) {

        this.digger = new ROT.Map.Digger( width, height, { } );

        let w, h;

        this.digger.create( ( x, y, wall ) => {

            this.data[ `${ x },${ y }` ] = wall;
            if ( wall ) return;

            w = Math.max( w, x );
            h = Math.max( h, y );

            this.tiles[ `${ x },${ y }` ] = "x"

        } );

        // —— Generate digger structure
        for ( let x = 0; x <= width + 1; x++ ) {
            for ( let y = 0; y <= height + 1; y++ ) {

                const _ID = `${ x },${ y }`;

                if ( _ID in this.tiles )
                    continue;

                // —— Walls ———————————————————————————————————————————————————————————————————————————————————————————

                // —— Left
                if ( this.tiles[ `${ x + 1 },${ y }`] && !this.tiles[ `${ x + 1 },${ y }`].blocking )
                    this.tiles[ _ID ] = new Tile( 0, ~~( Math.random() * 4 ), x * 16, y * 16, true );

                // —— Right
                if ( this.tiles[ `${ x - 1 },${ y }` ] && !this.tiles[ `${ x - 1 },${ y }` ].blocking )
                    this.tiles[ _ID ] = new Tile( 5, ~~( Math.random() * 4 ), x * 16, y * 16, true );

                // —— Top
                if ( this.tiles[ `${ x },${ y + 1 }` ] && !this.tiles[ `${ x },${ y + 1 }` ].blocking )
                    this.tiles[ _ID ] = new Tile( Math.floor( Math.random() * 4 ) + 1, 0 , x * 16, y * 16, true );

                // —— Bottom
                if ( this.tiles[ `${ x },${ y - 1 }` ] && !this.tiles[ `${ x },${ y - 1 }` ].blocking )
                    this.tiles[ _ID ] = new Tile( Math.floor( Math.random() * 4 ) + 1, 4 , x * 16, y * 16, true );

            }
        }

        // —— Corners —————————————————————————————————————————————————————————————————————————————————————————————————
        for ( let x = width + 1; x >= 0; x-- ) {
            for ( let y = height + 1; y >= 0; y-- ) {

                // —— Get corners and edges
                const id = `${ x },${ y }`;

                if ( !this.tiles[ id ]) {

                    if ( this.tiles[ `${ x - 1 },${ y - 1 }` ] && !this.tiles[ `${ x - 1 },${ y - 1 }` ].blocking )
                        this.tiles[ id ] = new Tile( 5, 4, x * 16, y * 16, true );

                    if ( this.tiles[ `${ x + 1 },${ y - 1 }` ] && !this.tiles[ `${ x + 1 },${ y - 1 }` ].blocking )
                        this.tiles[ id ] = new Tile( 0, 4, x * 16, y * 16, true );

                    if ( this.tiles[ `${ x - 1 },${y + 1}` ] && !this.tiles[ `${ x - 1 },${ y + 1 }` ].blocking ) {
                        const selected = [ [ 5, 0 ], [ 5, 1 ], [ 5, 2 ], [ 5, 3 ] ][ Math.floor( Math.random() * 4 ) ];
                        this.tiles[ id ] = new Tile( ...selected, x * 16, y * 16, true);
                    }

                    if ( this.tiles[ `${ x + 1 },${ y + 1 }` ] && !this.tiles[ `${x + 1},${y + 1}` ].blocking ) {
                        const selected = [ [ 0, 0 ], [ 0, 1 ], [ 0, 2 ], [ 0, 3 ] ][ Math.floor( Math.random() * 4 ) ];
                        this.tiles[id] = new Tile( ...selected, x * 16, y * 16, true );
                    }

                } else {

                    if ( this.tiles[ `${ x },${ y }` ] && this.tiles[ `${ x },${ y }` ].blocking
                        && this.tiles[ `${ x - 1 },${ y }` ] && !this.tiles[ `${ x - 1 },${ y }` ].blocking
                        && this.tiles[ `${ x + 1 },${ y }` ] && !this.tiles[ `${ x + 1 },${ y }` ].blocking
                    ) {

                        if ( this.tiles[ `${ x },${ y-1 }` ] && !this.tiles[ `${ x },${ y + 1 }` ].blocking ) {
                            this.tiles[ id ] = new Tile( 1, 0, x * 16, y * 16, true);
                        } else {
                            const selected = [ [ 0, 10 ], [ 0, 11 ], [ 0, 12 ], [ 0, 13 ] ][ Math.floor( Math.random() * 4 ) ];
                            this.tiles[ id ] = new Tile( ...selected, x * 16, y * 16, true );
                        }

                    }

                }

            }
        }

        for( const d of this.getDoors() ) {

            if( this.getTileAt( d[ 0 ] + 1, d[ 1 ] )?.[ 0 ]?.blocking && this.getTileAt( d[ 0 ] - 1, d[ 1 ] )?.[ 0 ]?.blocking )
                this.tiles[ `door_${ d[ 0 ] },${ d[ 1 ] }` ] = "D"

            if( this.getTileAt( d[ 0 ], d[ 1 ] + 1 )?.[0]?.blocking && this.getTileAt( d[ 0 ], d[ 1 ] - 1 )?.[ 0 ]?.blocking )
                this.tiles[ `door_${ d[ 0 ] },${ d[ 1 ] }` ] = "D"
        }

    }

    getTileAt( x, y ) {

        const id    = `${ x },${ y }`
            , match = [ ];

        if( this.tiles[ id ] )
            match.push( this.tiles[ id ] );

        if( this.tiles[ `door_${ id }` ] )
            match.push( this.tiles[ `door_${ id }` ] );

        return match;

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