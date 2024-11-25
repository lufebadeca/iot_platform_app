import mongoose from 'mongoose';
const uniqueValidator = require('mongoose-unique-validator');
//we need a model for user to restrict the type of data to be entered into the DB and give some structure, unique values, create Ids, etc

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: { type: String, required: [true] },     //given at API route level upon creation
    name: {type: String, required: [true], unique: true },
    description: {type: String, required: [true] },
    createdTime: { type: Number },                  //given at API route level upon creation
    widgets: { type: Array, default:[] }
});

//Validator for unique email values
userSchema.plugin(uniqueValidator, {message: 'Error, template name already exists'});

//Convert to model
const Template = mongoose.model( 'Template', userSchema );

export default Template;