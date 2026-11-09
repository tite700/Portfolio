// Game state shared between the 3D scene and the HTML overlay.
export const game = $state({
	skating: false,
	/** Touch joystick, x right / y down in [-1, 1]; `active` while a finger holds it. */
	stick: { x: 0, y: 0, active: false },
	/** Touch buttons, consumed by the player on the next physics step. */
	actions: { jump: false, respawn: false },
	/** Player on the ground plane, for the minimap. */
	player: { x: 0, z: 0, heading: Math.PI },
	/** Last trick done in the air, shown as a popup (`id` restarts its animation). */
	trick: null as { name: string; combo: number; id: number } | null,
	/** Project whose spot the player is standing next to. */
	nearSlug: null as string | null,
	/** Project open in the overlay. */
	openSlug: null as string | null
});
