import { useState, useEffect } from "react";
import "./style.css";
export default function CreateCharacter({}) {

    const [ _class, setClass ] = useState( 0 )
        , classNames = [ "pugilist", "priest", "warrior" ];

    useEffect( ( ) => {

        const prev_class = document.getElementById( "prev_class" )
            , next_class = document.getElementById( "next_class" );

        const prevClass = () => setClass( _class <= 0 ? classNames.length - 1 : _class - 1 )
            , nextClass = () => setClass( _class >= classNames.length - 1 ? 0 : _class + 1 );

        prev_class.addEventListener( "click", prevClass );
        next_class.addEventListener( "click", nextClass );

        return () => {
            prev_class.removeEventListener( "click", prevClass );
            next_class.removeEventListener( "click", nextClass );
        }

    }, [ _class ])

    return (
        <div className="CreateCharacter z-10">
            <div className="w-full flex justify-center items-center relative top-[29px] left-[-4px] gap-x-4">
                <div id="prev_class"  className="text-5xl">&lt;</div>
                <div className="character">
                    <div className="character__class">
                        <div className="character__class__name">
                            {/* <div className="character__class__name__text">
                                { classNames[ _class ] }
                            </div> */}
                        </div>
                        <img src={ `./test/${ classNames[ _class ] }.gif` } className="character__class__image" alt={ _class } />
                    </div>
                </div>
                <div id="next_class" className="text-5xl">&gt;</div>
            </div>
        </div>
    );

}