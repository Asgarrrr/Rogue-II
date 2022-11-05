import {
    Renderer,
    AssetManager
} from "../lib/index";

import game from "./game";

class Entity {

    constructor( sx, sy, x, y, map ) {

        this.sx = sx;
        this.sy = sy;
        this.x = x;
        this.y = y;
        this.turn = false;
        this.map = map;
        this.direction;

        this.gridX = parseInt(x / 16);
        this.gridY = parseInt(y / 16);

        this.lastFrame = 0;
        this.frames = AssetManager.getSpriteImage("entities", this.sx, this.sy).width / 16;
        this.lastUpdate = 0;

    }

    render() {

        Renderer.render(
            AssetManager.getSpriteImage( "entities", this.sx + this.lastFrame, this.sy ),
            this.x,
            this.y,
            this.direction
        );

        if ( this.lastUpdate + 200 < Date.now() ) {

            if ( ++this.lastFrame >= this.frames )
                this.lastFrame = 0;

            this.lastUpdate = Date.now();

        }

    }

    async act() {

        game.engine.lock();
        if (this.type === "player") {
            setTimeout(() => {
                this.turn = true;
            }, 120);
        } else {
            this.turn = true;
        }
    }

    turnDone() {
        this.turn = false;
        game.engine.unlock();
    }

    update(delta) {
        const speed = 2;
        if (this.gridX * 16 > this.x) {
            this.x += speed;
        } else if (this.gridX * 16 < this.x) {
            this.x -= speed;
        } else if (this.gridY * 16 > this.y) {
            this.y += speed;
        } else if (this.gridY * 16 < this.y) {
            this.y -= speed;
        }
    }

    move(direction) {

        let result = false;
        let newGridX = this.gridX;
        let newGridY = this.gridY;

        switch (direction) {
            case "right":
                newGridX++;
                break;
            case "left":
                newGridX--;
                break;
            case "up":
                newGridY--;
                break;
            case "down":
                newGridY++;
                break;
        }

        if (
            game.map.tiles[`door_${newGridX},${newGridY}`] &&
            game.map.tiles[`door_${newGridX},${newGridY}`].blocking
        ) {
            game.map.tiles[`door_${newGridX},${newGridY}`].open();
            result = true;
        }

        if (
            game.map.tiles[`${newGridX},${newGridY}`] &&
            !game.map.tiles[`${newGridX},${newGridY}`].blocking
        ) {
            this.gridX = newGridX;
            this.gridY = newGridY;
            result = true;
        }
        return result;
    }
}

export default Entity;
