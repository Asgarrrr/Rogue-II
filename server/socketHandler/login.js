import axios            from "axios"
import { v4 as uuid }   from "uuid";

export default ( io, socket, db ) => {

    socket.on( "login", async ( { challenge, username, password } ) => {

        console.log( "— —— — login ———————————————————————————————————————" )

        if ( !challenge )
            return socket.emit( "login", { error: "Capcha challenge is missing" } );

        if ( !username )
            return socket.emit( "login", { error: "Username is missing" } );

        if ( !password )
            return socket.emit( "login", { error: "Password is missing" } );

        try {

            const { data } = await axios.post( "https://www.google.com/recaptcha/api/siteverify", null, {
                params: {
                    secret  : process.env.reCAPTCHA_PRIVATE_KEY,
                    response: challenge,
                },
            } );

            if ( !data.success )
                return socket.emit( "login", { error: "Ho ho ho, you are a bot ? I promise I absolutely love bots, but it's not allowed here" } );

        } catch ( err ) {

            console.error( err );
            return socket.emit( "login", { error: "Mmmh, I don't know what happened, but I can't check if you are a bot or not" } );

        }

        const User = db.model( "user" );

        try {

            const user = await User.findOne( { username } );

            if ( !user )
                return socket.emit( "login", { error: "User not found" } );

            const isMatch = await user.comparePassword( password );

            if ( !isMatch )
                return socket.emit( "login", { error: "Wrong password" } );

            const Session = db.model( "session" );

            const session = new Session( {
                token: uuid(),
                user : user._id,
            } );

            await session.save();

            socket.emit( "login", { token: session.token } );

            console.log( "— —— — login success ———————————————————————————————————————" )

        } catch ( err ) {

            console.log( "— —— — login error ———————————————————————————————————————" )
            console.error( err );

            socket.emit( "login", { error: "Something went wrong" } );

        }

    } );

    socket.on( "checkAuth", async ( { token } ) => {

        console.log( "— —— — checkAuth ———————————————————————————————————————" )

        if ( !token )
            return socket.emit( "checkAuth", { error: "Token is missing" } );

        const Session = db.model( "session" );

        try {

            const session = await Session.findOne( { token } );

            if ( !session )
                return socket.emit( "checkAuth", { error: "Session not found" } );

            const User = db.model( "user" );

            const user = await User.findById( session.user );

            if ( !user )
                return socket.emit( "checkAuth", { error: "User not found" } );

            socket.emit( "checkAuth", { user } );

            console.log( "— —— — checkAuth success ———————————————————————————————————————" )

        } catch ( err ) {

            console.log( "— —— — checkAuth error ———————————————————————————————————————" )
            console.error( err );

            socket.emit( "checkAuth", { error: "Something went wrong" } );

        }

    } );

}
