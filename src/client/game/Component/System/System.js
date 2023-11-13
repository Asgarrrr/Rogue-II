export const ComponentType = {
    Render                  : 0,
    Position                : 1,
    Input                   : 2, 
    Camera                  : 3,
    PositionAnimate         : 4,
    FOV                     : 5,
    WantsToActOnEntity      : 6,
    RandomMovement          : 7,

    HostileIA               : 8,
}

export const RENDER_SYSTEM_FLAGS
    = ( 1 << ComponentType.Render ) 
    | ( 1 << ComponentType.Position );

export const PLAYER_INPUT_SYSTEM_FLAGS
    = ( 1 << ComponentType.Position ) 
    | ( 1 << ComponentType.Input ) 
    | ( 1 << ComponentType.FOV );

export const CAMERA_SYSTEM_FLAGS
    = ( 1 << ComponentType.Camera )
    | ( 1 << ComponentType.Position );

export const POSITION_ANIMATE_SYSTEM_FLAGS  
    = ( 1 << ComponentType.PositionAnimate )
    | ( 1 << ComponentType.Position );

export const RANDOM_MOVEMENT_SYSTEM_FLAGS
    = ( 1 << ComponentType.RandomMovement );

export const HOSTILE_IA_SYSTEM_FLAGS
    = ( 1 << ComponentType.HostileIA )
    | ( 1 << ComponentType.Position )

export * from "./PositionAnimateSystem";
export * from "./RenderSystem"
export * from "./CameraSystem"
export * from "./RandomMoveSystem"
export * from "./InputSystem"