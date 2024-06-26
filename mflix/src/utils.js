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
