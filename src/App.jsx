import {
    useState, useEffect
} from 'react'
import './App.css'
import "rot-js"
import Game from "./class/game";
import "./App.css"


function App() {

    useEffect(() => {
        Game.init();
    }, []);

    return (
        <>
            <div id="app">
                <div id="game"></div>
            </div>
            <div id="stats"></div>
        </>

    )

}

export default App