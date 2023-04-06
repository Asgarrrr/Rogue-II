import Map from "../class/Map.js"

export default ( io, socket ) => {

    const generateMap = ( ) => {

        const map = new Map( );
        map.generate( );
        console.log( map.tiles );

    }

    socket.on( "map:generate", generateMap );

}
