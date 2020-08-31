import express, { urlencoded } from 'express';
import morgan from 'morgan';
import cookieSession from 'cookie-session';

import { AppRouter } from './AppRouter';

import './controllers/RootController';
import './controllers/LoginController';

const app = express();

app.use(morgan('dev'));
app.use(urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: ['mongo', 'express', 'react', 'angular', 'vue', 'node'],
	})
);

app.use(AppRouter.instance);

app.listen(8080, (): void => {
	console.log('Listening on port 8080');
});
