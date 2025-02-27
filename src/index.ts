import { Dependency, Modding, Reflect } from "@flamework/core";
import { getIdFromSpecifier } from "@flamework/components/out/utility";
import type { Constructor } from "@flamework/core/out/utility";
import type { Components } from "@flamework/components";
import { t } from "@rbxts/t";

/** Gets the Flamework associated identifier or if not found, the class' `toString()` value */
export const getName = (object: object) => (Reflect.getMetadatas(object, "identifier")[0] as string)?.split("@")[1]
  ?? tostring(getmetatable(object));


/** @hidden */
function _getInstanceAtPath([paths]: string[][]): Instance | undefined {
  let instance: Instance | undefined = game;
  for (const path of paths) {
    if (instance === undefined) break;
    instance = instance.FindFirstChild(path);
  }

  return instance;
}

/**
 * Resolves the instance at the given path using Rojo
 *
 * @metadata macro intrinsic-arg-shift
 */
export function getInstanceAtPath<T extends string>(path: T, _meta?: Modding.Intrinsic<"path", [T]>): Instance | undefined {
  return _getInstanceAtPath(path as unknown as string[][]);
}

/**
 * Macro that generates a type guard (if one is not specified) then if the guard passes, returns the casted value
 *
 * @metadata macro
 */
export function safeCast<T>(value: unknown, guard?: t.check<T> | Modding.Generic<T, "guard">): T | undefined {
  return guard !== undefined ?
    (guard(value) ? value : undefined)
    : undefined;
}

/** Resolves all dependencies behind the `ctor` constructor */
export function resolveDependency<T extends object = object>(ctor: Constructor<T>): T | T[] {
  try {
    return Modding.resolveSingleton<T>(ctor);
  } catch (e) {
    const components = Dependency<Components>().getAllComponents(getIdFromSpecifier(ctor as Constructor));
    return components as T[];
  }
}

/** Calls `process` for every dependency resolved from `ctor` */
export function processDependency<T extends object = object, O = void>(ctor: Constructor<T>, process: (dependency: T) => O): O {
  const dependencies = resolveDependency<T>(ctor);
  const isArray = (dependencies as T[]).size() > 0;
  if (isArray) {
    let lastResult: O;
    for (const component of dependencies as T[])
      lastResult = process(component);

    return lastResult!;
  }

  return process(dependencies as T);
}

/** Calls the descriptor method for every dependency resolved from `ctor` */
export function callMethodOnDependency<Args extends unknown[], O = void>(ctor: object, descriptor: TypedPropertyDescriptor<(this: unknown, ...args: Args) => O>, ...args: Args): O {
  return processDependency(ctor as Constructor, dependency => descriptor.value(dependency, ...args))
}