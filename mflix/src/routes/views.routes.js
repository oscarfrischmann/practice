import { Router } from 'express';
import moviesModel from '../dao/models/movies.model.js';
import MovieManager from '../dao/manager.mdb.js';
import countriesModel from '../dao/models/countries.model.js';
import config from '../config.js';

const router = Router();
const manager = new MovieManager();
const login = async (req, res, next) => {
	if (req.session.user) {
		next();
	} else {
		return res.redirect('/');
	}
};
router.get('/', async (req, res) => {
	console.log(req.session.user);
	try {
		if (req.query.error) {
			res.render('login', { origin: 'login', error: true });
		} else {
			res.render('login', { origin: 'login' });
		}
	} catch (err) {
		throw new Error(err);
	}
});

router.get('/mov', login, async (req, res) => {
	let currentPage;
	if (req.query) {
		currentPage = req.query;
	} else {
		currentPage = '1';
	}
	try {
		const countries = await countriesModel.aggregate([
			{
				$set: {
					countries: {
						$sortArray: {
							input: '$countries',
							sortBy: 1,
						},
					},
				},
			},
		]);
		const data = await moviesModel.paginate({}, { limit: 8, lean: true, page: +currentPage.page });
		res.render('movies', {
			movies: data,
			countries: countries[0].countries,
			user: req.session.user,
		});
	} catch (err) {
		throw new Error(err);
	}
});

router.get('/mov/one/:movid', login, async (req, res) => {
	try {
		const data = await moviesModel.findOne({ _id: req.params.movid }).lean();
		const countries = await manager.getCountries();
		res.render('movie', { movie: data, countries: countries });
	} catch (err) {
		throw new Error(err);
	}
});

router.get('/mov/country', login, async (req, res) => {
	let currentPage;
	const { country, page } = req.query;
	if (page) {
		currentPage = +page;
	} else {
		currentPage = '1';
	}
	try {
		const countries = await countriesModel.aggregate([
			{
				$set: {
					countries: {
						$sortArray: {
							input: '$countries',
							sortBy: 1,
						},
					},
				},
			},
		]);
		const byCountry = await moviesModel.paginate({ countries: country }, { limit: 8, lean: true, page: +currentPage });
		res.render('bycountry', { movies: byCountry, countries: countries[0].countries });
	} catch (error) {
		throw new Error(err);
	}
});

export default router;
