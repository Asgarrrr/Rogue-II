import React, { useEffect, useRef, useState } from "react";
import { Display, Engine, Scheduler, Map, RNG } from "rot-js";

import _Map  from "../class/Map.js";

class Game extends React.Component {

    constructor(props) {

        super(props)


    }

    componentDidMount() {


        const display = new Display({
            width: 80,
            height: 24
        })
        const test = new _Map(display, 80, 40 );
        const container = document.getElementById("game")
        container.appendChild(display.getContainer())
        const scheduler = new Scheduler.Simple()
        const engine = new Engine(scheduler)
        engine.start()

        //RNG.setSeed(3);
        var map = test.export();

        // var drawDoor = function (x, y) {
        //     display.draw(x, y, "", "", "red");
        // }

        // var rooms = map.getRooms();
        // for (var i = 0; i < rooms.length; i++) {
        //     var room = rooms[i];
        //     room.getDoors(drawDoor);
        // }

    }

    componentWillUnmount() {

    }


    render() {
        return (
            <div id="game"></div>
        )
    }





}

export default Game

// const Game = ( props ) => {

//     // Create a canvas element to draw the game on
//     const canvasRef = useRef( null );
//     const [ display, setDisplay ] = useState( null );
//     const [ engine, setEngine ] = useState( null );

//     // Create a new ROT display
//     useEffect( () => {
//         const canvas = canvasRef.current;
//         const display = new Display( { width: 80, height: 24, fontSize: 18, fontFamily: "monospace", forceSquareRatio: true } );
//         canvas.appendChild( display.getContainer() );
//         setDisplay( display );
//     }, [ setDisplay ] );

//     // Create a new ROT engine
//     useEffect(() => {

//         setInterval( () => {
//             console.log( "tick" );
//             console.log( display );
//         }, 1000 );

//         // console.log(display )

//         // var scheduler = new Scheduler.Simple();
//         // var engine = new Engine( scheduler );
//         // engine.start();
//         // setEngine( engine );



//         // display.draw(8, 8, "You logged the rocket!", "violet");

//     }, [ display, setEngine ] );

//     return (
//         <div>
//             <canvas ref={ canvasRef } width={ 800 } height={ 600 } />
//         </div>
//     );


// }

// export default Game;