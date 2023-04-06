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

    attack( targetType, targetID, damage ) {

        this.socket.emit( "entity:attack", {
            token: this.token( ), targetType, targetID, damage,
        } );

    }

    die( targetType, targetID ) {

        this.socket.emit( "entity:die", {
            token: this.token( ), targetType, targetID,
        } );

    }

    playerReward( targetID, XP ) {

        this.socket.emit( "player:reward", {
            token: this.token( ),
            targetID,
            XP,
        } );

    };

    nextLevel( targetID ) {

        this.socket.emit( "player:nextLevel", {
            token: this.token( ),
            targetID,
        } );

    }

    test( mapID ) {

        this.socket.emit( "map:delete", {
            token: this.token( ),
            mapID,
        } );

    }

    askForMap( champID ) {

        this.socket.emit( "map:askForMap", {
            token: this.token( ),
            champID,
        } );


    }

}

export default new WSManager( );