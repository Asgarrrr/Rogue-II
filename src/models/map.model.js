import { Schema, model } from "mongoose";

const mapSchema = new Schema({

    width   : Number,
    height  : Number,
    tiles   : Object,
    data    : Object,
    doors   : Array,
    stairs  : Array,
    rooms   : Array,
    exit    : Array,

});


export default model( "map", mapSchema );