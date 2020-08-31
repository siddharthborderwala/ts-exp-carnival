import * as Path from 'path';

import 'reflect-metadata';
import { Request, Response, RequestHandler, NextFunction } from 'express';

import { AppRouter } from '../../AppRouter';
import { HttpMethod } from './Methods';
import { MetadataKeys } from './MetadataKeys';

function bodyValidators(keys: string[]): RequestHandler {
	return function (req: Request, res: Response, next: NextFunction) {
		if (!req.body) {
			res.status(401).send('Bad request');
			return;
		}

		for (let key of keys) {
			if (!req.body[key]) {
				res.status(401).send(`Bad request, missing ${key}`);
				return;
			}
		}

		next();
	};
}

/**
 * Factory decorator - returns a decorator function
 * It makes us able to pass arguments into decorators
 * @param {string} routePrefix
 */
export function controller(routePrefix: string) {
	return function (target: Function) {
		const router = AppRouter.instance;

		for (let key in target.prototype) {
			const routeHandler = target.prototype[key];
			const path = Reflect.getMetadata(MetadataKeys.path, target.prototype, key);
			const method = Reflect.getMetadata(
				MetadataKeys.method,
				target.prototype,
				key
			) as HttpMethod;

			const middlewareArray: Array<RequestHandler> =
				Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) || [];

			const requiredBodyProps: string[] =
				Reflect.getMetadata(MetadataKeys.validator, target.prototype, key) || [];

			const validator = bodyValidators(requiredBodyProps);

			if (path)
				router[method](
					Path.join(routePrefix, path),
					...middlewareArray,
					validator,
					routeHandler
				);
		}
	};
}
