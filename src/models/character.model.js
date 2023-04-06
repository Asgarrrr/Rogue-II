import { Schema, model } from "mongoose";

const characterSchema = new Schema({

    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    class: { type: String, required: true, enum: [ 0, 1, 2 ] },

    // —— Stats
    level: { type: Number, default: 1   },
    experience: { type: Number, default: 1 },

    health      : {
        current: { type: Number, default: 15 },
        max: { type: Number, default: 15 },
    },

    strength: { type: Number, default: 10 },
    vitality: { type: Number, default: 10 },
    defense: { type: Number, default: 10 },
    dexterity: { type: Number, default: 10 },

    // —— Inventory
    inventory: { type: [ { type: Schema.Types.ObjectId, ref: "item" } ], default: [ ] },

    // —— Equipment
    equipment: {
        head: { type: Schema.Types.ObjectId, ref: "item" },
        body: { type: Schema.Types.ObjectId, ref: "item" },
        legs: { type: Schema.Types.ObjectId, ref: "item" },
        feet: { type: Schema.Types.ObjectId, ref: "item" },
    },

    currentMap: { type: Schema.Types.ObjectId, ref: "map" },
    position: {
        x: { type: Number, required: true, default: 1 },
        y: { type: Number, required: true, default: 1 }
    },
    // —— Timestamps
    createdAt: { type: Date, default: Date.now },

});


export default model( "character", characterSchema );