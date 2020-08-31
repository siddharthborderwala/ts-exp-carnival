import express from 'express';

/**
 * Singleton Class for AppRoute
 */
export class AppRouter {
	private static appRouter: express.Router;

	static get instance(): express.Router {
		if (!AppRouter.appRouter) AppRouter.appRouter = express.Router();
		return AppRouter.appRouter;
	}
}
