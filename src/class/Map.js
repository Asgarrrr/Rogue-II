
import { Display, Engine, Scheduler, Map, RNG } from "rot-js";

export default class _Map {

    constructor(
        display, width, height, roomWidth, roomHeight, roomDugPercentage, timeLimit,
    ) {

        this._display           = display;
        this._width             = width;
        this._height            = height;
        this._roomWidth         = roomWidth;
        this._roomHeight        = roomHeight;
        this._roomDugPercentage = roomDugPercentage;
        this._timeLimit         = timeLimit;

        this._map = new Map.Uniform(
            width, height, roomWidth, roomHeight, roomDugPercentage, timeLimit,
        );

        this._map.create( ( x, y, wall ) => {
            console.log(x, y, wall);
            this._display.draw(x, y, wall ? "#" : ".");
        });

    }

    load( map ) {

        this._map = map;

    }


    export() {

        return this._map;

    }






}