import { useEffect, useState, createRef } from "react";
import { Link, Navigate } from "react-router-dom";

import ReCAPTCHA from "react-google-recaptcha";

/**
 * @description Login page component
 * @param       {Object} props          - Component props
 * @param       {Object} props.socket   - Socket.io client instance
 * @returns     {JSX.Element}           - Login page component
 */

export default function Login({ socket }) {

    const [ username, setUsername ] = useState( "test" )
        , [ password, setPassword ] = useState( "23W9J423W9J4" )
        , [ error, setError ] = useState( null );

    const RefCaptcha = createRef();

    const postLogin = async () => {

        await RefCaptcha.current.executeAsync();

        socket.emit( "login", {
            challenge: RefCaptcha.current.getValue(),
            username,
            password
        });

        RefCaptcha.current.reset();

    };

    useEffect(() => {

        socket?.on("login", (data) => {
            if (data?.error)
                setError(data.error);

            if (data?.token) {
                localStorage.setItem("bearer", data.token);
                <Navigate to="/demo" />
                console.log(
                    localStorage.getItem("bearer")
                )
            }
        });

        if ( !socket?.connected )
            return;



        return () => socket.close();

    }, [ socket ]);

    return (

        <div className="testbg">

            <ReCAPTCHA
                ref={ RefCaptcha }
                sitekey={ import.meta.env.VITE_reCAPTCHA_PUBLIC_KEY }
                size="invisible"
            />

            <h1>Login</h1>
            <div>
                <label>Username</label>
                <input type="text" value={username} onChange={e => {
                    setUsername(e.target.value);
                }} />
            </div>
            <div>
                <label>Password</label>
                <input type="password" value={password} onChange={e => {
                    setPassword(e.target.value);
                }} />
            </div>
            <div>
                <button onClick={postLogin}>Login</button>
            </div>
            {error && <p>{error}</p>}
            <Link to="/signup">Don't have an account?</Link>
        </div>
    );

}