import Player from "./player";

class Minimap {

    constructor( ) {

        this.alradyRenderedWalls = {};
        this.alradyRenderedEntities = {};

    }

    createDisplay ( ) {

        // Wall layer
        this.wallLayer = document.createElement( "canvas" );
        this.wallLayer.id = "minimap-wall-layer";
        this.wallLayer.width = 150;
        this.wallLayer.height = 150;
        this.wallLayerContext = this.wallLayer.getContext( "2d" );

        document.querySelector( "#game" ).appendChild( this.wallLayer );

        // Entity layer
        this.entityLayer = document.createElement( "canvas" );
        this.entityLayer.id = "minimap-entity-layer";
        this.entityLayer.width = 150;
        this.entityLayer.height = 150;
        this.entityLayerContext = this.entityLayer.getContext( "2d" );

        document.querySelector( "#game" ).appendChild( this.entityLayer );

    };

    update( visible, structure, entities ) {

        for ( const tile in structure ) {
            const t = structure[ tile ];

            if ( !t.subTiles && t.blocking && !this.alradyRenderedWalls[ tile ] && visible[ tile ] ) {

                this.wallLayerContext.fillStyle = "grey";
                this.wallLayerContext.globalAlpha = 0.6;
                this.wallLayerContext.fillRect( ( t.x / 16 ) *3, ( t.y / 16 ) * 3, 2, 2 );
                this.wallLayerContext.globalAlpha = 1;

                this.alradyRenderedWalls[ tile ] = true;

            }

        }

        this.entityLayerContext.clearRect( 0, 0, this.entityLayer.width, this.entityLayer.height );

        // Render the entities
        for ( const entity of entities ) {
            this.entityLayerContext.fillStyle = entity instanceof Player ? "red" : "blue";
            if ( visible[ `${ entity.x / 16 },${ entity.y / 16 }` ] )
                this.entityLayerContext.fillRect( ( entity.x / 16 ) * 3, ( entity.y / 16 ) * 3, 2, 2 );
                this.alradyRenderedEntities[ `${ entity.x / 16 },${ entity.y / 16 }` ] = entity;
        }

    };

}

export default new Minimap();