import 'reflect-metadata';
import { MetadataKeys } from './MetadataKeys';

export function bodyValidator(...params: string[]) {
	return function (target: any, key: string, desc: PropertyDescriptor) {
		Reflect.defineMetadata(MetadataKeys.validator, params, target, key);
	};
}
