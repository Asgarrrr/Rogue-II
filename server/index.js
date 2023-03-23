import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { Server as socketServer } from "socket.io";
import mongoose from "mongoose";
import { globSync } from "glob";
import socketHandler from "./socketHandler/";
import path from "node:path";

export default async function Server( ) {

    // —— Load all models if they are not already loaded
    //  — This is a workaround for the fact that Vite does not support dynamic imports
    globSync( "./src/models/*.model.js" ).forEach( async ( file ) => {

        const modelName = path.basename( file ).split( "." )[ 0 ];
        // —— Load the model if it is not already loaded
        if ( !mongoose.models[ modelName ] )
            await import( `./src/models/${ modelName }.model.js` );

    } );

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

    httpServer.on( "error", ( error ) => {
        // —— Handle errors; ignore the error if it is a "listen" error
        //  — Probably because hot reloading is enabled
        if ( error.syscall !== "listen" )
            console.error( error );

    });

    // —— Start the server
    httpServer.listen( 3000 );

}