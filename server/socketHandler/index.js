import MapHandler from "./MapHandler";
import login from "./login";
export default ( io, socket, db ) => {

    login( io, socket, db );
    MapHandler( io, socket, db )

}