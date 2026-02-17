<div align="center">
  <p>
    <img src=https://i.imgur.com/j2pg7CB.png />
  </p>
</div>

<div align="center">
  <a href=https://www.npmjs.com/package/@kunosyn/shatterbox>
    <img src=https://img.shields.io/npm/v/@kunosyn/shatterbox />
  </a>
  <a href=https://www.npmjs.com/package/@kunosyn/shatterbox>
    <img src=https://img.shields.io/npm/dt/@kunosynshatterbox />
  </a>
</div>

## About


> [!IMPORTANT]
> I am also NOT currently in the rbxts org, this means you will have to drag shatterbox into your node_modules/@rbxts folder before use.


### Installation
> Install package via [NPM](https://www.npmjs.com/package/@kunosyn/shatterbox):
```sh
npm i @kunosyn/shatterbox
```

> Add path to tsconfig.json in compilerOptions.typeRoots
```sh
"typeRoots": ["node_modules/@kunosyn", ...]
```

> Add path to @kunosyn to default.project.json in rbxts_include/node_modules.
```sh
"ReplicatedStorage": {
  "$className": "ReplicatedStorage",
  "rbxts_include": {
    "$path": "include",
    "node_modules": {
      "$className": "Folder",
      "@kunosyn": {
        "$path": "node_modules/@kunosyn"
      }
    }
  },
}
```

*Done!*

### Usage Example
Here's some basic examples of using the shatterbox module:


> Server Initialization
```ts
import Shatterbox from '@kunosyn/shatterbox'

const shatterbox = new Shatterbox()

shatterbox.Start()

// Registers one of the default effects.
shatterbox.RegisterOnVoxelDestruct('BumpyFloorBreakWalls', shatterbox.DefaultEffects.BumpyFloorBreakWalls)
```


> Client Initialization
```ts
import Shatterbox from '@kunosyn/shatterbox'

const shatterbox = new Shatterbox()

shatterbox.Start()
```

> Jujustu Shenanigans Styled Destruction (Server)
```ts
import Shatterbox from '@kunosyn/shatterbox'

const shatterbox = new Shatterbox()

shatterbox.Start()

// Registers one of the default effects.
shatterbox.RegisterOnVoxelDestruct('BumpyFloorBreakWalls', shatterbox.DefaultEffects.BumpyFloorBreakWalls)

// Create a Hitbox Instance
const hb = this.shatterbox.CreateHitbox()
hb.Size = Vector3.one.mul(10) // Sets the hitbox size
hb.OnVoxelDestruct = 'BumpyFloorBreakWalls' // Sets the Destruction Effect
hb.CleanupDelay = 10 // How long to wait until cleanup

// Replace with your networking solution of choice.
Events.M1.Connect((player, hitPosition, normal) => {
  const char = player.Character || player.CharacterAdded.Wait()[0]
  const hrp = char.WaitForChild('HumanoidRootPart') as BasePart

  hb.CFrame = new CFrame(hit) // Sets the position of the hitbox
  hb.UserData['CastOrigin'] = hrp.Position // Sets the cast origin.
  hb.Destroy() // Destructs the voxels in the hitbox.
})
```