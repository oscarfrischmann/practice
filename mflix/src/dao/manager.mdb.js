import movies from '../dao/models/movies.model.js';
import users from './models/users.model.js';
class MovieManager {
	constructor() {}

	async getCountries() {
		try {
			const countries = await movies.find().limit(16000).lean();
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

	createUser = async (user) => {
		try {
			return await users.create(user);
		} catch (err) {
			throw new Error(err);
		}
	};
}

export default MovieManager;
