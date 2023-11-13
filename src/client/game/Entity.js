export class Entity {

    components      = [];
    index           = 0;
    turn            = false;

    constructor( context, components = [] ) {

        this.context        = context;
        this.components     = components || [];
        this.componentFlags = 0;

        for ( const component of this.components )
            this.componentFlags |= 1 << component.type;

    }

    addComponent( component ) {

        if ( !Array.isArray( component ) )
            component = [ component ];

        for ( const c of component ) {

            this.components.push( c );
            this.componentFlags |= 1 << c.type;

        }

    }

    removeComponent( type ) {

        const index = this.components.findIndex( ( c ) => c.type === type );

        if ( index !== -1 ) {

            this.components.splice( index, 1 );
            this.componentFlags &= ~( 1 << type );

        }

    }

    has( typeFlags ) {

        return ( this.componentFlags & typeFlags ) === typeFlags;

    }

    get( type ) {

        return this.components.find( ( c ) => c.type === type );

    }

    endTurn( ) {

        this.context.nextTurn( );

    }

}