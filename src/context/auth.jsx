import {
    createContext,
    useContext,
    useEffect,
    useReducer
} from "react";

const DispatchContext = createContext();

const StateContext = createContext({
    authenticated: false,
    user: null,
    loading: true,
});

const reducer = ( state, { type, payload }) => {

    switch ( type ) {

        case "LOGIN":
            console.log( "LOGIN" );
            return { ...state, authenticated: true, user: payload, };

        case "LOGOUT":
            console.log( "LOGOUT" );
            localStorage.removeItem( "bearer" );
            return { ...state, authenticated: false, user: null, };

        case "POPULATE":
            console.log( "POPULATE" );
            return { ...state, user: payload, ...state.user, ...payload, };

        case "STOP_LOADING":
            console.log( "STOP_LOADING" );
            return { ...state, loading: false, };

        default:
            throw new Error( `Unknown action type: ${ type }` );
    }

};

export const AuthProvider = ({ socket, children }) => {

    const [ state, defaultDispatch ] = useReducer( reducer, {
        user: null,
        authenticated: false,
        loading: true,
    });

    const dispatch = ( type, payload ) => defaultDispatch({ type, payload });

    useEffect( ( ) => {

        const checkAuth = async () => {

            try {

                const token = localStorage.getItem( "bearer" );

                if ( !token)
                    return dispatch( "STOP_LOADING" );

                socket.emit("checkAuth", { token });

                socket.on("checkAuth", (data) => {

                    console.log(data);

                    if ( data.user ) {

                        dispatch("LOGIN", data.user);
                        dispatch( "STOP_LOADING" );

                    } else {

                        localStorage.removeItem("bearer");
                        dispatch("LOGOUT");

                    }

                });

            } catch ( err ) {

                console.log(err);
                dispatch("LOGOUT");

            }

        }

        if ( socket?.connected == false)
            checkAuth();

    }, [ socket ]);

    return (
        <StateContext.Provider value={ state }>
            <DispatchContext.Provider value={ dispatch }>
                { children }
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
