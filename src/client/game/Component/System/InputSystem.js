import {
  PLAYER_INPUT_SYSTEM_FLAGS,
  ComponentType,
} from "./System"

import {
  Util,
} from "rot-js"

import {
  setFOV
} from "../../Util"

export class InputSystem {

    act( e, c ) {

      const { input } = c;

      if ( e.has( PLAYER_INPUT_SYSTEM_FLAGS ) && c.entityTurn === e.index ) {

        const position = e.get( ComponentType.Position )
            , fov      = e.get( ComponentType.FOV );

        if ( position && fov ) {

          const data    = position.data
              , fovData = fov.data;

          const { keys } = input;

          let lateralMovement    = 0
            , verticalMovement   = 0
            , visionRadiusChange = 0;

          if( [ "ArrowUp", "z" ].some( ( k ) => keys[ k ] ) ) {
            --verticalMovement;
          } else if ( [ "ArrowDown", "s" ].some( ( k ) => keys[ k ] ) ) {
            ++verticalMovement;
          } else if ( [ "ArrowLeft", "q" ].some( ( k ) => keys[ k ] ) ) {
            --lateralMovement;
          } else if ( [ "ArrowRight", "d" ].some( ( k ) => keys[ k ] ) ) {
            ++lateralMovement;
          } else if ( [ "e" ].some( ( k ) => keys[ k ] ) ) {
          } else if ( [ "a" ].some( ( k ) => keys[ k ] ) ) {

            for ( const tile of Object.values( c.tiles ) ) {
                tile.sprite.tint = 0xffffff;
            }

          }

          // for (const entity of c.getEntitiesAt(`${data.x},${data.y}`) || []) {
          //   const wantsToAct = entity.get(ComponentType.WantsToActOnEntity);
          //   if (wantsToAct) {
          //     const actData = wantsToAct.data;
          //     actData.act(e, c);
          //   }
          // }

        // }


          fovData.visionRadius = Util.clamp(
            fovData.visionRadius + visionRadiusChange,
            0,
            15
          );

          if ( lateralMovement || verticalMovement || visionRadiusChange ) {
            
            const pAnimate = e.get( ComponentType.PositionAnimate );

            let x = data.x
              , y = data.y;

            if ( pAnimate ) {

              const pAnimateData = pAnimate.data;
              x = pAnimateData.end.x;
              y = pAnimateData.end.y;

            }

            if (
                c.map[ `${ x + lateralMovement },${ y + verticalMovement }` ]
                && c.map[ `${ x + lateralMovement },${ y + verticalMovement }` ].length === 0
            ) {

              if ( pAnimate )
                return;

              e.removeComponent( ComponentType.PositionAnimate );

              e.addComponent( {
                type: ComponentType.PositionAnimate,
                data: {
                  start: { x, y },
                  end: {
                    x: x + lateralMovement,
                    y: y + verticalMovement
                  },
                  counter: 0,
                  duration: 10
                }
              } );

              c.moveEntity(
                e.index,
                `${ x },${ y }`,
                `${ x + lateralMovement },${ y + verticalMovement }`
              );

              setFOV(
                x + lateralMovement,
                y + verticalMovement,
                fovData.visionRadius,
                c
              );

              console.log( "%cPLAYER MOVED", "color: blue; font-weight: bold;" );
              e.endTurn( );

            }

          }

        }
      }
    }
  }