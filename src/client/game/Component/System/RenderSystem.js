import {
    RENDER_SYSTEM_FLAGS,
    ComponentType
} from "./System"

export class RenderSystem {
    
    act( e, c ) {
  
        const { camera } = c;

        if ( e.has( RENDER_SYSTEM_FLAGS ) ) {

            const render    = e.get( ComponentType.Render )
                , position  = e.get( ComponentType.Position );

            if ( render && position ) {

                const renderData    = render.data
                    , positionData  = position.data;

                renderData.sprite.position.set(
                    positionData.x * 32 - camera.x,
                    positionData.y * 32 - camera.y
                );

            }

        }

    }

}