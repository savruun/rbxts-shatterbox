/** Represents a 3D hitbox for destruction operations */
export interface Hitbox {
    CFrame: CFrame;
    Size: Vector3;
    Shape: Enum.PartType;
}

/** World information used for area-based operations */
export interface WorldInfo {
    CFrame: CFrame;
    Size: Vector3;
}

/** Information about a destroyed voxel passed to callbacks */
export interface DestroyedVoxelInfo {
    DirtyGroupID?: string;
    CuttingPart?: Hitbox;
    IsEdge?: boolean;
    IsAlreadyDebris?: boolean;
    UserData?: Array<unknown>;
}

export type OnVoxelDestruct = (voxel: Part, info: DestroyedVoxelInfo) => void;

export type OnDestructCompleted = (
		destroyedVoxelCount: number,
		affectedDirtyGroups: Map<string, boolean>
	) => void;

/** An imaginary voxel that hasn't been instantiated yet */
export interface ImaginaryVoxel {
    CFrame: CFrame;
    Size: Vector3;
    DirtyGroupID: string;
    DestructionID: string;
    GridSize: number;
    isEdge?: boolean;
}

/** Parameters for destruction operations */
export interface DestructionParams {
    /** The cutting part or hitbox performing the destruction */
    CuttingPart?: Part | Model | Hitbox;
    /** Alternative syntax: provide CFrame, Size, and Shape directly */
    CFrame?: CFrame;
    Size?: Vector3;
    Shape?: Enum.PartType;
    /** Filter destruction to only parts with these tags */
    FilterTagged?: string | Array<string>;
    /** Delay before cleaning up destroyed parts (smooth cleanup) */
    CleanupDelay?: number;
    /** Name of the registered OnVoxelDestruct callback */
    OnVoxelDestruct?: string;
    /** Grid size for voxelization */
    GridSize?: number;
    /** Skip creating voxels that are fully encapsulated */
    SkipEncapsulatedVoxels?: boolean;
    /** Callback invoked when destruction completes */
    OnDestructCompleted?: OnDestructCompleted;
    /** Custom user data passed to callbacks */
    UserData?: Array<unknown>;
    /** Players to exclude from replication (server-side only) */
    ExcludePlayersReplication?: Player | Array<Player>;
    /** Skip destroying floor surfaces */
    SkipFloors?: boolean;
    /** Skip destroying wall surfaces */
    SkipWalls?: boolean;
    /** Unique identifier for this destruction operation */
    ID?: string;
}

/** Parameters specific to imaginary voxel operations */
export interface ImaginaryDestructionParams extends Omit<DestructionParams, "OnVoxelDestruct" | "OnDestructCompleted"> {}

/** Settings configuration object */
export interface Settings {
    /** Whether to use client-server replication */
    USE_CLIENT_SERVER: boolean;
    /** Default grid size for voxelization */
    DefaultGridSize: number;
    /** Default smooth cleanup delay in seconds */
    DefaultSmoothCleanupDelay: number;
    /** Whether to use smooth cleanup */
    UseSmoothCleanup: boolean;
    /** Whether to use greedy meshing optimization */
    UseGreedyMeshing: boolean;
    /** Number of concurrent greedy meshing workers */
    GMWorkerCount: number;
    /** Traversals per frame for greedy meshing */
    GMTraversalsPerFrame: number;
    /** Part creations per frame for greedy meshing */
    GMPartCreationsPerFrame: number;
    /** Maximum divisions per frame */
    MaxDivisionsPerFrame: number;
    /** Maximum operations per frame */
    MaxOpsPerFrame: number;
    /** Whether to use priority queue for operations */
    UsePriorityQueue: boolean;
    /** Number of recent operations to prioritize */
    PrioritizeRecentN: number;
    /** Maximum puppet count for replication */
    PuppetMaxCount: number;
    /** Puppet replication frequency in Hz */
    PuppetReplicationFrequency: number;
    /** Velocity threshold for puppet sleep */
    PuppetSleepVelocity: number;
    /** Timeout before anchoring sleeping puppets */
    PuppetAnchorTimeout: number;
    /** Whether to tween puppets on client */
    ClientTweenPuppets: boolean;
    /** Distance limit for client-side tweening */
    ClientTweenDistanceLimit: number;
    /** Behavior for non-divisible parts */
    NonDivisibleInteraction: "NONE" | "FALL" | "REMOVE";
    /** Custom instance skip check function */
    SkipInstanceCheck: (instance: Instance) => boolean;
}

/** A hitbox object with additional functionality */
export interface HitboxObject {
    CFrame: CFrame;
    Size: Vector3;
    Shape: Enum.PartType;
    DestructDelay?: number;
    FilterTagged?: string | Array<string>;
    OnVoxelDestruct?: string;
    UserData: Array<unknown>;
    ExcludePlayersReplication: Array<Player>;
    OnDestructCompleted?: OnDestructCompleted;
    CleanupDelay?: number;
    GridSize?: number;
    SkipEncapsulatedVoxels?: boolean;
    SkipWalls?: boolean;
    SkipFloors?: boolean;
    DestructionType: "DEFAULT" | "IMAGINARY";
    ImaginaryCallback?: (imaginaryVoxels: Array<ImaginaryVoxel>, existingDebris: Array<BasePart>) => void;
    StartConnectionEvent: RBXScriptSignal;
    WeldConnectionEvent: RBXScriptSignal;
    VelocityPrediction: boolean;
    VelocityBias?: number;

    /** Performs voxel destruction around the hitbox */
    Destroy(): void;
    /** Returns imaginary voxels bounded by the hitbox */
    ImaginaryVoxels(): LuaTuple<[Array<ImaginaryVoxel>, Array<BasePart>]>;
    /** Welds the hitbox to follow a part */
    WeldTo(part: BasePart): void;
    /** Unwelds the hitbox */
    Unweld(): void;
    /** Starts continuous destruction */
    Start(): void;
    /** Stops continuous destruction */
    Stop(): void;
    /** Destroys the hitbox and disconnects all connections */
    DestroyHitbox(): void;
}

export type EffectHook = (voxel: BasePart, info: DestroyedVoxelInfo) => void;

export type ClientEffectName<T extends string> = 'Default' | 'Rough' | T
export type ServerEffectName<T extends string> = 'Default' | 'MappingVoxelSpace' | 'BumpyFloorBreakWalls' | T
