import * as ROT from "rot-js";
import Tile from "./tile";
import Door from "../Tiles/Door";
import game from "./game";
import Chest from "../Tiles/Chest";
import Exit from "../Tiles/exit.js";


class Map {

    constructor(  ) {

        this.tiles  = { };
        this.data   = [ ];
        this._ID    = null;

    }

    generate( { width, height, tiles, data, doors, exit, _id } ) {

        this._ID   = _id;
        this.tiles = tiles;
        this.data  = data;

        // —— Loop through the map and generate tiles
        // Loop through the tiles and generate the map
        for ( const _ID in this.tiles ) {

            const [ sx, sy, x, y, blocking, subTiles, alreadyRendered ] = this.tiles[ _ID ];
            this.tiles[ _ID ] = new Tile( sx, sy, x, y, blocking, subTiles, alreadyRendered );

        }

        // —— Loop through the doors and generate them
        for ( const _ID in doors ) {

            if( this.getTileAt( doors[ _ID ][ 0 ] + 1, doors[ _ID ][ 1 ] )?.[ 0 ]?.blocking && this.getTileAt( doors[ _ID ][ 0 ] - 1, doors[ _ID ][ 1 ] )?.[ 0 ]?.blocking )
                this.tiles[ `door_${ doors[ _ID ][ 0 ] },${ doors[ _ID ][ 1 ] }` ] = new Door( 6, 3, doors[ _ID ][ 0 ] * 16, ( doors[ _ID ][ 1 ] * 16 ), true, true );

            if( this.getTileAt( doors[ _ID ][ 0 ], doors[ _ID ][ 1 ] + 1 )?.[0]?.blocking && this.getTileAt( doors[ _ID ][ 0 ], doors[ _ID ][ 1 ] - 1 )?.[ 0 ]?.blocking )
                this.tiles[ `door_${ doors[ _ID ][ 0 ] },${ doors[ _ID ][ 1 ] }` ] = new Door( 6, 4, doors[ _ID ][ 0 ] * 16, ( doors[ _ID ][ 1 ] * 16 ), true, true )

        }

        this.tiles[ `exit_${ exit[ 0 ] },${ exit[ 1 ] }` ] = new Exit( 9, 3, exit[ 0 ] * 16, exit[ 1 ] * 16, true );

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

}

export default Map;
