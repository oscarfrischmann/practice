import { Router } from 'express';
import model from '../dao/models/movies.model.js';
const router = Router();

router.get('/mov/:page', async (req, res) => {
	const page = req.params.page;
	try {
		const data = await model.paginate({}, { limit: 8, lean: true, page: +page });
		res.render('movies', { movies: data });
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
