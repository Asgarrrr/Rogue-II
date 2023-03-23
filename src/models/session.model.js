import { Schema, model } from "mongoose";

const sessionSchema = new Schema({
    token: { type: String, required: true, index: { unique: true } },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default model( "session", sessionSchema );