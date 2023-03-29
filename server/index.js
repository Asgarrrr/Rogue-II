import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { Server as socketServer } from "socket.io";
import mongoose from "mongoose";
import { globSync } from "glob";
import socketHandler from "./socketHandler/index.js";
import path from "node:path";

( async ( ) => {

    // —— Load all mongoose models
    globSync( "./src/models/*.model.js" ).forEach( ( file ) => import( path.resolve( file ) ) );

    // —— Connect to the database
    await mongoose.connect( process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } );

    // —— Create the server and socket.io instance, and listen for connections
    const httpServer = createServer();
    const io = new socketServer( httpServer, {
        cors: { origin: "*", methods: [ "GET", "POST" ], },
    } );

    // —— Handle connections
    io.on( "connection", ( socket ) => {

        socket.on( "disconnect", ( ) => {
            console.log( "— —— — disconnect ———————————————————————————————————————" )
        });


        socket.on( "user:load", async ({ token }) => {

            console.log( "— —— — user:load ———————————————————————————————————————" )

            // —— Load the user from the database
            //  — This is a workaround for the fact that Vite does not support dynamic imports
            const User = mongoose.model( "user" );
            const Session = mongoose.model( "session" );

            // —— Find the session > the user
            const session = await Session.findOne( { token } )

            if ( !session )
                return socket.emit( "user:load", { error: "Session not found" } );

            const user = await User.findById( session.user );

            if ( !user )
                return socket.emit( "user:load", { error: "User not found" } );

            // Check if the user has characters
            const Character = mongoose.model( "character" );

            const chars = await Character.find( { user: user._id } );

            socket.emit( "user:load", { user, chars } );


        });


        console.log( "— —— — new client ———————————————————————————————————————" )
        socketHandler( io, socket, mongoose );

    });

    httpServer.on( "listening", ( ) => {
        console.log( "— —— — server started ———————————————————————————————————————" )
    } );

    httpServer.on( "request", ( req, res ) => {
        if ( req.url === "/" ) {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.write( ":]" );
            res.end();
        }
    });

    // —— Start the server
    httpServer.listen( process.env.PORT || 3000 );

} )( );