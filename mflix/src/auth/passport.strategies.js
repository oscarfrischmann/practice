import passport from 'passport';
import local from 'passport-local';
import gitHub from 'passport-github2';
import UsersManager from '../dao/manager.mdb.js';
import { isValidPassword } from '../utils.js';
import config from '../config.js';

const localStrategy = local.Strategy;
const gitHubStrategy = gitHub.Strategy;
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

	passport.use(
		'ghlogin',
		new gitHubStrategy(
			{
				clientID: config.GITHUB_CLIENT_ID,
				clientSecret: config.GITHUB_CLIENT_SECRET,
				callbackURL: config.GITHUB_CALLBACK_URL,
			},
			async (req, accessToken, refreshToken, profile, done) => {
				try {
					console.log(profile);
					const email = profile._json?.email || null;
					// console.log(profile);
					if (email) {
						const foundUser = await manager.findUser({ email: email });

						if (!foundUser) {
							const user = {
								user: profile._json.name.split(' ')[0] + profile._json.name.split(' ')[1],
								// lastName: profile._json.name.split(" ")[1],
								email: email,
								password: 'none',
							};

							const process = await manager.createUser(user);

							return done(null, process);
						} else {
							return done(null, foundUser);
						}
					} else {
						return done(new Error('Faltan datos de perfil'), null);
					}
				} catch (err) {
					return done(err, false);
				}
			}
		)
	);
	passport.serializeUser((user, done) => {
		done(null, user);
	});
	passport.deserializeUser((user, done) => {
		done(null, user);
	});
};

export default initAuthStrategies;
