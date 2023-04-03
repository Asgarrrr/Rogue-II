import MapHandler from "./MapHandler.js";
import login from "./user.js";
export default ( io, socket, db ) => {

    login( io, socket, db );
    MapHandler( io, socket, db )

}