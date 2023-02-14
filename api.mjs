import express from "express";

import {
    createServer
} from "http";

import {
    Server
} from "socket.io";

import chalk from "chalk";

import cors from "cors";

const app = express();
const httpServer = createServer(app);
const io = new Server( httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use( cors() );

// Check if the port is already in use
httpServer.on( "error", (error) => {

    if ( error.syscall !== "listen" )
        console.error( error );

});

export default function API() {

    const date = new Date();

    console.log(`${ date.getHours() }:${ date.getMinutes() }:${ date.getSeconds() } ${ chalk.hex( "#23b8db" )( "[back]" )} API server started`);

    io.on("connection", (socket) => {

        socket.on("saveMap", (map) => {

            console.log("Map saved");

        });

    });

}

httpServer.listen( 3000 );