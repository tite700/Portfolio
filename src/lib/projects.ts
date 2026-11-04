// Projects shown on /projects and as interactive spots in the /playground city.
// Content taken from davidb.iiens.net.

export type Vec3 = [number, number, number];

export type PoiKind =
	| 'gacha'
	| 'sakura'
	| 'statue'
	| 'arcade'
	| 'targets'
	| 'portal'
	| 'hand'
	| 'toaster';

export type Project = {
	slug: string;
	title: string;
	tags: string[];
	summary: string;
	url: string;
	poi: {
		kind: PoiKind;
		/** Name of the object in the city, shown in the tooltip. */
		label: string;
		position: Vec3;
		rotationY?: number;
		/** Collider box (width, height, depth) of the object. */
		size: Vec3;
	};
};

const ARTICLES = 'https://davidb.iiens.net/portfolio';

export const projects: Project[] = [
	{
		slug: 'modeling',
		title: 'Modeling and texturing',
		tags: ['Blender'],
		summary:
			'My Blender renders and animations, a log of my journey learning modeling, texturing and animation.',
		url: `${ARTICLES}/article_blender.html`,
		poi: { kind: 'statue', label: 'Statue on the plaza', position: [0, 0, 0], size: [2.4, 5, 2.4] }
	},
	{
		slug: 'garden-gacha',
		title: 'Garden Gacha VR',
		tags: ['Unity', 'C#', 'Blender'],
		summary: 'A VR gacha game set in a garden: pull capsules and grow your collection.',
		url: 'https://7benj7.itch.io/garden-gacha',
		poi: {
			kind: 'gacha',
			label: 'Gacha machine',
			position: [-48, 0, 10],
			size: [1.2, 2.2, 1.2]
		}
	},
	{
		slug: 'root',
		title: "Adrian's root",
		tags: ['Unity', 'C#'],
		summary: 'A Unity game about roots, published on itch.io.',
		url: 'https://tite700.itch.io/root',
		poi: {
			kind: 'sakura',
			label: 'Blooming sakura',
			position: [-48, 0, -48],
			size: [0.8, 3, 0.8]
		}
	},
	{
		slug: 'autobattle',
		title: 'Auto-Battle Arena',
		tags: ['Unity', 'C#'],
		summary:
			'My first game: an offline strategy auto-battler inspired by TFT and tower defense. Earn money by killing enemies, buy allied units, and watch them fight on their own.',
		url: `${ARTICLES}/article_autobattle.html`,
		poi: {
			kind: 'arcade',
			label: 'Arcade cabinet',
			position: [48, 0, -40],
			size: [1, 2.1, 0.9]
		}
	},
	{
		slug: 'fps',
		title: 'Competitive FPS Project',
		tags: ['Unreal Engine 5', 'C++'],
		summary:
			'A competitive multiplayer FPS in Unreal Engine 5: state synchronization, latency and jitter handling, server rewind for hit detection, matchmaking and sessions.',
		url: `${ARTICLES}/article_fps_competitif.html`,
		poi: {
			kind: 'targets',
			label: 'Shooting range',
			position: [-48, 0, 42],
			size: [6.4, 2.2, 0.4]
		}
	},
	{
		slug: 'crimson-xr',
		title: 'Crimson XR, Mixed Reality Game',
		tags: ['Unity', 'Blender'],
		summary: 'A mixed reality game that brings a crimson world into your room.',
		url: 'https://crimsonxr.fr/',
		poi: { kind: 'portal', label: 'Crimson portal', position: [48, 0, 48], size: [4.6, 5, 0.6] }
	},
	{
		slug: 'sign-vr',
		title: 'Sign VR',
		tags: ['C#', 'Meta XR SDK'],
		summary:
			'A VR app that teaches sign language on Meta headsets: hand tracking recognizes static and two-handed dynamic signs, plus facial expressions.',
		url: `${ARTICLES}/article_Sign_VR.html`,
		poi: { kind: 'hand', label: 'Giant hand', position: [0, 0, 57], size: [2, 4.5, 2] }
	},
	{
		slug: 'toastercat',
		title: 'ToasterCat Games',
		tags: ['Unreal Engine 5', 'C++', 'Blueprint', 'Perforce'],
		summary:
			'Team projects made in Unreal Engine 5: a cooperative futuristic FPS and a cooperative puzzle game.',
		url: `${ARTICLES}/article_toastercat.html`,
		poi: {
			kind: 'toaster',
			label: 'Giant toaster',
			position: [48, 0, 10],
			size: [3.4, 2.6, 2.2]
		}
	}
];
