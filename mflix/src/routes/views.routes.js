import { Router } from 'express';
import model from '../dao/models/movies.model.js';
const router = Router();

router.get('/mov/:page', async (req, res) => {
	console.log('what!');
	const page = req.params.page;
	try {
		const data = await model.paginate({}, { limit: 8, lean: true, page: +page });
		console.log(data);
		res.render('movies', { movies: data });
	} catch (err) {
		throw new Error(err, 'wata fuck');
	}
});

router.get('/mov/one/:movid', async (req, res) => {
	console.log('ONEONE ONE!!!');
	try {
		const data = await model.findOne({ _id: req.params.movid }).lean();
		console.log(data);
		res.render('movie', { movie: data });
	} catch (err) {
		throw new Error(err, 'wata fuck');
	}
});

router.get('/delete/:toClean', async (req, res) => {
	const toClean = req.params.toClean;
	try {
		console.log(toClean);
		const moviesToDelete = await model.paginate({ toClean: { $exists: false } }, { limit: 20 });
		res.render('movies', { movies: moviesToDelete });
	} catch (err) {
		throw new Error(err);
	}
});

export default router;
