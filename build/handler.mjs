import { createServer } from "http";
import { Server } from "socket.io";
const httpServer = createServer();
const io = new Server(httpServer, {});
const handler = (req, res, next) => {
  if (req.path === "/hello")
    return res.end("hello");
  io.on("connection", (socket) => {
    console.log("a user connected");
  });
  next();
};
export {
  handler
};
