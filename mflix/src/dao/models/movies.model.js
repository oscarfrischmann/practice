import mongoose from "mongoose";

mongoose.pluralize(null);
const collection = "movies";
const schema = new mongoose.Schema({
  plot: { type: String },
  genres: { type: [String] },
  runtime: { type: Number },
  cast: { type: [String] },
  poster: { type: String },
  title: { type: String },
  fullplot: { type: String },
  languages: { type: [String] },
  released: { type: Date },
  directors: { type: [String] },
  rated: { type: String },
  awards: {
    wins: { type: Number },
    nominations: { type: Number },
    text: { type: String },
  },
  lastupdated: { type: Date },
  year: { type: Number },
  imdb: {
    rating: { type: Number },
    votes: { type: Number },
    id: { type: Number },
  },
  countries: { type: [String] },
  type: { type: String },
  tomatoes: {
    viewer: {
      rating: { type: Number },
      numReviews: { type: Number },
      meter: { type: Number },
    },
    critic: {
      rating: { type: Number },
      numReviews: { type: Number },
      meter: { type: Number },
    },
    rotten: { type: Number },
    lastUpdated: { type: Date },
  },
  num_mflix_comments: { type: Number },
});

const model = mongoose.model(collection, schema);

export default model;
