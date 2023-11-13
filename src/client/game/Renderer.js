import {BaseTexture, Container, Rectangle, Renderer as PixiRenderer, SCALE_MODES, Sprite, Texture,} from "pixi.js";

export class Renderer {

  rootContainer   = new Container();
  tileContainer   = new Container();
  entityContainer = new Container();
  
  textureMap = {};

  constructor( pixiRendererOptions ) {

    this._renderer = new PixiRenderer( pixiRendererOptions );
    this.rootContainer.addChild( this.tileContainer );
    this.rootContainer.addChild( this.entityContainer );

  }

  async loadAssetsFromManifest( manifest ) {

    // const t = await Assets.load( manifest );

    // for ( const texture of Object.een( t._frames ) ) {
    //   console.log( texture )
    // }


    
    for ( const [ filePath, metaList ] of Object.entries( manifest )) {
      
      const baseTexture = BaseTexture.from( filePath );
      baseTexture.scaleMode = SCALE_MODES.NEAREST
        
      for ( const meta of metaList ) {

        const { key, x, y, w, h } = meta;

        this.textureMap[ key ] = new Texture(
            baseTexture,
            new Rectangle( x, y, w, h )
        );

      }
    }



  }

  createFromTexture( textureKey ) {

    if ( this.textureMap[ textureKey ] )
      return new Sprite( this.textureMap[ textureKey ] );

  }

  render() {
    this._renderer.render( this.rootContainer );
  }


  addToScene(sprite, layer) {
    switch (layer) {
      case "Tile": {
        this.tileContainer.addChild(sprite);
        break;
      }
      case "Entity": {
        this.entityContainer.addChild(sprite);
      }
    }
  }
  removeFromScene(sprite, layer ) {
    switch (layer) {
      case Layer.TILE: {
        this.tileContainer.removeChild(sprite);
        break;
      }
      case Layer.ENTITY: {
        this.entityContainer.removeChild(sprite);
      }
    }
  }
  clearScene() {
    this.tileContainer.removeChildren();
    this.entityContainer.removeChildren();
  }
  getView() {
    return this._renderer.view;
  }
}
