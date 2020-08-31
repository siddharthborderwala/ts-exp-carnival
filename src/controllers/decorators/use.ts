import 'reflect-metadata';
import { RequestHandler } from 'express';

import { MetadataKeys } from './MetadataKeys';

export function use(middleware: RequestHandler) {
	return function (target: any, key: string, desc: PropertyDescriptor) {
		const middlewareArray: Array<RequestHandler> =
			Reflect.getMetadata(MetadataKeys.middleware, target, key) || [];

		Reflect.defineMetadata(
			MetadataKeys.middleware,
			[...middlewareArray, middleware],
			target,
			key
		);
	};
}
