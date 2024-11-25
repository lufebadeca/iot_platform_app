import mongoose from 'mongoose';

const uniqueValidator =  require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    userId: { type: String, required: [true] },         //given at API route level upon creation
    dId: { type: String, unique: true, required: [true] },
    name: { type: String, required:[true] },
    selected: { type: Boolean, required: [true], default: false },
    templateId: { type: String, required: [true] },
    templateName: { type: String, required: [true] },
    createdTime: { type: Number }                     //given at API route level upon creation
});

//Validator
deviceSchema.plugin( uniqueValidator, { message: 'Error, device already exists' } );

//Schema to model
const Device = mongoose.model('Device', deviceSchema); //third optional argument: 'custom_collection_name'. Default is pluralization of model name

export default Device;
