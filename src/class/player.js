import {
    Keyboard,
    Renderer
} from "../lib/index";

import Entity from "./entity";

class Player extends Entity {
    constructor() {
        super(0, 9, 16, 0);
        this.direction = null;
        this.type = "player";
    }

    update() {
        if (this.turn) {
            let direction = null;
            if (Keyboard.pressed("ArrowRight")) {
                direction = "right";
            } else if (Keyboard.pressed("ArrowLeft")) {
                direction = "left";
            }
            if (Keyboard.pressed("ArrowDown")) {
                direction = "down";
            } else if (Keyboard.pressed("ArrowUp")) {
                direction = "up";
            }

            if (Keyboard.pressed(" ")) {
                this.turnDone();
                return;
            }

            if (direction) {
                if (this.move(direction)) {
                    this.turnDone();
                }
            }
        }
        super.update();

        Renderer.camera.x = this.x;
        Renderer.camera.y = this.y;
    }
}

export default Player;
