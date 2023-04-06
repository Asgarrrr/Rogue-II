class WSManager {

    socket = null;
    token = ( ) => localStorage.getItem( "bearer" );

    init( socket ) {

        console.log( "ok ")

        this.socket = socket;


    }

    ping( ) {

        this.socket.emit( "ping", { } );
        this.socket.on( "pong", ( ) => {
            console.log( "pong" );

        });

    }

    entityMove( ID, x, y ) {

        this.socket.emit( "entity:move", {
            token: this.token( ), ID, x, y,
        } );

    }

    playerMove( ID, x, y ) {

        this.socket.emit( "player:move", {
            token: this.token( ), ID, x, y,
        } );

    }

    tileUpdate( mapID, x, y, sx, sy, block, subTiles, alreadyRendered ) {

        this.socket.emit( "tile:update", {
            token: this.token( ), mapID, x, y, sx, sy, block, subTiles, alreadyRendered,
        } );

    }

}

export default new WSManager( );