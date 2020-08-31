import { RequestHandler } from 'express';
import 'reflect-metadata';
import { MetadataKeys } from './MetadataKeys';
import { HttpMethod } from './Methods';

interface RouteHandlerDescriptor extends PropertyDescriptor {
	value?: RequestHandler;
}

function methodBinder(method: string) {
	return function (path: string) {
		return function (target: any, key: string, desc: RouteHandlerDescriptor) {
			Reflect.defineMetadata(MetadataKeys.path, path, target, key);
			Reflect.defineMetadata(MetadataKeys.method, method, target, key);
		};
	};
}

export const get = methodBinder(HttpMethod.get);
export const put = methodBinder(HttpMethod.put);
export const post = methodBinder(HttpMethod.post);
export const del = methodBinder(HttpMethod.del);
