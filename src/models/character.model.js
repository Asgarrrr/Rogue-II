import { Schema, model } from "mongoose";

const characterSchema = new Schema({

    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },

    type: { type: String, required: true, enum: [ "warrior", "mage" ] },

    // —— Stats
    level       : { type: Number, default: 1   },
    experience  : { type: Number, default: 0   },
    health      : { type: Number, default: 100 },
    mana        : { type: Number, default: 100 },
    strength    : { type: Number, default: 10  },
    dexterity   : { type: Number, default: 10  },
    intelligence: { type: Number, default: 10  },

    // —— Inventory
    inventory: { type: [ { type: Schema.Types.ObjectId, ref: "item" } ], default: [ ] },

    // —— Equipment
    equipment: {
        head: { type: Schema.Types.ObjectId, ref: "item" },
        body: { type: Schema.Types.ObjectId, ref: "item" },
        legs: { type: Schema.Types.ObjectId, ref: "item" },
        feet: { type: Schema.Types.ObjectId, ref: "item" },
    },

    // —— Timestamps
    createdAt: { type: Date, default: Date.now },


});


export default model( "character", characterSchema );