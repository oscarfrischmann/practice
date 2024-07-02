import bcrypt from 'bcrypt';

export const loginAuth = (req, res, next) => {
	// ?: operador opcional: si no existe el objeto req.session.user o el role no es admin
	// if (!req.session.user || req.session.user.role !== 'admin')
	if (req.session.user) return res.redirect('/movies');
	return res.redirect('/');

	next();
};

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (enteredPassword, savedPassword) => bcrypt.compareSync(enteredPassword, savedPassword);

export const verifyRequiredBody = (requiredFields) => {
	return (req, res, next) => {
		const allOk = requiredFields.every(
			(field) =>
				req.body.hasOwnProperty(field) &&
				req.body[field] !== '' &&
				req.body[field] !== null &&
				req.body[field] !== undefined
		);
		console.log('verifyRequiredBody');
		if (!allOk) return res.status(400).send({ origin: config.SERVER, payload: 'Faltan propiedades', requiredFields });

		next();
	};
};
