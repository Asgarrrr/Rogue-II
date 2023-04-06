import dotenv from "dotenv";
dotenv.config( );

import mongoose from "mongoose";

import SessionModel from "../src/models/session.model.js";
import UserModel from "../src/models/user.model.js";
import CharacterModel from "../src/models/character.model.js";
import MapModel from "../src/models/map.model.js";
import EntityModel from "../src/models/entity.model.js";

import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import socketHandler from "./socketHandler/index.js";

( async ( ) => {

    // —— Connect to the database
    await mongoose.connect( process.env.MONGO_URI );

    // —— Create the server and socket.io instance, and listen for connections
    const httpServer = createServer();
    const io = new SocketServer( httpServer, {
        cors: { origin: "*", methods: [ "GET", "POST" ], },
    } );

    io.on( "connection", ( socket ) => {

        socket.onAny( ( event, { token } ) => {
            // TODO: Check if the token is valid
        })

        socket.on( "disconnect", ( ) => {
            console.log( "disconnect" );
        } );

        socket.on( "entity:move", async ( { token, ID, x, y } ) => {

            await EntityModel.findOneAndUpdate({
                _id: ID,
            }, {
                position: { x, y },
            });

        });

        socket.on( "player:move", async ( { token, ID, x, y } ) => {

            await CharacterModel.findOneAndUpdate({
                _id: ID,
            }, {
                position: { x, y },
            });

        } );

        // socket.on( "tile:update", async ( { token, mapID, x, y, sx, sy, block, subTiles, alreadyRendered } ) => {
        //
        //     // console.log( "tile:update" )
        //     const _map = await MapModel.updateOne({
        //         _id: mapID,
        //     }, {
        //         $set: {
        //             [`tiles.${ x/16 },${ y/16 }.5`] : false,
        //         }
        //     });
        //
        //     console.log( `tiles.${ x/16 },${ y/16 }` )
        //
        // } );

        socketHandler( io, socket, mongoose );

    });

    httpServer.on( "listening", ( ) => {
        console.log( "— —— — server started ———————————————————————————————————————" )
    } );

    // —— Start the server
    httpServer.listen( process.env.PORT || 3000 );


})();