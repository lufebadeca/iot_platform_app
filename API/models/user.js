import mongoose from 'mongoose';
const uniqueValidator = require('mongoose-unique-validator');
//we need a model for user to restrict the type of data to be entered into the DB and give some structure, unique values, create Ids, etc


const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: [true] },
    email: {type: String, required: [true], unique: true },
    password: {type: String, required: [true] }
});

//Validator for unique email values
userSchema.plugin(uniqueValidator, {message: 'Error, email already exists'});

//Convert to model
const User = mongoose.model( 'User', userSchema );

export default User;