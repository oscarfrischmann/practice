import model from '../dao/models/movies.model.js';

class MovieManager {
	constructor() {}

	async getCountries() {
		try {
			const countries = await model.find().limit(16000).lean();
			const array = [];
			countries.forEach((movie) => {
				array.push(Object.values(movie.countries));
			});
			const result = array.map((innerArray) => innerArray[0]);
			const newArr = [...new Set(result)];
			return newArr;
		} catch (err) {
			return err.message;
		}
	}
}

export default MovieManager;
