import { Keyboard } from "./Keyboard";

export class Context {

    #entityIndex = -1;
    #currentTurn = 0;
    entityTurn =  0;

    camera;
    entities = { };
    map = { };
    tiles = { };
    visibleCoords = { };
    input = new Keyboard( );
    delta = 0;

    constructor( opts ) {
        this.camera = opts.camera;
    }

    addEntity( entity, coordKey ) {
    
        ++this.#entityIndex;

        if ( this.map[ coordKey ] && !this.entities[ this.#entityIndex ]) {

            this.entities[ this.#entityIndex ] = entity;
            this.map[ coordKey ].push( this.#entityIndex );
            entity.index = this.#entityIndex;

        }
    
    }

    moveEntity( ei, from, to ) {

        const indexPosition = this.map[ from ].findIndex( ( i ) => i === ei );

        if ( indexPosition !== -1 && this.entities[ ei ] ) {

            if ( this.map[ to ].length > 0 ) {
                console.warn( 
                    `Attempted to move an entity to an occupied tile: [${ ei }] ${ from } -> ${ to }`,
                    this.entities[ ei ]
                );
            }

            this.map[ from ].splice( indexPosition, 1 );
            this.map[ to ].push( ei );
        }
    }

    processEntities( systems ) {

        for ( const e of Object.values( this.entities ) )
            for ( const system of systems )
                system.act( e, this );

    }

    getEntitiesAt( where ) {

        return this.map[ where ]?.map( ( i ) => this.entities[ i ] || [ ] );

    }

    findFreeGridCell( ) {

        for ( const [ coordKey, entityIndexes ] of Object.entries( this.map ) )
            if ( entityIndexes.length === 0 )
                return coordKey;

    }

    nextTurn( ) {

        this.entityTurn = ++this.#currentTurn % Object.keys( this.entities ).length;

    }


}

