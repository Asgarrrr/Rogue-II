import {
  POSITION_ANIMATE_SYSTEM_FLAGS,
  ComponentType
} from "./System"

import {
  lerp
} from "../../Util"

export class PositionAnimateSystem {

    act( e, c ) {

      if ( e.has( POSITION_ANIMATE_SYSTEM_FLAGS ) ) {

        const position = e.get( ComponentType.Position )
            , pAnimate = e.get( ComponentType.PositionAnimate );

        if ( position && pAnimate ) {

            const positionData = position.data
                , pAnimateData = pAnimate.data;

          pAnimateData.counter += c.delta;

          if ( pAnimateData.counter > pAnimateData.duration ) {

            positionData.x = pAnimateData.end.x;
            positionData.y = pAnimateData.end.y;

            e.removeComponent( ComponentType.PositionAnimate );

          } else {

            positionData.x = lerp(
                pAnimateData.start.x,
                pAnimateData.end.x,
                pAnimateData.counter / pAnimateData.duration
            );

            positionData.y = lerp(
                pAnimateData.start.y,
                pAnimateData.end.y,
                pAnimateData.counter / pAnimateData.duration
            );

            if (
                positionData.x === pAnimateData.end.x &&
                positionData.y === pAnimateData.end.y
            ) {
                e.removeComponent( ComponentType.PositionAnimate );
            }
          }
        }
      }
    }
  }