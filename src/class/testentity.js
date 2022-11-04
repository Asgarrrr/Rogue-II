import {
    Keyboard,
    Renderer
} from "../lib/index";

import Entity from "./entity";

class TestEntity extends Entity {
    constructor(x, y) {
        super(0, 0, x, y);
    }

    update() {

        if ( this.turn ) {
            let direction = [ "right", "left", "up", "down" ][
                ~~( Math.random() * 4 )
            ];
            this.move(direction);
            this.turnDone();
        }
        super.update();
    }
}

export default TestEntity;
