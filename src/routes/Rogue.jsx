import {
    useState, useEffect, lazy, Suspense
} from 'react'

const CreateCharacter = lazy(() => import( "../components/CreateCharacter/" ) );



export default function Rogue({ socket }) {

    const [ user, setUser ] = useState({});
    const [ character, setCharacter ] = useState( null );


    useEffect(() => {

        // Exchange token for user data
        socket.emit( "user:load", { token: localStorage.getItem( "bearer" ) });

        // Listen for user data
        socket.on( "user:load", ( { user, chars } ) => {
            setUser( user );
            setCharacter( chars );
        });

    }, [ socket ])

    useEffect(() => {

        if ( !character )
            return;
        console.log( character );

    }, [ character ])


    if ( !character )
        return <div>Loading...</div>

    if ( character.length === 0 )
        return createCharacter();

    return (
        <div>
            <h1>Rogue</h1>
        </div>
    )

}


function createCharacter() {

    return (
        <div className="w-full h-full bg-rogue text-white font-m5x7">

            <div className="w-full h-full flex justify-center items-center">
                <CreateCharacter />
            </div>


            <div className="bonfires"></div>
        </div>
    )


}






























// import {
//     useState, useEffect
// } from 'react'
// // import '../App.css'
// // import "rot-js"
// // import Game from "../class/game";

// export default function Rogue({ socket }) {

//     const [ user, setUser ] = useState({});
//     const [ character, setCharacter ] = useState( null );


//     useEffect(() => {

//         // Exchange token for user data
//         socket.emit( "user:load", { token: localStorage.getItem( "bearer" ) });

//         // Listen for user data
//         socket.on( "user:load", ( { user, chars } ) => {
//             setUser( user );
//             setCharacter( chars );
//         });

//     }, [ socket ])

//     useEffect(() => {

//         if ( !character )
//             return;
//         console.log( character );

//     }, [ character ])


//     if ( !character )
//         return <div>Loading...</div>

//     if ( character.length === 0 )
//         return createCharacter();

//     return (
//         <div>
//             <h1>Rogue</h1>
//         </div>
//     )

// }


// function createCharacter( ) {




//     // return (
//     //     <div className="w-full h-full bg-rogue text-white font-m5x7">

//     //         <div className="w-full h-1/2 flex justify-center items-center">
//     //             <img className='temp1' src="https://cdn.discordapp.com/attachments/1071595350437134456/1088773456998436894/GUI_Hawker_Base.png" alt="" srcset="" />
//     //             <img className='temp2' src="https://cdn.discordapp.com/attachments/1071595350437134456/1088774838597984266/Dlc_GUI_chest_Shop.png" alt="" srcset="" />
//     //         </div>


//     //         <div className="bonfires"></div>
//     //     </div>
//     // )

// }


//     // useEffect(() => {
//     //     Game.init();
//     // }, [])

//     // console.clear();
//     // console.group("%c   ROGUE II", [
//     //     "font-size: 16px;",
//     //     "background-image: url( data:image/gif;base64,R0lGODlhEAAQAPIAAAAAACUTGjc3N4laRb9wTZCRnq3BzwAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQBFAAAACwAAAAAEAAQAAADSAi63A4hyqeCKRiHZ4ucTqAZVhkWZGo2ouG+ZChq4sYGwkzbFYrnJEFs0cLNDMIIcRARAI1MYpNAKFWVRKf2l2Npc0wnj/JIAAAh+QQBFAAAACwAAAAAEAAQAAADSQi63A4hyqeCKRiHZ4ucTqAZVhkWZGo2ouG+JBsIWeRtS2vXcY7OgpKAhIMMIkGMIXjMRQYDQkkaYQmuwmLuygUGrd0jlkIGJAAAIfkEARQAAAAsAAAAABAAEAAAA0sIutG+UAVTag1RUvdyuMYkekVojtFnrGzofdeHpYEAx7NU1naI6iFbxSDwMQYNQa8WQDIagwFBNG2klDZejoG1TZVbAA+MBGfOkQQAIfkEARQAAAAsAAAAABAAEAAAA0kIutG+UAVTag1RUvdyuMYkekVojtFnrGzofdeHeQIcv0Iu1rNUBrWKQeBi/HQhYoMxaAwIImiT0cjxdEuGtQbVpbaBpjdDhiQAADs= );",
//     //     "background-repeat: no-repeat;",
//     //     "background-size: 16px 16px;",
//     //     "background-color: #25131A;",
//     //     "background-position: 32px 17px;",
//     //     "padding: 16px 32px;",
//     // ].join(";"));

//     // console.group("Author");
//     // console.log("Jérémy Caruelle");
//     // console.log("Twitter : https://twitter.com/Asgarrrr");
//     // console.log("GitHub  : https://github.com/Asgarrrr");
//     // console.groupEnd();
//     // console.group("Stats for nerds");

//     // return (
//     //     <>
//     //         <div id="app">
//     //             <div id="game">
//     //                 <div id="cover">
//     //                     <div id="test"></div>
//     //                     <div id="cover-logo">
//     //                         <div id="slot-1">
//     //                             <img src="./pouch.png" />
//     //                             <span>I</span>
//     //                         </div>
//     //                         <div id="slot-2">
//     //                             <span>D</span>
//     //                         </div>
//     //                         <div id="slot-3">
//     //                             <span>O</span>
//     //                         </div>
//     //                         <div id="slot-4">
//     //                             <span>U</span>
//     //                         </div>
//     //                     </div>
//     //                     <div id="indicator">

//     //                         <svg width="0" height="0">
//     //                             <clipPath id="clipPath">
//     //                                 <polygon points="3 3, 7 0, 17 10, 330 10, 330 16, 15 15, 0 0"></polygon>
//     //                             </clipPath>
//     //                         </svg>

//     //                         <div id="HP">
//     //                             <img id="HPHearth" src="./hearth.svg" alt="" />

//     //                             <div id="HPValue">
//     //                                 <span id="HPCurrent">--</span> / <span id="HPMax">--</span>
//     //                             </div>
//     //                             <div id="HPBar"></div>
//     //                         </div>

//     //                         <div id="XP">
//     //                             <span id="XPData">Lvl. <span id="XPLvl">--</span></span>
//     //                             <div id="XPBar"></div>
//     //                         </div>

//     //                         <div id="affliction">
//     //                             {/* <img src="./malus/poison.png" /> */}
//     //                         </div>

//     //                     </div>
//     //                 </div>

//     //                 <div id="inventory" className="hidden">
//     //                     <div id="inventory-header">
//     //                         <div className="inventory-header-slot1"> </div>
//     //                         <div className="inventory-header-slot2"> </div>
//     //                         <div className="inventory-header-slot3"> </div>
//     //                         <div className="inventory-header-slot4"> </div>
//     //                         <div className="inventory-header-slot5"> </div>
//     //                         <div className="inventory-header-slot6"> </div>
//     //                         <div className="inventory-header-slot7"> </div>
//     //                         <div className="inventory-header-slot8"> </div>
//     //                         <div className="inventory-header-slot9"> </div>
//     //                         <div className="inventory-header-slot10"> </div>
//     //                         <div className="inventory-header-slot11"> </div>
//     //                         <div className="inventory-header-slot12"> </div>
//     //                         <div className="inventory-header-slot13"> </div>
//     //                         <div className="inventory-header-slot14"> </div>
//     //                         <div className="inventory-header-slot15"> </div>
//     //                     </div>
//     //                 </div>

//     //             </div>
//     //             <div id="stats"></div>
//     //         </div>
//     //     </>

//     // )
