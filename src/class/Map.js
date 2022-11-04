import * as ROT from "rot-js";
import Tile from "./tile";
import Trap from "./trap";

class Map {
    tiles = {};

    constructor() {
        var digger = new ROT.Map.Digger(20, 20);

        let width = 0;
        let height = 0;

        digger.create( ( x, y, wall ) => {

            if ( wall )
                return;

            width   = Math.max( width, x );
            height  = Math.max( height, y );

            this.tiles[ `${x},${y}` ] = new Tile( 9, 0, x * 16, y * 16 );

        });
        console.log(this.tiles);

        for (let x = 0; x <= width + 1; x++) {
            for (let y = 0; y <= height + 1; y++) {
                const id = `${x},${y}`;
                if (!this.tiles[id]) {
                    // right
                    let placeTile = false;

                    if (
                        this.tiles[`${x + 1},${y}`] &&
                        !this.tiles[`${x + 1},${y}`].blocking
                    ) {
                        this.tiles[id] = new Tile(0, 0, x * 16, y * 16, true);
                    }
                    // left
                    if (
                        this.tiles[`${x - 1},${y}`] &&
                        !this.tiles[`${x - 1},${y}`].blocking
                    ) {
                        this.tiles[id] = new Tile(5, 0, x * 16, y * 16, true);
                    }
                    // down
                    if (
                        this.tiles[`${x},${y + 1}`] &&
                        !this.tiles[`${x},${y + 1}`].blocking
                    ) {
                        this.tiles[id] = new Tile(1, 0, x * 16, y * 16, true);
                    }
                    // up
                    if (
                        this.tiles[`${x},${y - 1}`] &&
                        !this.tiles[`${x},${y - 1}`].blocking
                    ) {
                        this.tiles[id] = new Tile(1, 4, x * 16, y * 16, true);
                    }

                    if (placeTile) {
                        // this.tiles[id] = new Tile(1, 0, x * 16, y * 16, true);
                    }
                }
            }
        }

        this.tiles["0,1"] = new Trap(0, 0, 0, 0);
        this.tiles["0,1"] = new Trap(0, 0, 0, 0);
    }

    getTileAt(x, y) {
        return this.tiles[`${x},${y}`];
    }
}

export default Map;
