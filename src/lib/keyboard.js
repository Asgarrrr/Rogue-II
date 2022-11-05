
/**
 * @class Keyboard
 * @description Keyboard class for handling keyboard input
 */
class Keyboard {

    constructor() {

        this.keys       = {};
        this.keyDown    = this.keyDown.bind( this );
        this.keyUp      = this.keyUp.bind( this );

    }

    /**
     * @description Bind the keydown and keyup events
     * @returns     { void }
     * @memberof    Keyboard
     */
    init( ) {

        window.addEventListener( "keydown", this.keyDown );
        window.addEventListener( "keyup", this.keyUp );

    }

    /**
     * @param       { KeyboardEvent } event
     * @returns     { void }
     * @memberof    Keyboard
     * @description When a key is pressed, set the key to true
     */
    keyDown( event ) {
        this.keys[ event.key ] = true;
    }

    /**
     * @param       { KeyboardEvent } event
     * @returns     { void }
     * @memberof    Keyboard
     * @description When a key is released, set the key to false
     */
    keyUp( event ) {
        this.keys[ event.key ] = false;
    }

    /**
     * @param       { string } key
     * @returns     { boolean }
     * @memberof    Keyboard
     * @description Check if a key is pressed
     */
    pressed( key ) {
        return !!this.keys[ key ];
    }

}

export default new Keyboard( );