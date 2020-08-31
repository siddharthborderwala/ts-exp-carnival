import { Request, Response } from 'express';
import { bodyValidator, controller, get, post } from './decorators';

@controller('/auth')
class LoginController {
	@get('/login')
	getLogin(req: Request, res: Response): void {
		res.send(`
    <form action="/auth/login" method="post">
      <div><label>Email</label><input name="email" type="email" /></div>
      <div><label>Password</label><input name="password" type="password" /></div>
      <button>Submit</button>
    </form>
  `);
	}

	@post('/login')
	@bodyValidator('email', 'password')
	postLogin(req: Request, res: Response): void {
		const { email, password } = req.body;

		if (email === 'hi@hi.com' && password === 'myPassword') {
			req.session = { loggedIn: true };
			res.redirect('/');
			return;
		}

		res.send(`Incorrect email password combination`);
	}

	@get('/logout')
	getLogout(req: Request, res: Response): void {
		req.session = null;
		res.redirect('/');
	}
}
