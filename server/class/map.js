import * as ROT from "rot-js";
import MapModel from "../../src/models/map.model.js";

class Map {

    constructor(  ) {

        this.tiles  = { };
        this.data   = { };

    }

    async generate( width = 30, height = 30 ) {

        this.digger = new ROT.Map.Digger( width, height, { } );
        let w, h;

        this.digger.create( ( x, y, wall ) => {

            this.data[ `${ x },${ y }` ] = wall;

            if ( wall )
                return;

            w = Math.max( w, x );
            h = Math.max( h, y );

            this.tiles[ `${ x },${ y }` ] = [
                ~~( Math.random() * 3 ) + 6,  ~~( Math.random() * 3 ), x * 16, y * 16
            ]

        } );

        for ( let x = 0; x < width; x++ ) {
            for ( let y = 0; y < height; y++ ) {

                const _ID = `${ x },${ y }`;

                if ( _ID in this.tiles )
                    continue;

                // — Left
                if ( this.tiles[ `${ x + 1 },${ y }`] && !this.tiles[ `${ x + 1 },${ y }`][ 4 ] )
                    this.tiles[ _ID ] = [ 0, ~~( Math.random() * 4 ), x * 16, y * 16, true ]

                // — Right
                if ( this.tiles[ `${ x - 1 },${ y }` ] && !this.tiles[ `${ x - 1 },${ y }` ][ 4 ] )
                    this.tiles[ _ID ] = [ 5, ~~( Math.random() * 4 ), x * 16, y * 16, true ]

                // — Top
                if ( this.tiles[ `${ x },${ y + 1 }` ] && !this.tiles[ `${ x },${ y + 1 }` ][ 4 ] )
                    this.tiles[ _ID ] = [ ~~( Math.random() * 4 ) + 1, 0 , x * 16, y * 16, true ]

                // — Bottom
                if ( this.tiles[ `${ x },${ y - 1 }` ] && !this.tiles[ `${ x },${ y - 1 }` ][ 4 ] )
                    this.tiles[ _ID ] = [ ~~( Math.random() * 4 ) + 1, 4 , x * 16, y * 16, true ]

            }

        }

        for ( let x = width + 1; x >= 0; x-- ) {
            for ( let y = height + 1; y >= 0; y-- ) {

                // —— Get corners and edges
                const id = `${ x },${ y }`;

                if ( !this.tiles[ id ]) {

                    if ( this.tiles[ `${ x - 1 },${ y - 1 }` ] && !this.tiles[ `${ x - 1 },${ y - 1 }` ][ 4 ] )
                        this.tiles[ id ] = [ 5, 4, x * 16, y * 16, true ];

                    if ( this.tiles[ `${ x + 1 },${ y - 1 }` ] && !this.tiles[ `${ x + 1 },${ y - 1 }` ][ 4 ] )
                        this.tiles[ id ] = [ 0, 4, x * 16, y * 16, true ];

                    if ( this.tiles[ `${ x - 1 },${y + 1}` ] && !this.tiles[ `${ x - 1 },${ y + 1 }` ][ 4 ] ) {
                        const selected = [ [ 5, 0 ], [ 5, 1 ], [ 5, 2 ], [ 5, 3 ] ][ ~~( Math.random() * 4 ) ];
                        this.tiles[ id ] = [ ...selected, x * 16, y * 16, true];
                    }

                    if ( this.tiles[ `${ x + 1 },${ y + 1 }` ] && !this.tiles[ `${x + 1},${y + 1}` ][ 4 ] ) {
                        const selected = [ [ 0, 0 ], [ 0, 1 ], [ 0, 2 ], [ 0, 3 ] ][ ~~( Math.random() * 4 ) ];
                        this.tiles[ id ] = [ ...selected, x * 16, y * 16, true ];
                    }

                } else {

                    if ( this.tiles[ `${ x },${ y }` ] && this.tiles[ `${ x },${ y }` ][ 4 ]
                        && this.tiles[ `${ x - 1 },${ y }` ] && !this.tiles[ `${ x - 1 },${ y }` ][ 4 ]
                        && this.tiles[ `${ x + 1 },${ y }` ] && !this.tiles[ `${ x + 1 },${ y }` ][ 4 ]
                    ) {

                        if ( this.tiles[ `${ x },${ y-1 }` ] && !this.tiles[ `${ x },${ y + 1 }` ][ 4 ] ) {
                            this.tiles[ id ] = [ 1, 0, x * 16, y * 16, true ];
                        } else {
                            const selected = [ [ 0, 10 ], [ 0, 11 ], [ 0, 12 ], [ 0, 13 ] ][ ~~( Math.random() * 4 ) ];
                            this.tiles[ id ] = [ ...selected, x * 16, y * 16, true ];
                        }

                    }

                }

            }
        }

        // —— Add exit add random room
        const rooms = this.digger.getRooms();
        const exitRoom = rooms[ ~~( Math.random() * rooms.length ) ];

        // Get random position in room
        const exitX = ~~( Math.random() * ( exitRoom.getRight() - exitRoom.getLeft() ) ) + exitRoom.getLeft();
        const exitY = ~~( Math.random() * ( exitRoom.getBottom() - exitRoom.getTop() ) ) + exitRoom.getTop();

        // —— Save map
        return await new MapModel( {
            width,
            height,
            tiles   : this.tiles,
            data    : this.data,
            doors   : this.getDoors(),
            rooms   : this.getRooms(),
            exit    : [ exitX, exitY ],
        } ).save();

    }

    getDoors() {

        const doors = [];
        for ( const room of this.digger.getRooms() )
            room.getDoors( ( x, y ) => doors.push( [ x, y ] ) );

        return doors;

    }

    getRooms( ) {

        const rooms = this.digger.getRooms();
        return rooms.map( ( room ) => ({
            x1: room.getLeft(),
            y1: room.getTop(),
            x2: room.getRight(),
            y2: room.getBottom(),
        }) );

    }

    async loadMap( mapID ) {

        const _map = await MapModel.findOne( { _id: mapID } );

        if ( !_map ) {

            this.generate( 30, 30 );
            return this.tiles;

        }

        return _map.tiles;

    }

}

export default Map;