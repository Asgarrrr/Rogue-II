import dotenv from "dotenv";
dotenv.config({ path: "../.env" })


import { createServer } from "http";
import { Server as socketServer } from "socket.io";
import mongoose from "mongoose";
import { globSync } from "glob";
import socketHandler from "./socketHandler/index.js";
import path from "node:path";

import( `../src/models/character.model.js` );
import( `../src/models/session.model.js` );
import( `../src/models/user.model.js` );

( async ( ) => {

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

        console.log( "— —— — connection ———————————————————————————————————————" )

        socket.on( "disconnect", ( ) => {
            console.log( "— —— — disconnect ———————————————————————————————————————" )
        });

        socket.on( "character:create", async ( { token, hero } ) => {

            // —— Check if token is valid, and hero is an object

            if ( !token )
                return socket.emit( "character:create", { error: "Token is missing" } );

            if ( !hero && typeof hero !== "object" )
                return socket.emit( "character:create", { error: "Hero is missing" } );

            try {

                // —— Load the user from the database
                const Session   = mongoose.model( "session" )
                    , User      = mongoose.model( "user" );

                // —— Find the session > the user
                const { user: userSession } = await Session.findOne( { token } );

                if ( !userSession )
                    return socket.emit( "character:create", { error: "Session not found" } );

                const user = await User.findOne( { _id: userSession } );

                if ( !user )
                    return socket.emit( "character:create", { error: "User not found" } );

                // —— Validate the hero;
                //  — Every stat must be a number, and the total cannot be higher than 15
                const { name, _class, str, vit, def, dex } = hero;

                if ( !name || typeof name !== "string" )
                    return socket.emit( "character:create", { error: "Name is missing" } );

                // —— Remove all non-alphanumeric characters
                const nameRegex = /[^a-zA-Z0-9]/g;
                if ( nameRegex.test( name ) )
                    return socket.emit( "character:create", { error: "Name contains invalid characters" } );

                if (   !str || typeof str !== "number"
                    || !vit || typeof vit !== "number"
                    || !def || typeof def !== "number"
                    || !dex || typeof dex !== "number" )
                    return socket.emit( "character:create", { error: "Stats are missing" } );

                if ( str + vit + def + dex > 20 )
                    return socket.emit( "character:create", { error: "Stats are too high" } );

                // —— Create the character
                const Character = mongoose.model( "character" );

                const character = await new Character( {
                    name,
                    user: user._id,
                    class: _class,
                    strength: str,
                    vitality: vit,
                    defense: def,
                    dexterity: dex,
                } ).save( );

                socket.emit( "character:create", { character } );

            } catch ( err ) {

                console.error( err );
                socket.emit( "character:create", { error: "Something went wrong" } );

            }

            console.log( "character:create",
                token,
                hero
            );

        } );


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