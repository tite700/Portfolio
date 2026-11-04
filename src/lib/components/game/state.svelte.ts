// Game state shared between the 3D scene and the HTML overlay.
export const game = $state({
	skating: false,
	/** Project whose spot the player is standing next to. */
	nearSlug: null as string | null,
	/** Project open in the overlay. */
	openSlug: null as string | null
});
