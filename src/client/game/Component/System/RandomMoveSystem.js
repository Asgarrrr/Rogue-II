import {
    RANDOM_MOVEMENT_SYSTEM_FLAGS,
    ComponentType
} from "./System"

import {
  RNG, DIRS
} from "rot-js"

export class RandomMoveSystem {

    act( e, c ) {

      if ( e.has( RANDOM_MOVEMENT_SYSTEM_FLAGS ) && c.entityTurn === e.index ) {

        const position = e.get( ComponentType.Position );

        if ( !position )
          return;

        const { x: fx, y: fy } = position.data;

        // Get a random direction with free space
        const directions = [];
        for ( const [ dx, dy ] of DIRS[ 4 ] ) {
          if ( c.map[ `${ fx + dx },${ fy + dy }` ]?.length === 0 )
            directions.push( [ dx, dy ] );
        }

        if ( directions.length ) {

          const [ dx, dy ] = RNG.getItem( directions );
          const pAnimate = e.get( ComponentType.PositionAnimate );

          if ( pAnimate )
            return;

          e.removeComponent( ComponentType.PositionAnimate );

          e.addComponent( {
            type: ComponentType.PositionAnimate,
            data: {
              start: { x: fx, y: fy },
              end: {
                x: fx + dx,
                y: fy + dy
              },
              counter: 0,
              duration: 10
            }
          } );

          c.moveEntity(
            e.index,
            `${ fx },${ fy }`,
            `${ fx + dx },${ fy + dy }`
          );
        
        }


      }

    }

  }
