import mongoose from 'mongoose';

mongoose.pluralize(null);
const collection = 'countries';
const schema = new mongoose.Schema({
	countries: { type: [String] },
});
const model = mongoose.model(collection, schema);
export default model;
