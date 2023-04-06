import Map from "../class/-Map.js"
import MapModel from "../../src/models/map.model.js";
import CharacterModel from "../../src/models/character.model.js";
import UserModel from "../../src/models/user.model.js";
import SessionModel from "../../src/models/session.model.js";
import EntityModel from "../../src/models/entity.model.js";

export default ( io, socket ) => {

    const generateMap = ( ) => {

        const map = new Map( );
        map.generate( );
        console.log( map.tiles );

    }

    const test = async ( { token, champID } ) => {

        try {

            if ( !token || !champID )
                return;

            // —— Load the user from the database
            const session = await SessionModel.findOne( { token } );

            if ( !session )
                socket.emit( "map:askForMap", { error: "Session not found" } );

            const user = await UserModel.findOne( { _id: session.user } );

            if ( !user )
                socket.emit( "map:askForMap", { error: "User not found" } );

            const hero = await CharacterModel.findOne({
                _id: champID,
                user: user._id
            } );

            if ( !hero )
                socket.emit( "map:askForMap", { error: "Hero not found" } );

            const { currentMap } = hero;

            if ( currentMap ) {
                console.log( "Current map" )

                const cacheMap = await MapModel.findOne( { _id: currentMap } )

                if( cacheMap ) {

                    // —— Load all entities from the map
                    const entities = await EntityModel.find( { currentMap: cacheMap._id } );

                    socket.emit( "map:askForMap", {
                        width   : cacheMap.width,
                        height  : cacheMap.height,
                        tiles   : cacheMap.tiles,
                        data    : cacheMap.data,
                        doors   : cacheMap.doors,
                        rooms   : cacheMap.rooms,
                        _id     : cacheMap._id,
                    } );
                    return;
                }

            } else console.log( "No current map" )

            const _map = new Map( );
            const _generatedMap = await _map.generate( 30, 30 );

            await CharacterModel.updateOne( { _id: hero._id }, { currentMap: _generatedMap._id } );

            // Coefficient of entities per room ( with difficulty modifier )
            const entityPerRoom = 1
                , difficulty = 1;

            // —— Generate x entities based on the map size ( 1/2 entity per room )
            const entities = [ ];

            for ( let i = 0; i < _generatedMap.rooms.length; i++ ) {
                for ( let j = 0; j < entityPerRoom; j++ ) {

                    entities.push( new EntityModel({
                        // —— Map stuff
                        currentMap: _generatedMap._id,
                        position: {
                            x: Math.floor( Math.random() * ( _generatedMap.rooms[ i ].x2 - _generatedMap.rooms[ i ].x1 ) + _generatedMap.rooms[ i ].x1 ),
                            y: Math.floor( Math.random() * ( _generatedMap.rooms[ i ].y2 - _generatedMap.rooms[ i ].y1 ) + _generatedMap.rooms[ i ].y1 ),
                        },
                        // —— Entity stuff
                        strength : 3,
                        vitality : 3,
                        defense  : 3,
                        dexterity: 3,
                        health: {
                            current : 5,
                            max     : 5
                        },
                        // —— Sprite stuff
                        sx: 0,
                        sy: [ 0, 2, 4, 6 ][ ~~( Math.random() * 4 ) ]
                    }) );

                }
            }

            // —— Save the entities
            await EntityModel.insertMany( entities );

            // Delete the map from the database
            // await MapModel.deleteMany( { _id: _generatedMap._id } );

            socket.emit( "map:askForMap", {
                width   : _generatedMap.width,
                height  : _generatedMap.height,
                tiles   : _generatedMap.tiles,
                data    : _generatedMap.data,
                doors   : _generatedMap.doors,
                rooms   : _generatedMap.rooms,
                entities: entities,
                _id     : _generatedMap._id,
            } );

        } catch ( error ) {

            console.log( error );

        }


    }

    socket.on( "map:generate", generateMap );
    socket.on( "map:askForMap", test );

}
