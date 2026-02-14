// Shatterbox.d.ts

/// <reference types="@rbxts/types" />

declare namespace Shatterbox {
	// ===== TYPES =====

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

	/** Callback function invoked when a voxel is destroyed */
	export type OnVoxelDestruct = (voxel: Part, info: DestroyedVoxelInfo) => void;

	/** Callback invoked when a destruction operation completes */
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

	// ===== MAIN API =====

	/** Settings object for configuring Shatterbox behavior */
	export const Settings: Settings;

	/**
	 * Performs voxel destruction around the intersecting part.
	 * Operations are queued and processed over multiple frames.
	 */
	export function Destroy(
		intersectingPart: Part | Model | WorldInfo | DestructionParams,
		FilterTagged?: string | Array<string>,
		CleanupDelay?: number,
		OnVoxelDestruct?: string,
		GridSize?: number,
		SkipEncapsulatedVoxels?: boolean,
		OnDestructCompleted?: OnDestructCompleted,
		UserData?: Array<unknown>,
		ExcludePlayersReplication?: Array<Player>,
		SkipFloors?: boolean,
		SkipWalls?: boolean
	): void;

	/**
	 * Performs instant voxel destruction, yielding until the next Heartbeat.
	 * Returns imaginary voxels and existing debris.
	 */
	export function ImaginaryVoxels(
		intersectingPart: Part | Model | WorldInfo | ImaginaryDestructionParams,
		FilterTagged?: string | Array<string>,
		CleanupDelay?: number,
		GridSize?: number,
		SkipEncapsulatedVoxels?: boolean,
		ExcludePlayersReplication?: Array<Player>,
		SkipFloors?: boolean,
		SkipWalls?: boolean
	): LuaTuple<[Array<ImaginaryVoxel>, Array<BasePart>]>;

	/**
	 * Instantiates an imaginary voxel as a real Part.
	 * Automatically parents the voxel and gives it the DebrisTag unless specified.
	 */
	export function InstantiateImaginaryVoxel(
		imaginaryVoxel: ImaginaryVoxel,
		doNotGiveDebrisTag?: boolean
	): Part;

	/**
	 * Makes a voxel fall realistically with physics and replicates it to clients.
	 * Server-side only.
	 */
	export function Puppeteer(voxel: Part): void;

	/**
	 * Creates fake puppets on the client for testing (client-side only).
	 */
	export function FakeClientPuppets(fakePuppets: Array<Part>): void;

	/**
	 * Creates a hitbox object with additional functionality.
	 */
	export function CreateHitbox(): HitboxObject;

	/**
	 * Resets an area without reverting ownership of parts.
	 */
	export function ResetArea(area: Part | WorldInfo): void;

	/**
	 * Resets all modified parts to their original state.
	 */
	export function Reset(doNotRevertOwnership?: boolean): void;

	/**
	 * Cancels all ongoing destruction operations.
	 */
	export function ClearQueue(): void;

	/**
	 * Returns the original part associated with a DirtyGroupID.
	 */
	export function GetOriginalPart(dirtyGroupID: string): Part | undefined;

	/**
	 * Converts a point to voxel space distance relative to the voxel.
	 */
	export function VoxelDistanceVector(voxel: Part, point: Vector3): Vector3;

	/**
	 * Returns how many voxels a box has on each axis.
	 */
	export function VoxelCountVector(voxel: Part, boxSize: Vector3): Vector3;

	/**
	 * Returns true if the contains part is fully encapsulated by the part.
	 */
	export function PartEncapsulatesBlockPart(part: Part, contains: Part): boolean;

	/**
	 * Registers a callback function for voxel destruction.
	 */
	export function RegisterOnVoxelDestruct(name: string, callback: OnVoxelDestruct): void;

	/**
	 * Invokes a registered OnVoxelDestruct callback.
	 */
	export function OnVoxelDestruct(callbackName: string, voxel: Part, info?: DestroyedVoxelInfo): void;

	/**
	 * Voxelizes a part into an array of smaller parts.
	 */
	export function Voxelize(part: Part, gridSize: number): Array<Part>;

	/**
	 * Prints the current state of Shatterbox for debugging.
	 */
	export function PrintState(): void;

    /**
     * Use a new Settings config for Shatterbox.
     * @param settings Shatterbox's Settings
     */
    export function UseSettings(settings: Settings): void;

	/** Vertex math utilities */
	export const VertexMath: unknown;
}

export = Shatterbox;