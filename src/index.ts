import { Dependency, Modding, Reflect } from "@flamework/core";
import { getIdFromSpecifier } from "@flamework/components/out/utility";
import type { Constructor } from "@flamework/core/out/utility";
import type { Components } from "@flamework/components";

interface MethodDescriptor<T extends Callback = Callback> {
	readonly value: T;
}

/** Gets the Flamework associated identifier or if not found, the class' `toString()` value */
export const getName = (object: object) => (<string>Reflect.getMetadatas(object, "identifier")[0])?.split("@")[1] ?? tostring(getmetatable(object));

/** Resolves all dependencies behind the `ctor` constructor */
export function resolveDependency<T extends object = object>(ctor: Constructor<T>): T | T[] {
	try {
		return <T>Modding.resolveSingleton<T>(ctor);
	} catch (e) {
		const components = Dependency<Components>().getAllComponents(getIdFromSpecifier(<Constructor>ctor));
		return <T[]>components;
	}
}

/** Calls `process` for every dependency resolved from `ctor` */
export function processDependency<T extends object = object, O = void>(ctor: Constructor<T>, process: (dependency: T) => O): O {
	const dependencies = resolveDependency<T>(ctor);
	const isArray = (<T[]>dependencies).size() > 0;
	if (isArray) {
		let lastResult: O;
		for (const component of <T[]>dependencies)
			lastResult = process(component);

		return lastResult!;
	}

	return process(<T>dependencies);
}

/** Calls the descriptor method for every dependency resolved from `ctor` */
export function callMethodOnDependency<Args extends unknown[], O = void>(ctor: object, descriptor: MethodDescriptor<(self: unknown, ...args: Args) => O>, ...args: Args): O {
	return processDependency(<Constructor>ctor, dependency => descriptor.value(dependency, ...args))
}