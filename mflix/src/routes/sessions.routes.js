import { Router } from 'express';
import passport from 'passport';

import config from '../config.js';
import Manager from '../dao/manager.mdb.js';
import { loginAuth, isValidPassword, createHash, verifyRequiredBody } from '../utils.js';
import initAuthStrategies from '../auth/passport.strategies.js';
// import localStrategy from '../auth/passport.strategies.js';

const router = Router();
const manager = new Manager();
initAuthStrategies();

//PASSPORT GITHUB
router.get('/ghlogin', passport.authenticate('ghlogin', { scope: ['user:email'] }), async (req, res) => {});

router.get(
	'/sessions/ghlogincallback',
	passport.authenticate('ghlogin', {
		failureRedirect: `/?error=${encodeURI('Error al identificar con Github')}`,
	}),
	async (req, res) => {
		try {
			req.session.user = req.user; // req.user es inyectado AUTOMATICAMENTE por Passport al parsear el done()
			req.session.save((err) => {
				if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });

				res.redirect('/mov');
			});
		} catch (err) {
			res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
		}
	}
);
//PASSPORT LOCAL
router.post(
	'/pplogin',
	verifyRequiredBody(['user', 'password']),
	passport.authenticate('local', {
		failureRedirect: `/?error=${encodeURI('Usuario o clave no válidos')}`,
	}),
	async (req, res) => {
		try {
			// Passport inyecta los datos del done en req.user
			req.session.user = req.user;
			req.session.save((err) => {
				if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });

				res.redirect('/mov');
			});
		} catch (err) {
			res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
		}
	}
);
// fin PASSPORT LOCAL

router.post('/api/login', verifyRequiredBody(['user', 'password']), async (req, res) => {
	const { user, password } = req.body;
	try {
		const match = await manager.findUser({ user: user });
		if (match && isValidPassword(password, match.password)) {
			const { password, ...filteredUser } = match;
			req.session.user = filteredUser;
			req.session.save((err) => {
				if (err)
					return res.status(500).send({
						origin: config.SERVER,
						payload: null,
						error: err.message,
					});
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
