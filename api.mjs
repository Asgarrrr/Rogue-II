
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(cors());

export default function api() {

    console.log( "API server started" );

    io.on("connection", (socket) => {

        socket.on("saveMap", (map) => {

            console.log("Map saved");

        });

    });

    httpServer.listen(3000);

}