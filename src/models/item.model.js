import { Schema, model } from "mongoose";

const itemSchema = new Schema({

    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true, enum: [ "weapon", "armor", "consumable" ] },
    rarity: { type: String, required: true, enum: [ "common", "uncommon", "rare", "epic", "legendary" ] },
    stats: { type: Object, required: true },
    image: { type: String, required: true },

});

export default model( "item", itemSchema );