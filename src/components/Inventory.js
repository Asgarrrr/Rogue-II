import { useState, useEffect } from "react";

export default function Inventory({
    isRendered = false,
}) {

    const [ isLoaded, setIsLoaded ] = useState( false );

    useEffect( () => {

        if ( isRendered ) {

            console.log( "Inventory is rendered" );

        }

    }, [ isRendered ] );

    return (
        <div className="inventory">
            <h1>Inventory</h1>
        </div>
    );


}