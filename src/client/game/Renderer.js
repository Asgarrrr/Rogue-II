import {
  Assets,
  BaseTexture, 
  Spritesheet,
  Container, 
  Rectangle, 
  autoDetectRenderer as PixiRenderer, 
  SCALE_MODES, 
  Sprite, 
  AnimatedSprite,
  Texture
} from "pixi.js";

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

    const { data: atlasData } = await Assets.load( manifest );
    
    const baseTexture = new BaseTexture( atlasData.meta.image );
    baseTexture.scaleMode = SCALE_MODES.NEAREST;

    const spritesheet = new Spritesheet( baseTexture, atlasData );

    await spritesheet.parse();

    this.textureMap = spritesheet;

  }

  createFromTexture( textureKey ) {

    if( !this.textureMap )
      throw new Error( "Texture map is not loaded" );

    if ( this.textureMap.animations[ textureKey ] )
      return new AnimatedSprite( this.textureMap.animations[ textureKey ] );

    if ( this.textureMap.textures[ textureKey ] )
      return new Sprite( this.textureMap.textures[ textureKey ] );

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
