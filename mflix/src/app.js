import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import session from 'express-session';
import FileStore from 'session-file-store';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import sessionRouter from './routes/sessions.routes.js';
// import userRouter from './routes/users.routes.js';
import initSocket from './sockets.js';
import viewsRouter from '../src/routes/views.routes.js';
import moviesRoutes from './routes/movies.routes.js';
import config from './config.js';

const app = express();
const fileStorage = FileStore(session);
const expressServer = app.listen(config.PORT, async () => {
	await mongoose.connect(config.ATLAS_URI);
	console.log(`App activa en puerto ${config.PORT} conectada a DB`);

	const socketServer = initSocket(expressServer);
	app.set('socketServer', socketServer);

	app.use(express.json());
	app.use(urlencoded({ extended: true }));
	app.use(
		session({
			store: new fileStorage({ path: './sessions', ttl: 600, retries: 0 }),
			secret: config.SECRET,
			resave: true,
			saveUninitialized: true,
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());
	// app.use('/sessions', sessionRouter);
	app.use('/static', express.static(`${config.DIRNAME}/public`));

	app.engine('handlebars', handlebars.engine());
	app.set('views', `${config.DIRNAME}/views`);
	app.set('view engine', 'handlebars');

	app.use('/', viewsRouter);
	app.use('/', moviesRoutes);
	app.use('/', sessionRouter);
});
