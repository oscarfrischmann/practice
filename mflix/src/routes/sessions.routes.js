import { Router } from 'express';
import config from '../config.js';
import Manager from '../dao/manager.mdb.js';
import { loginAuth, isValidPassword, createHash } from '../utils.js';
const router = Router();
const manager = new Manager();

router.post('/api/login', async (req, res) => {
	const { user, password } = req.body;
	try {
		const match = await manager.findUser({ user: user });
		if (match && isValidPassword(password, match.password)) {
			req.session.user = { user: match.user, email: match.email };
			req.session.save((err) => {
				if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
				res.redirect('/mov');
			});
		} else {
			res.redirect(`/?error=true`);
		}
	} catch (err) {
		throw new Error(err);
	}
});

router.post('/api/register', async (req, res) => {
	try {
		const { user, password, email } = req.body;
		await manager.createUser({
			user: user,
			password: createHash(password),
			email: email,
		});
		res.redirect('/');
	} catch (err) {
		throw new Error(err);
	}
});

router.get('/logout', async (req, res) => {
	try {
		req.session.destroy((err) => {
			if (err)
				return res.status(500).send({
					origin: config.SERVER,
					payload: 'Error al ejecutar logout',
					error: err,
				});
			res.redirect('/');
		});
	} catch (err) {
		res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
	}
});

export default router;
