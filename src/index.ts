import express, { Request, Response, urlencoded } from 'express';
import morgan from 'morgan';
import cookieSession from 'cookie-session';

import { router as loginRoutes } from './routes/loginRoutes';

const app = express();

app.use(morgan('dev'));
app.use(urlencoded({ extended: true }));
app.use(cookieSession({ keys: ['trueThat'] }));

app.use(loginRoutes);

app.get('/', (req: Request, res: Response) => {
	if (req?.session?.loggedIn)
		res.send(`
		<div>
			<div>You are logged in</div>
			<a href="/logout">Logout</a>
		</div>
		`);
	else
		res.send(`
		<div>
			<div>You are logged out</div>
			<a href="/login">Login</a>
		</div>
		`);
});

app.listen(8080, (): void => {
	console.log('Listening on port 8080');
});
