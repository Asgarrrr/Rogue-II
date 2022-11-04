import * as ROT from "rot-js";

import {
    Renderer,
    AssetManager,
    GameLoop,
    Keyboard
} from "../lib/index";

import sprite from "../assets/Dungeon_Tileset.png";
import entities from "../assets/entities.png";
import flag from "../assets/testTrap.png";

import GameMap from "./map";
import Player from "./player";
import TestEntity from "./testentity";
import GroundTile from "./groundtile";

class Game {
    constructor() {
        this.entities = [];
        this.tiles = [];
        this.map = null;
        this.render = this.render.bind(this);
        this.update = this.update.bind(this);
        this.engine = null;
    }

    async init() {
        Renderer.createDisplay(512, 288);
        await this.loadAssets();

        GameLoop.init({
            render: this.render,
            update: this.update
        });

        this.map = new GameMap();
        const player = new Player();
        const tile = Object.values(this.map.tiles)[0];
        player.x = tile.x;
        player.gridX = parseInt(tile.x / 16);
        player.y = tile.y;
        player.gridY = parseInt(tile.y / 16);
        this.entities.push(player);
        ///
        for (let i = 0; i < 5; i++) {
            const tile2 = Object.values(this.map.tiles)[1 + i];
            const testEntity = new TestEntity(21, 0);
            testEntity.x = tile2.x;
            testEntity.gridX = parseInt(tile2.x / 16, 10);
            testEntity.y = tile2.y;
            testEntity.gridY = parseInt(tile2.y / 16, 10);
            this.entities.push(testEntity);
        }
        ///

        const scheduler = new ROT.Scheduler.Simple();
        for (const entity of this.entities) {
            scheduler.add(entity, true);
        }
        this.engine = new ROT.Engine(scheduler);
        this.engine.start();

        GameLoop.start();
    }

    async loadAssets() {
        await AssetManager.loadImage("sprites", sprite);
        await AssetManager.loadImage("entities", entities );
        await AssetManager.loadImage("flag", flag );

    }

    update(delta) {
        this.entities.forEach(entity => entity.update(delta));
    }

    render() {
        Object.values(this.map.tiles).forEach(tile => tile.render());
        this.entities.forEach(entity => entity.render());
    }
}

export default new Game();