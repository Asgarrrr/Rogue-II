import { Schema, model } from "mongoose";

const mapSchema = new Schema({

    data: {
        type: Object,
        required: true
    }

});


export default model( "map", mapSchema );