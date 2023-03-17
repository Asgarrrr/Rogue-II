import Map from "../class/Map"

export default ( io, socket ) => {

    const generateMap = ( ) => {

        const map = new Map( );
        map.generate( );
        console.log( map.tiles );
        console.log( "ask for map generation" )

    }

    socket.on( "map:generate", generateMap );

}
