import mongoose from 'mongoose';

mongoose.pluralize(null);
const collection = 'users';

const schema = new mongoose.Schema({
	name: { type: String },
	password: { type: String, require: true },
	email: { type: String, unique: true, index: true, require: true },
});

const model = mongoose.model(collection, schema);

export default model;
