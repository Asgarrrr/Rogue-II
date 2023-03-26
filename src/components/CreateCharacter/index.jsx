import { useState, useEffect } from "react";
import "./style.css";
export default function CreateCharacter({}) {

    const [ _class, setClass ] = useState( 0 );
    const classNames = [ "pugilist", "priest", "warrior" ];

    useEffect( () => {

        console.log( "class: ", _class );

        const prev_class = document.getElementById( "prev_class" )
            , next_class = document.getElementById( "next_class" );

        const prev_class_click = () => {
            setClass( _class === 0 ? 0 : _class - 1 );
        }

        const next_class_click = () => {
            setClass( _class === classNames.length - 1 ? classNames.length - 1 : _class + 1 );
        }

        prev_class.addEventListener( "click", prev_class_click );
        next_class.addEventListener( "click", next_class_click );

        return () => {
            prev_class.removeEventListener( "click", prev_class_click );
            next_class.removeEventListener( "click", next_class_click );
        }

    }, [ _class ])


    return (
        <div className="CreateCharacter">
            <div className="w-full flex justify-center items-center">
                <div id="prev_class" className="text-5xl">&lt;</div>
                <div className="character">
                    <div className="character__class">
                        <div className="character__class__name text-1xl">
                            <div className="character__class__name__text">
                                { classNames[ _class ] }
                            </div>
                        </div>
                        <div className="character__class__image">
                            <div className="character__class__image__image">
                                <img src={ `./test/${ classNames[ _class ] }.gif` } alt={ _class } />
                            </div>
                        </div>
                    </div>
                </div>
                <div id="next_class" className="text-5xl">&gt;</div>
            </div>
        </div>
    );


}