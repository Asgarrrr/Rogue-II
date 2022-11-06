class Camera {

    constructor( width, height ) {
        this.cx = parseInt( width / 2, 10 );
        this.cy = parseInt( height / 2, 10 );
    }

}

export default Camera;