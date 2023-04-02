import { useEffect, useState, createRef, useContext } from "react";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import LoginForm from "../components/Login";

import { useAuthDispatch, useAuthState } from "../context/auth";
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
        , [ token, setToken ] = useState( null )
        , [ error, setError ] = useState( null );

    const dispatch = useAuthDispatch();
    const { authenticated } = useAuthState();

    const navigate = useNavigate();

    useEffect(() => {

        if ( authenticated )
            navigate( "/rogue" );
      }, [ authenticated ]);

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

        socket.on( "login", ( { token, error } ) => {

            if ( token ) {

                localStorage.setItem( "bearer", token );
                dispatch( "LOGIN", { "1": "2" } );


            } else if ( error ) {

                setError( error );

            }

        });

    }, [ socket ]);

    return (

        <div className="w-full h-full bg-rogue text-white font-m5x7">

            <div className="w-full h-full flex flex-col justify-center items-center relative top-[-10%]" >
                <h1>Login</h1>
                <LoginForm username={ username } setUsername={ setUsername } password={ password } setPassword={ setPassword } callback={ postLogin } />
            </div>

            <ReCAPTCHA ref={ RefCaptcha } sitekey={ import.meta.env.VITE_reCAPTCHA_PUBLIC_KEY } size="invisible" />
            <div className="bonfires"></div>
        </div>
    );

}