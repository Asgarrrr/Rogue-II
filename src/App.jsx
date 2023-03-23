import { useState, useEffect, lazy, Suspense } from 'react'

import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./context/auth";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";


import Login from "./routes/Login";

// Suspense is a new feature in React 16.6 that allows you to defer rendering of components until some condition is met.
// Suspense loading of the Rogue component
const Rogue = lazy( ( ) => import( "./routes/Rogue" ) );

import { io } from 'socket.io-client';

function App() {

    const [ socket, setSocket ] = useState( null );

    useEffect( ( ) => {
        const newSocket = io( `http://${window.location.hostname}:3000` );
        setSocket( newSocket );
        newSocket.on( "connect", ( ) => {
            console.log( "Connected to server" );
        } );
        return () => newSocket.close();
    }, [ setSocket ] );

    return (
        <Router>
            <AuthProvider socket={ socket }>
                <Routes>
                    <Route path="/" element={ <p> main </p> } />
                    <Route path="/rogue" element={
                        <RequireAuth>
                            <Suspense fallback={ <div>Loading...</div> }>
                                <Rogue socket={socket} />
                            </Suspense>
                        </RequireAuth> }
                    />
                    <Route path="/test" element={
                        <RequireAuth>
                            <p>Test</p>
                        </RequireAuth>
                    } />

                    <Route path="/login" element={ <Login socket={ socket } /> } />

                    <Route path="*" element={ <div>404</div> } />
                </Routes>
            </AuthProvider>
        </Router>
    );

}
export default App