import passport from 'passport';
import local from 'passport-local';
import UsersManager from '../dao/manager.mdb.js';
import { isValidPassword } from '../utils.js';

const localStrategy = local.Strategy;
const usersManager = new UsersManager();

const initAuthStrategies = () => {
	passport.serializeUser((user, done) => {
		done(null, user);
	});
	passport.deserializeUser((user, done) => {
		done(null, user);
	});
};

export default localStrategy;
