import { useState, useEffect } from "react";
import "./style.css";
export default function CreateCharacter({ socket }) {

    const classNames = [ "pugilist", "priest", "warrior" ];

    const [ classStr, setClassStr ] = useState( 0 )
        , [ classVit, setClassVit ] = useState( 0 )
        , [ classDef, setClassDef ] = useState( 0 )
        , [ classDex, setClassDex ] = useState( 0 )

        , [ str, setStr ]           = useState( 0 )
        , [ vit, setVit ]           = useState( 0 )
        , [ def, setDef ]           = useState( 0 )
        , [ dex, setDex ]           = useState( 0 )

        , [ points, setPoints ]     = useState( 10 )

        , [ name, setName ]         = useState( generateName( ) )
        , [ _class, setClass ]      = useState( 0 );

    // —— Handle class change
    useEffect( ( ) => {

        const prev_class = document.getElementById( "prev_class" )
            , next_class = document.getElementById( "next_class" );

        const prevClass = () => setClass( _class <= 0 ? classNames.length - 1 : _class - 1 )
            , nextClass = () => setClass( _class >= classNames.length - 1 ? 0 : _class + 1 );

        switch ( _class ) {
            case 0:
                setClassStr( 2 );
                setClassVit( 2 );
                setClassDef( 1 );
                setClassDex( 1 );
                break;

            case 1:
                setClassDef( 3 );
                setClassVit( 1 );
                break;

            case 2:
                setClassStr( 3 );
                setClassVit( 1 );
                break;

        }

        prev_class.addEventListener( "click", prevClass );
        next_class.addEventListener( "click", nextClass );

        return () => {
            prev_class.removeEventListener( "click", prevClass );
            next_class.removeEventListener( "click", nextClass );
        }

    }, [ _class ] );

    const saveHero = ( ) => {

        socket.emit( "character:create", {
            hero : {
                name,
                _class,
                str: str + classStr,
                vit: vit + classVit,
                def: def + classDef,
                dex: dex + classDex
            },
            token: localStorage.getItem( "bearer" )
        });

    }

    return (
        <div className="CreateCharacter z-10">

            <div className="w-[256px] relative left-[28px]">

                <input type="text" className="character__name" maxLength="12" value={ name } onChange={ ( e ) => setName( e.target.value ) } />

                <div className="flex justify-center items-center gap-x-4 mt-[20px]">

                    <div id="prev_class"  className="text-5xl">&lt;</div>
                    <div className="character">
                        <div className="character__class">
                            <img src={ `./test/${ classNames[ _class ] }.gif` } className="character__class__image" alt={ _class } />
                        </div>
                    </div>
                    <div id="next_class" className="text-5xl">&gt;</div>

                </div>
                <p className="text-center w-full mt-1 text-2xl">{ classNames[ _class ] }</p>

                <div className="character__stats">
                    <div>
                        <span>{ str + classStr }</span>
                        <span className="stat">
                            <span className="stat__up" onClick={ ( ) => { if ( points > 0 ) { setStr( str + 1 ); setPoints( points - 1 ); }}}>&lt;</span>
                            <small>STR</small>
                            <span className="stat__down" onClick={ ( ) => { if ( str > 0 ) { setStr( str - 1 ); setPoints( points + 1 ); }}}>&gt;</span>
                        </span>
                    </div>
                    <div>
                        <span>{ vit + classVit }</span>
                        <span className="stat">
                            <span className="stat__up" onClick={ ( ) => { if ( points > 0 ) { setVit( vit + 1 ); setPoints( points - 1 ); }}}>&lt;</span>
                            <small>VIT</small>
                            <span className="stat__down" onClick={ ( ) => { if ( vit > 0 ) { setVit( vit - 1 ); setPoints( points + 1 ); }}}>&gt;</span>
                        </span>
                    </div>
                    <div>
                        <span>{ def + classDef }</span>
                        <span className="stat">
                            <span className="stat__up" onClick={ ( ) => { if ( points > 0 ) { setDef( def + 1 ); setPoints( points - 1 ); }}}>&lt;</span>
                            <small>DEF</small>
                            <span className="stat__down" onClick={ ( ) => { if ( def > 0 ) { setDef( def - 1 ); setPoints( points + 1 ); }}}>&gt;</span>
                        </span>
                    </div>
                    <div>
                        <span>{ dex + classDex }</span>
                        <span className="stat">
                            <span className="stat__up" onClick={ ( ) => { if ( points > 0 ) { setDex( dex + 1 ); setPoints( points - 1 ); }}}>&lt;</span>
                            <small>DEX</small>
                            <span className="stat__down" onClick={ ( ) => { if ( dex > 0 ) { setDex( dex - 1 ); setPoints( points + 1 ); }}}>&gt;</span>
                        </span>
                    </div>
                </div>

                <div className="absolute top-[310px] px-5 text-rogue text-[17px] leading-[22px]">
                    <p>Points left: { points }</p>

                    { _class === 0 && <p>As a Pugilist, you are a master of unarmed combat. You have a high constitution and defense. You have a high chance of landing a critical hit with your fists, but you cannot use any weapons.</p> }
                    { _class === 1 && <p>The priest, not used to violent fights, has the ability to regenerate his life points over time, every X boxes, he will regain a small part of his lost HP.</p> }
                    { _class === 2 && <p>As a warrior, you are a master of weapons. You have a high strength. You also have some chance of landing a critical hit with your weapons</p> }

                </div>

            </div>

            <div className="absolute right-0 mb-5 mr-10 text-right">
                <button className={ name.length > 0 && points === 0 ? "text-4xl text-white-500" : " text-4xl text-gray-500" } disabled={ name.length > 0 && points === 0 ? false : true } onClick={ ( ) => { saveHero( socket ) } }>Enter the dungeon &gt;</button>
                <div className="text-red-500">
                    { name.length === 0 && <p>Please enter a name </p> }
                    { points > 0 && <p>Please distribute all your points</p> }
                </div>

            </div>

        </div>
    );

}

const syllablesStart    = [ "Al", "Be", "Car", "Da", "El", "Fa", "Gar", "Har", "Ig", "Ju", "Kil", "Lor", "Mal", "Nor", "Og", "Pra", "Qu", "Ral", "Sa", "Tal", "Ur", "Val", "Wen", "Xan", "Yar", "Zal" ]
    , syllablesMiddle   = [ "an", "bar", "cor", "den", "el", "far", "gar", "hal", "is", "jar", "ken", "lan", "mor", "nar", "or", "pan", "qel", "ris", "sar", "tan", "ul", "van", "wer", "xil", "yar", "zel" ]
    , syllablesEnd      = [ "a", "bor", "cal", "dan", "el", "far", "gar", "han", "is", "jar", "kel", "lan", "mor", "nar", "or", "par", "qel", "ris", "sar", "tan", "ur", "van", "wer", "xil", "yar", "zel" ];

// —— Random name generator
function generateName( ) {

    return [
        syllablesStart[ ~~( Math.random() * syllablesStart.length ) ],
        syllablesMiddle[ ~~( Math.random() * syllablesMiddle.length ) ],
        syllablesEnd[ ~~( Math.random() * syllablesEnd.length ) ]
    ].join( "" );

}