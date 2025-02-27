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
 * Macro that generates a type guard (if one is not specified) and if the guard passes, returns the casted value.
 * Otherwise returns undefined.
 *
 * @metadata macro
 */
export function safeCast<T>(value: unknown, guard?: t.check<T> | Modding.Generic<T, "guard">): T | undefined {
  return guard !== undefined ?
    (guard(value) ? value : undefined)
    : undefined;
}

/** Takes a constructor and resolves it and all of it's dependencies */
export function resolveDependencies<T extends object = object>(ctor: Constructor<T>): T[] {
  const isComponent = Reflect.hasMetadata(ctor, "intrinsic-component-decorator");
  if (!isComponent)
    return [Modding.resolveSingleton<T>(ctor)];

  const components = Dependency<Components>().getAllComponents(getIdFromSpecifier(ctor as Constructor));
  return components as T[];
}

/** Calls `process` for every dependency resolved from `ctor` */
export function processDependencies<T extends object = object, O = void>(ctor: Constructor<T>, process: (dependency: T) => O): O extends void ? void : O[] {
  const dependencies = resolveDependencies<T>(ctor);
  const results: O[] = [];
  for (const component of dependencies)
    (results as defined[]).push(process(component)!);

  return results as O extends void ? void : O[];
}

/** Calls the descriptor method for every dependency resolved from `ctor` */
export function callMethodOnDependencies<Args extends unknown[], O = void>(
  ctor: object,
  descriptor: TypedPropertyDescriptor<(this: unknown, ...args: Args) => O>,
  ...args: Args
): O extends void ? void : O[] {
  return processDependencies(ctor as Constructor, dependency => descriptor.value(dependency, ...args));
}