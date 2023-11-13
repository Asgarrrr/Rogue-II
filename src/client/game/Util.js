import {
  FOV
} from "rot-js"

export const lerp = ( start, end, normal ) => { 
  return ( 1 - normal ) * start + normal * end
}

export function setFOV( x, y, visionRadius = 10, context ) {

  context.visibleCoords = { };

  const fov = new FOV.PreciseShadowcasting( ( x, y ) => {
    return `${ x },${ y }` in context.map;
  } )

  fov.compute( x, y, visionRadius, ( x, y, _r, v ) => {
    context.visibleCoords[ `${ x },${ y }` ] = v;
  } );

}

export class AlphaAnimator {

  counter = 0;
  running = false;

  constructor({ start, end, duration, sprite }) {

    this.start    = start;
    this.end      = end;
    this.duration = duration;
    this.sprite   = sprite;
    this.running  = false;

  }

  restart( newStart, newEnd ) {

    if ( this.start !== newStart || this.end !== newEnd ) {
      
      this.running   = true;
      this.start      = newStart;
      this.end        = newEnd;
      this.counter    = 0;

    }

  }

  tick( delta ) {
    
      this.sprite.visible = this.sprite.alpha !== 0;

      if ( !this.running )
          return;

    this.counter += delta;

    if ( this.counter > this.duration ) {
      
      this.sprite.alpha   = this.end;
      this.running       = false;
    
  } else {

      this.sprite.alpha = lerp(
          this.start,
          this.end,
          this.counter / this.duration
      );

      if ( this.start >= this.end )
          this.running = false;

    }
  }

}