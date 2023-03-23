const SALT_WORK_FACTOR = 10;

import { Schema, model } from "mongoose";
import { genSalt, hash, compare } from "bcrypt";

const userSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true, trim: true, minlength: 8 },
});

userSchema.pre( "save", async function ( next ) {

    const user = this;

    // —— Only hash the password if it has been modified ( or is new )
    if ( !user.isModified( "password" ) )
        return next();

    try {

        const salt = await genSalt( SALT_WORK_FACTOR );
        user.password = await hash( user.password, salt );

        next();

    } catch ( err ) {

        next( err );

    }

});

userSchema.methods.comparePassword = async function ( candidatePassword ) {

    return await compare( candidatePassword, this.password );

};

export default model( "user", userSchema );