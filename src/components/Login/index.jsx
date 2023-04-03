import { useEffect } from "react";
import "./style.css";

export default function Login({ username, setUsername, password, setPassword, callback, error }) {

    useEffect( ( ) => {

        const t = document.getElementById( "t" );

        const d = ( ) => t.innerHTML = "——— / Enter \\ ———";
        const j = ( ) => t.innerHTML = "——— | Enter | ———";

        t.addEventListener( "mouseover", d );
        t.addEventListener( "mouseout", j );

        return ( ) => {
            t.removeEventListener( "mouseover", d );
            t.removeEventListener( "mouseout", j );
        }

    }, [ ]);

    return (
        <div className="login z-[1]">

            <div className="relative left-[-1px]">
                <form>

                    <input type="text" maxLength="40" value={ username } onChange={ ( e ) => setUsername( e.target.value ) } placeholder="username" />

                    <input type="text" maxLength="40" value={ password.split( "" ).map( ( x ) => "*" ).join( "" ) } onChange={ ( e ) => setPassword( e.target.value ) } placeholder="password" />

                    <button type="button" id="t" className="text-3xl mt-4 mb-3 hover:text-rogue w-[110%] relative left-[-5%]" onClick={ callback }>——— | Enter | ———</button>

                    <p className="text-red-500 text-center">{ error }</p>

                </form>
            </div>

        </div>
    );

}