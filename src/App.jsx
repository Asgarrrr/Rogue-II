import {
    useState, useEffect
} from 'react'
import './App.css'
import "rot-js"
import Game from "./class/game";
import "./App.css"
import io from 'socket.io-client';

const socket = io();
socket.connect( 'http://localhost:5172' );

function App() {

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [lastPong, setLastPong] = useState(null);

    useEffect(() => {

        Game.init( );

        socket.on('connect', () => {
            console.log('connected');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('disconnected');
            setIsConnected(false);
        });

        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });

        socket.on('pong', () => {
            setLastPong(Date.now());
        });

        socket.on('message', (message) => {
            console.log(message);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
            socket.off('message');
        }
    }, []);

    const sendPing = () => {
        socket.emit('ping');
    }

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