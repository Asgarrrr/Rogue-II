import axios            from "axios"
import { v4 as uuid }   from "uuid";

// —— This is the socket handler for the user namespace
//  — It handles all user related events

/**
 * @param {import("socket.io").Server} io
 * @param {import("socket.io").Socket} socket
 * @param {import("mongoose").Connection} db
 * @returns {void}
 */
export default ( io, socket, db ) => {

    /**
     * @param { challenge: string, username: string, password: string } data
     * @returns {void}
     * @description This event is used to login a user
     * — It checks if the user exists, if the password is correct and if the user is not a bot
     * — If everything is ok, it creates a session and returns the token
     */
    socket.on( "user:login", async ( { challenge, username, password } ) => {

        if ( !challenge )
            return socket.emit( "user:login", { error: "Capcha challenge is missing" } );

        if ( !username )
            return socket.emit( "user:login", { error: "Username is missing" } );

        if ( !password )
            return socket.emit( "user:login", { error: "Password is missing" } );

        try {

            const { data } = await axios.post( "https://www.google.com/recaptcha/api/siteverify", null, {
                params: {
                    secret  : process.env.reCAPTCHA_PRIVATE_KEY,
                    response: challenge,
                },
            } );

            if ( !data.success )
                return socket.emit( "user:login", { error: "Ho ho ho, you are a bot ? I promise I absolutely love bots, but it's not allowed here" } );

        } catch ( err ) {

            console.error( err );
            return socket.emit( "user:login", { error: "Mmmh, I don't know what happened, but I can't check if you are a bot or not" } );

        }

        const User = db.model( "user" );

        try {

            const user = await User.findOne( { username } );

            if ( !user )
                return socket.emit( "user:login", { error: "User not found" } );

            const isMatch = await user.comparePassword( password );

            if ( !isMatch )
                return socket.emit( "user:login", { error: "Wrong password" } );

            const Session = db.model( "session" );

            const session = new Session( {
                token: uuid(),
                user : user._id,
            } );

            await session.save();

            socket.emit( "user:login", { token: session.token } );

        } catch ( err ) {

            console.error( err );

            socket.emit( "user:login", { error: "Something went wrong" } );

        }

    } );

    socket.on( "user:checkAuth", async ( { token } ) => {

        if ( !token )
            return socket.emit( "user:checkAuth", { error: "Token is missing" } );

        const Session = db.model( "session" );

        try {

            const session = await Session.findOne( { token } );

            if ( !session )
                return socket.emit( "user:checkAuth", { error: "Session not found" } );

            const User = db.model( "user" );

            const user = await User.findById( session.user );

            if ( !user )
                return socket.emit( "user:checkAuth", { error: "User not found" } );

            socket.emit( "user:checkAuth", { user } );

        } catch ( err ) {

            console.error( err );
            socket.emit( "user:checkAuth", { error: "Something went wrong" } );

        }

    } );

    socket.on( "user:load", async ({ token }) => {

        // —— Load the user from the database
        const User      = db.model( "user" )
            , Session   = db.model( "session" );

        // —— Find the session > the user
        const session = await Session.findOne( { token } )

        if ( !session )
            return socket.emit( "user:load", { error: "Session not found" } );

        const user = await User.findById( session.user );

        if ( !user )
            return socket.emit( "user:load", { error: "User not found" } );

        // Check if the user has characters
        const Character = db.model( "character" );

        const chars = await Character.findOne( { user: user._id } );

        socket.emit( "user:load", { user, chars } );

    });

}