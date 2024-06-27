import { Router } from 'express';
import config from '../config.js';
import model from '../dao/models/movies.model.js';
import countriesModel from '../dao/models/countries.model.js';
import { uploader } from '../uploader.js';

const router = Router();

router.get('/movies/:mid', async (req, res) => {
	try {
		const movies = await model.findOne({ _id: req.params.mid });

		res.status(200).send({ origin: 'get from "movies.routes.js"', payload: movies });
	} catch (err) {
		res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
	}
});

router.get('/movies/sort/1', async (req, res) => {
	console.log('sort');
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
		res.send({ payload: countries });
	} catch (err) {
		res.send({ error: err });
	}
});

export default router;
