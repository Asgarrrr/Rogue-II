

import { createServer } from "http";
import { Server } from "socket.io";

import handler from "./handlers/index";

export default function backend( ) {

    const httpServer = createServer();

    httpServer.on( "error", ( error ) => {

        if ( error.syscall !== "listen" )
            console.error( error );

    });

    const io = new Server( httpServer, {
        cors: { origin: "*", methods: [ "GET", "POST" ], },
    } );

    io.on( "connection", ( socket ) => {

        console.log( "— —— — new client ———————————————————————————————————————" )
        handler( io, socket );


    });


    httpServer.listen( 3000 );

}
