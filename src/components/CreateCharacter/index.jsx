import { useState, useEffect } from "react";
import "./style.css";
export default function CreateCharacter({}) {

    const [ _class, setClass ] = useState( 0 );
    const classNames = [ "pugilist", "priest", "warrior" ];

    // pugilist > priest > warrior

    useEffect( () => {

        const prev_class = document.getElementById( "prev_class" );
        const next_class = document.getElementById( "next_class" );

        const setPrevClass = () => {
            setClass( _class === 0 ? classNames.length - 1 : _class - 1 );
        }

        const setNextClass = () => {
            setClass( _class === classNames.length - 1 ? 0 : _class + 1 );
        }

        prev_class.addEventListener( "click", () => setPrevClass() );

        next_class.addEventListener( "click", () => setNextClass() );

        console.log( classNames[ _class ])

        return () => {
            prev_class.removeEventListener( "click", () => setPrevClass() );
            next_class.removeEventListener( "click", () => setNextClass() );
        }

    }, [ _class ])


    return (
        <div className="CreateCharacter">
            <div className="w-full flex justify-center items-center">
                {/* Left arrow */}
                <div id="prev_class">&lt;</div>
                {/* Character */}
                <div className="character">
                    <div className="character__class">
                        <div className="character__class__name">
                            <div className="character__class__name__text">
                                { _class }
                            </div>
                        </div>
                        <div className="character__class__image">
                            <div className="character__class__image__image">
                                <img src={ `./test/${ _class }.gif` } alt={ _class } />
                            </div>
                        </div>
                    </div>
                </div>
                <div id="next_class">&gt;</div>
            </div>
        </div>
    );


}