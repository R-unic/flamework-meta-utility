import type { Modding } from "@flamework/core";
import type { t } from "@rbxts/t";

/** @metadata macro */
export function getChildrenOfType<T extends Instance>(
  instance: Instance,
  guard: t.check<T> | Modding.Generic<T, "guard"> = (v): v is T => false
): T[] {
  return instance.GetChildren().filter(guard);
}

/** @metadata macro */
export function getDescendantsOfType<T extends Instance>(
  instance: Instance,
  guard: t.check<T> | Modding.Generic<T, "guard"> = (v): v is T => false
): T[] {
  return instance.GetDescendants().filter(guard);
}

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
 * @metadata macro intrinsic-arg-shift {@link _getInstanceAtPath intrinsic-flamework-rewrite}
 */
export function getInstanceAtPath<Path extends string>(path: Path, _meta?: Modding.Intrinsic<"path", [Path]>): Instance | undefined {
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