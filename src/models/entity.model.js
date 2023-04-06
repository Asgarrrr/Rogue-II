import { Schema, model } from "mongoose";

const entitySchema = new Schema({

    health: {
        current: {
            type: Number,
            default: 15
        },
        max: {
            type: Number,
            default: 15
        },
    },

    strength: {
        type: Number,
        default: 10
    },
    vitality: {
        type: Number,
        default: 10
    },
    defense: {
        type: Number,
        default: 10
    },
    dexterity: {
        type: Number,
        default: 10
    },

    currentMap: {
        type: Schema.Types.ObjectId,
        ref: "map",
        required: true
    },

    position: {
        x: {
            type: Number,
            required: true
        },
        y: {
            type: Number,
            required: true
        }
    },

    sx: {
        type: Number,
        required: true
    },
    sy: {
        type: Number,
        required: true
    }

});


export default model( "entity", entitySchema );