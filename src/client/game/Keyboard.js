export class Keyboard {

    keys    = { };
    keyDown = this.keyDown.bind( this );
    keyUp   = this.keyUp.bind( this );

    constructor( ) {

        window.addEventListener( "keydown"  , this.keyDown  );
        window.addEventListener( "keyup"    , this.keyUp    );

    }

    destroy( ) {

        window.removeEventListener( "keydown"  , this.keyDown  );
        window.removeEventListener( "keyup"    , this.keyUp    );

    }

    keyDown( e ) {

        this.keys[ e.key ] = true;

    }

    keyUp( e ) {

        delete this.keys[ e.key ];

    }

    pressed( key ) {

        return !!this.keys[ key ];

    }

}