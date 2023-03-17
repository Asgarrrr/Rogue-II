import { io } from "socket.io-client";

export default class WSManager {

    constructor( context ) {

        this.test = 12

        this.socket = io( "http://localhost:3000" );

        this.socket.on( "connect", this._onConnect );
        this.socket.on( "disconnect", this._onDisconnect );
        this.socket.on( "message", this._onMessage );

    }

    _onConnect( message ) {

        console.log( "Connnecion with server: OK" )

        this.emit( "map:generate" )

    }

    _onDisconnect( message ) {

    }

    _onMessage( message ) {

    }

}