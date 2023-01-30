class Camera {

    constructor( width, height ) {
        this.cx = parseInt( width / 2, 10 );
        this.cy = parseInt( height / 2, 10 );
    }

    setFocus( x, y ) {

        this.x = x;
        this.y = y;

    }

}

export default Camera;