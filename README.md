# ExpressJS with TypeScript

## Purpose of Project

Integration of [TypeScript](https://typescriptlang.org) with [ExpressJS](https://expressjs.com)

## Ways of Integration

- Use basic type annotation from typescript

- Use a third-party library for helper functions

- Make your own library by twisting code

## Our Way

Make Your Own Library (with the)

- Use of **Decorators**

- Use of [**reflect-metadata**](https://npmjs.com/package/reflect-metadata)

## Implementation of Decorators

1. **controller** - used on a controller class - the place where all decorator functionality is inserted into the express middleware stack

```ts
//factory decorator
function controller(routePrefix: string) {
	//decorator
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
```

2. **methodBinder** - used on a routeHandler method in a controller class

```ts
interface RouteHandlerDescriptor extends PropertyDescriptor {
	value?: RequestHandler;
}

//bind a method to a route
function methodBinder(method: string) {
	//factory decorator
	return function (path: string) {
		//decorator
		return function (target: any, key: string, desc: RouteHandlerDescriptor) {
			Reflect.defineMetadata(MetadataKeys.path, path, target, key);
			Reflect.defineMetadata(MetadataKeys.method, method, target, key);
		};
	};
}

const get = methodBinder(HttpMethod.get);
const put = methodBinder(HttpMethod.put);
const post = methodBinder(HttpMethod.post);
const del = methodBinder(HttpMethod.del);
```

3. **bodyValidator** - used for checking the presence of required params on the body of Request

```ts
//factory decorator
function bodyValidator(...params: string[]) {
	//decorator
	return function (target: any, key: string, desc: PropertyDescriptor) {
		Reflect.defineMetadata(MetadataKeys.validator, params, target, key);
	};
}
```

4. **use** - used to add middleware functions to the middleware stack

```ts
//factory decorator
function use(middleware: RequestHandler) {
	//decorator
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
```

#### Credits

[Stephen Grider](https://twitter.com/ste_grider)
