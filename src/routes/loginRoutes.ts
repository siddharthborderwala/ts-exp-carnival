import { Router, Request, Response, NextFunction } from 'express';

function requireAuth(req: Request, res: Response, next: NextFunction): void {
	if (req?.session?.loggedIn) next();

	res.status(403).send('Login to access this protected resource');
}

const router = Router();

router.get('/login', (req: Request, res: Response): void => {
	res.send(`
    <form action="/login" method="post">
      <div><label>Email</label><input name="email" type="email" /></div>
      <div><label>Password</label><input name="password" type="password" /></div>
      <button>Submit</button>
    </form>
  `);
});

router.post('/login', (req: Request, res: Response): void => {
	const { email, password } = req.body;

	if (!email) res.status(401).send('Please provide an email.');
	if (!password) res.status(403).send('Password required');

	if (email === 'hi@hi.com' && password === 'myPassword') {
		req.session = { loggedIn: true };
		res.redirect('/');
	}

	res.send(`${email},${password}`);
});

router.get('/logout', (req: Request, res: Response): void => {
	req.session = null;
	res.redirect('/');
});

router.get('/protected', requireAuth, (req: Request, res: Response): void => {
	res.send('Welcome to protected route, logged in user!');
});

export { router };
