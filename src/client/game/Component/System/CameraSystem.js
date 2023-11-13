import {
    CAMERA_SYSTEM_FLAGS,
    ComponentType
} from "./System"


export class CameraSystem {

    act( e, c ) {

        const { camera } = c;

        if ( e.has( CAMERA_SYSTEM_FLAGS ) ) {

            const position = e.get( ComponentType.Position );

            if ( position ) {

                const positionData = position.data;
                camera.x = positionData.x * 2 * 16 - camera.w / 2;
                camera.y = positionData.y * 2 * 16 - camera.h / 2;

            }

        }
    }
}
  