/// <reference types="@rbxts/types" />

import type { HitboxObject, DestructionParams, Settings, WorldInfo, OnDestructCompleted, ImaginaryDestructionParams, ImaginaryVoxel, DestroyedVoxelInfo, OnVoxelDestruct, EffectHook } from "./types";

declare class Shatterbox {
	/** Settings object for configuring Shatterbox behavior */
	public readonly Settings: Settings;
	public readonly VertexMath: unknown;

	constructor(settings: Settings);

	public registerEffects(domainType: 'Server' | 'Client' | 'Shared', effectHooks: EffectHook): void;
	public startup(): void;

	/**
	 * Performs voxel destruction around the intersecting part.
	 * Operations are queued and processed over multiple frames.
	 */
	public Destroy(
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
	public ImaginaryVoxels(
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
	public InstantiateImaginaryVoxel(
		imaginaryVoxel: ImaginaryVoxel,
		doNotGiveDebrisTag?: boolean
	): Part;

	/**
	 * Makes a voxel fall realistically with physics and replicates it to clients.
	 * Server-side only.
	 */
	public Puppeteer(voxel: Part): void;

	/**
	 * Creates fake puppets on the client for testing (client-side only).
	 */
	public FakeClientPuppets(fakePuppets: Array<Part>): void;

	/**
	 * Creates a hitbox object with additional functionality.
	 */
	public CreateHitbox(): HitboxObject;

	/**
	 * Resets an area without reverting ownership of parts.
	 */
	public ResetArea(area: Part | WorldInfo): void;

	/**
	 * Resets all modified parts to their original state.
	 */
	public Reset(doNotRevertOwnership?: boolean): void;

	/**
	 * Cancels all ongoing destruction operations.
	 */
	public ClearQueue(): void;

	/**
	 * Returns the original part associated with a DirtyGroupID.
	 */
	public GetOriginalPart(dirtyGroupID: string): Part | undefined;

	/**
	 * Converts a point to voxel space distance relative to the voxel.
	 */
	public VoxelDistanceVector(voxel: Part, point: Vector3): Vector3;

	/**
	 * Returns how many voxels a box has on each axis.
	 */
	public VoxelCountVector(voxel: Part, boxSize: Vector3): Vector3;

	/**
	 * Returns true if the contains part is fully encapsulated by the part.
	 */
	public PartEncapsulatesBlockPart(part: Part, contains: Part): boolean;

	/**
	 * Registers a callback function for voxel destruction.
	 */
	public RegisterOnVoxelDestruct(name: string, callback: OnVoxelDestruct): void;

	/**
	 * Invokes a registered OnVoxelDestruct callback.
	 */
	public OnVoxelDestruct(callbackName: string, voxel: Part, info?: DestroyedVoxelInfo): void;

	/**
	 * Voxelizes a part into an array of smaller parts.
	 */
	public Voxelize(part: Part, gridSize: number): Array<Part>;

	/**
	 * Prints the current state of Shatterbox for debugging.
	 */
	public PrintState(): void;

    /**
     * Use a new Settings config for Shatterbox.
     * @param settings Shatterbox's Settings
     */
    public UseSettings(settings: Settings): void;
}

export = Shatterbox;