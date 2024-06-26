import mongoose from 'mongoose';

mongoose.pluralize(null);
const collection = 'usersNew';

const schema = new mongoose.Schema({
	user: { type: String, unique: true, require: true },
	password: { type: String, require: true },
	email: { type: String, unique: true, index: true, require: true },
});

const model = mongoose.model(collection, schema);

export default model;
