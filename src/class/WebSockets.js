
import io from "socket.io-client";

class WebSockets {

    constructor() {

        this.socket = io( "http://localhost:3000" );

        this.socket.on( "connect", () => {

            // console.log( "Connected to server" );

        });

        this.socket.on( "disconnect", () => {

            console.log( "Disconnected from server" );

        });

    }

    saveMap( map ) {

        if ( !this.socket.connected )
            return;

        this.socket.emit( "saveMap", "map" );

    }



}

export default new WebSockets();