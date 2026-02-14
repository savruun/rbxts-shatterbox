<div align="center">
  <p>
    <img src=https://i.imgur.com/EEJZQKb.png />
  </p>
</div>

<div align="center">
  <a href=https://www.npmjs.com/package/rbxts-vex>
    <img src=https://img.shields.io/npm/v/rbxts-vex />
  </a>
  <a href=https://www.npmjs.com/package/rbxts-vex>
    <img src=https://img.shields.io/npm/dt/rbxts-vex />
  </a>
</div>

## About
An efficient, performance-minded voxel destruction model.
Created by EternalEthel/qrisquinn. Ported to Typescript for rbxts by savruun.

> [!IMPORTANT]
> This package is a port of [Vex 2.0](https://devforum.roblox.com/t/vex-20-remastered-for-your-voxel-destruction-needs/1619456) last updated in January of 2022 meaning this package is not updated anymore. I am also NOT currently in the rbxts org, this means you will have to drag rbxts-vex into your node_modules/@rbxts folder before use.


### Installation
Install package via [NPM](https://www.npmjs.com/package/rbxts-vex):

```sh
npm i rbxts-vex
```

Drag rbxts-vex folder into node_modules/@rbxts.

*Done!*

### Usage Example
Here's some basic examples of using the vex module:


> Destructible walls.

```ts
import { Workspace } from '@rbxts/services';
import Vex from 'rbxts-vex';

const wall = Workspace.WaitForChild('Wall') as Part
const projectile = Workspace.WaitForChild('Projectile') as Part

const structure = new Vex(wall, {
  voxelSize: 2,
  lifetime: 15
})

projectile.Touched.Connect((hit) => {
  if (hit === wall) {
    structure.Destroy()
    structure.ApplyForce(projectile.AssemblyLinearVelocity.mul(10), projectile.Position)
  }
})
```

> Timed demolition.

```ts
import { Workspace } from '@rbxts/services';
import Vex from 'rbxts-vex';

const building = Workspace.WaitForChild('Building') as Model;

task.wait(3)

const structure = new Vex(building, {
    voxelSize: 2,
    lifetime: 30,
    weldAdjacent: false // Let the pieces fall independently.
})

structure.Destroy()
structure.ApplyForce(new Vector3(0, 1200, 0), building.PrimaryPart.Position);
```
