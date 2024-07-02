import passport from 'passport';
import local from 'passport-local';
import UsersManager from '../dao/manager.mdb.js';
import { isValidPassword } from '../utils.js';

const localStrategy = local.Strategy;
const manager = new UsersManager();

const initAuthStrategies = () => {
	passport.use(
		'local',
		new localStrategy({ passReqToCallback: true, usernameField: 'user' }, async (req, username, password, done) => {
			try {
				const foundUser = await manager.findUser({ user: username });

				if (foundUser && isValidPassword(password, foundUser.password)) {
					const { password, ...filteredFoundUser } = foundUser;
					return done(null, filteredFoundUser);
				} else {
					return done(null, false);
				}
			} catch (err) {
				return done(err, false);
			}
		})
	);
	passport.serializeUser((user, done) => {
		done(null, user);
	});
	passport.deserializeUser((user, done) => {
		done(null, user);
	});
};

export default initAuthStrategies;
