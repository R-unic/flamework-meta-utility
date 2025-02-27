# @rbxts/flamework-meta-utils
Metadata utility for Flamework

## Methods

### getInstanceAtPath()
Resolves the instance at the given path using Rojo
```ts
const mouseControllerModule = getInstanceAtPath("src/client/controllers/mouse.ts");
```

### safeCast&lt;T&gt;()
Macro that generates a type guard (if one is not specified) and if the guard passes, returns the casted value. Otherwise returns undefined.
```ts
const value = safeCast<number>(someUnknownValue);
if (value !== undefined)
  print("doubled value:", value * 2)
```

```ts
const character = safeCast<CharacterModel>(Players.LocalPlayer.Character);
if (character !== undefined)
  print("character root:", character.HumanoidRootPart)
```

### resolveDependencies()
Takes a constructor and resolves it and all of it's dependencies

### processDependencies()
Calls the provided method for each dependency resolved from the provided constructor

### callMethodOnDependencies()
Calls the method from the provided method descriptor for each dependency resolved from the provided constructor