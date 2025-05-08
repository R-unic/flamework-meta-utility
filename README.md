# @rbxts/flamework-meta-utils
Metadata utility and utility macros for Flamework

## Macros

### deunify&lt;T&gt;()
Deunifies a union type `T` into an array of all constituents
```ts
const constituents = deunify<"a" | "b" | "c">();
```

Compiles to
```lua
local constituents = deunify({"a", "b", "c"}) -- which returns the passed param
```

### repeatString&lt;S, N&gt;()
Repeats the string `S` `N` times.
```ts
const line = repeatString<"-", 30>();
```

Compiles to
```lua
local line = "------------------------------";
```

### getChildrenOfType&lt;T&gt;()
Generates a type guard (if one is not specified) and returns all children of the given instance that pass the guard.
```ts
interface CharacterModel extends Model {
  Humanoid: Humanoid;
  HumanoidRootPart: Part;
}

const characters = getChildrenOfType<CharacterModel>(Workspace.Characters);
```

### getDescendantsOfType&lt;T&gt;()
Generates a type guard (if one is not specified) and returns all descendants of the given instance that pass the guard.
```ts
const assetsToPreload = getDescendantsOfType<Decal | Texture | MeshPart>(ReplicatedStorage);
```

### getInstanceAtPath()
Resolves the instance at the given path using Rojo
```ts
const mouseControllerModule = getInstanceAtPath("src/client/controllers/mouse.ts");
```

### safeCast&lt;T&gt;()
Generates a type guard (if one is not specified) and if the guard passes, returns the casted value. Otherwise returns undefined.
```ts
const value = safeCast<number>(someUnknownValue);
if (value !== undefined)
  print("doubled value:", value * 2)
```
```ts
interface CharacterModel extends Model {
  Humanoid: Humanoid;
  HumanoidRootPart: Part;
}

const character = safeCast<CharacterModel>(Players.LocalPlayer.Character);
if (character !== undefined)
  print("character root:", character.HumanoidRootPart)
```
## Methods

These next three methods are generally used in combination with decorators.
### resolveDependencies()
Takes a constructor and resolves it and all of it's dependencies

### processDependencies()
Calls the provided method for each dependency resolved from the provided constructor

### callMethodOnDependencies()
Calls the method from the provided method descriptor for each dependency resolved from the provided constructor
