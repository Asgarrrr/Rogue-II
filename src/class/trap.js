
import { Renderer, AssetManager } from "../lib/index";
import Tile from "./tile";

export default class Trap extends Tile {

    constructor( sx, sy, x, y, blocking = false ) {

        super( sx, sy, x, y, blocking );

        this.frames = AssetManager.getSpriteImage( "flag", this.sx, this.sy ).width / 16;
        this.lastFrame  = 0;
        this.lastUpdate = 0;

    }

    render() {

        Renderer.render(
            AssetManager.getSpriteImage( "flag", this.lastFrame, this.sy ),
            this.x,
            this.y
        );

        const dn = Date.now();

        if ( this.lastUpdate + 200 < dn ) {

            if ( ++this.lastFrame >= this.frames )
                this.lastFrame = 0;

            this.lastUpdate = dn;

        }

    }

    update( delta ) { }

}