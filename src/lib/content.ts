// Projects and hobbies: each one has an article page and a spot in the /playground city.
// Content ported from the old site (davidb.iiens.net).

import { level, rad } from './level';

export type Vec3 = [number, number, number];

export type ModelKind =
	| 'gacha'
	| 'sakura'
	| 'statue'
	| 'arcade'
	| 'targets'
	| 'portal'
	| 'hand'
	| 'toaster'
	| 'awale'
	| 'volley'
	| 'football'
	| 'gaming'
	| 'council'
	| 'books'
	| 'snowboard'
	| 'bearboat'
	| 'bearscouts'
	| 'loot'
	| 'plundr'
	| 'witchgrove'
	| 'vineyard';

export type Spot = {
	section: Section;
	slug: string;
	title: string;
	tags: string[];
	summary: string;
	/** Article paragraphs. */
	body: string[];
	list?: string[];
	links?: { label: string; href: string }[];
	/** Images and .mp4 videos; the first image is the card cover. */
	media?: string[];
	/** White icon shown on the card when there is no cover. */
	icon?: string;
	poi: {
		kind: ModelKind;
		/** Name of the object in the city, shown in the tooltip. */
		label: string;
		/** Set by the esplanade layout below. */
		position: Vec3;
		rotationY: number;
		/** Collider box (width, height, depth) of the object. */
		size: Vec3;
	};
};

export type Section = 'work' | 'projects' | 'hobbies';

// The city has one district per section: work east, projects in the middle, hobbies west.
export const sections: Record<Section, { title: string; color: string }> = {
	work: { title: 'Work', color: '#fb923c' },
	projects: { title: 'Projects', color: '#38bdf8' },
	hobbies: { title: 'Hobbies', color: '#f472b6' }
};

export const href = (spot: Spot) => `/${spot.section}/${spot.slug}`;

// The city: a spawn plaza with one esplanade per section around it.
// The layout lives in level.json, edited with /editor.
export const SPAWN: Vec3 = [level.spawn.x, 1, level.spawn.z];
export const esplanades = Object.fromEntries(
	Object.entries(level.esplanades).map(([k, e]) => [k, { center: [e.x, e.z], radius: e.radius }])
) as Record<Section, { center: [number, number]; radius: number }>;

type SpotData = Omit<Spot, 'section' | 'poi'> & {
	poi: Omit<Spot['poi'], 'position' | 'rotationY'>;
};

// Spots use their place from level.json; a new spot not placed yet goes on a ring
// around its esplanade, facing the middle, leaving the entrance (spawn side) free.
function place(section: Section, list: SpotData[]): Spot[] {
	const { center, radius } = esplanades[section];
	const entrance = Math.atan2(SPAWN[0] - center[0], SPAWN[2] - center[1]);
	return list.map((s, i) => {
		const a = entrance + ((i + 0.5) / list.length) * Math.PI * 2;
		const placed = level.spots[s.slug] ?? {
			x: center[0] + Math.sin(a) * radius,
			z: center[1] + Math.cos(a) * radius,
			rotation: ((a + Math.PI) * 180) / Math.PI
		};
		const position: Vec3 = [placed.x, 0, placed.z];
		return { ...s, section, poi: { ...s.poi, position, rotationY: rad(placed.rotation) } };
	});
}

const IMG = '/images';

export const projects = place('projects', [
	{
		slug: 'modeling',
		title: 'Modeling and texturing',
		tags: ['Blender'],
		summary:
			'My Blender renders and animations, a log of my journey learning modeling, texturing and animation.',
		body: [
			'This page gathers some of my Blender renders and animations.',
			'Follow me along my journey learning modeling, texturing and animation: new pieces land here as I learn new skills.'
		],
		media: [
			`${IMG}/chateau.png`,
			`${IMG}/citrouille.png`,
			`${IMG}/Donut_finale_10001-0300.mp4`,
			`${IMG}/fusee1.mp4`,
			`${IMG}/rendu_cactus.png`,
			`${IMG}/potion.png`
		],
		poi: {
			kind: 'statue',
			label: 'Statue',
			size: [2.4, 5, 2.4]
		}
	},
	{
		slug: 'garden-gacha',
		title: 'Garden Gacha VR',
		tags: ['Unity', 'C#', 'Blender'],
		summary: 'A VR gacha game set in a garden: pull capsules and grow your collection.',
		body: [
			'An immersive VR gardening game with gacha mechanics and random seed generation, built around raising awareness of permaculture.'
		],
		links: [{ label: 'Play on itch.io', href: 'https://7benj7.itch.io/garden-gacha' }],
		media: [`${IMG}/garden_gacha.png`],
		poi: { kind: 'gacha', label: 'Gacha machine', size: [1.2, 2.2, 1.2] }
	},
	{
		slug: 'root',
		title: "Adrian's root",
		tags: ['Unity', 'C#'],
		summary: 'A Unity game about roots, published on itch.io.',
		body: ['A Unity game about roots, published on itch.io.'],
		links: [{ label: 'Play on itch.io', href: 'https://tite700.itch.io/root' }],
		media: [`${IMG}/adriansroot.png`],
		poi: { kind: 'sakura', label: 'Blooming sakura', size: [0.8, 3, 0.8] }
	},
	{
		slug: 'autobattle',
		title: 'Auto-Battle Arena',
		tags: ['Unity', 'C#'],
		summary:
			'My first game: an offline strategy auto-battler inspired by TFT and tower defense. Earn money by killing enemies, buy allied units, and watch them fight on their own.',
		body: [
			'Auto-Battle Arena is my first game: a strategic offline auto-battler, playable on PC and made with Unity.',
			'It has a tutorial and a main level. A battle starts with allied units facing enemy units. You earn money by killing enemies and spend it on new allied units. The units fight on their own.',
			'The game is inspired by TFT and the tower defense genre.'
		],
		media: [`${IMG}/Autobattle.png`],
		poi: { kind: 'arcade', label: 'Arcade cabinet', size: [1, 2.1, 0.9] }
	},
	{
		slug: 'fps',
		title: 'Competitive FPS Project',
		tags: ['Unreal Engine 5', 'C++'],
		summary:
			'A competitive multiplayer FPS in Unreal Engine 5: state synchronization, latency and jitter handling, server rewind for hit detection, matchmaking and sessions.',
		body: [
			'In this project, we developed a competitive first-person shooter in Unreal Engine 5. The course covered a wide range of topics needed to build a multiplayer FPS.'
		],
		list: [
			'Network basics and the history of multiplayer games',
			'Creating a competitive FPS in Unreal Engine 5',
			'Game state synchronization',
			'Handling latency, jitter and network reliability',
			'Network programming elasticity',
			'Security in network programming',
			'Game servers',
			'Online services',
			'Server rewind for accurate hit detection despite network delays',
			'Full online features, including matchmaking and session management'
		],
		media: [`${IMG}/Double_A_preview.png`],
		poi: {
			kind: 'targets',
			label: 'Shooting range',
			size: [6.4, 2.2, 0.4]
		}
	},
	{
		slug: 'sign-vr',
		title: 'Sign VR',
		tags: ['C#', 'Meta XR SDK'],
		summary:
			'A VR app that teaches sign language on Meta headsets: hand tracking recognizes static and two-handed dynamic signs, plus facial expressions.',
		body: [
			'SignVR is a VR application that teaches sign language on a Meta headset.',
			"The app tracks the user's hands and compares their gestures with a database of predefined signs. When the gesture is right, it is validated and you move on to the next letter or word.",
			'SignVR supports static hand signs (alphabet letters) and dynamic two-handed gestures. It also uses face tracking for simple interactions: smiling, nodding, closing your eyes…',
			'The .apk build for Meta headsets can be downloaded, and a video demo (not the final version) is on YouTube.'
		],
		links: [
			{
				label: 'Download the .apk',
				href: 'https://drive.google.com/file/d/1MHU9iK3H7VjbdZBSPvGIAIMgyJptuRnC/view?usp=sharing'
			},
			{ label: 'Watch the video', href: 'https://www.youtube.com/watch?v=HPrIQmprVc0' }
		],
		media: [`${IMG}/signVR.jpg`],
		poi: { kind: 'hand', label: 'Giant hand', size: [2, 4.5, 2] }
	},
	{
		slug: 'toastercat',
		title: 'ToasterCat Games',
		tags: ['Unreal Engine 5', 'C++', 'Blueprint', 'Perforce'],
		summary:
			'Team projects made in Unreal Engine 5: a cooperative futuristic FPS and a cooperative puzzle game.',
		body: [
			'ToasterCat is a team making games in Unreal Engine 5, with Blueprint and C++.',
			'Cooperative FPS: intense cooperative gameplay in a futuristic setting.',
			'Cooperative puzzle game: solve intricate puzzles together in a mysterious place.'
		],
		links: [
			{ label: 'Co-op FPS on itch.io', href: 'https://martinfond.itch.io/coopfps' },
			{ label: 'Co-op puzzle on itch.io', href: 'https://martinfond.itch.io/uqartingvr' },
			{ label: 'Co-op FPS gameplay', href: 'https://youtu.be/x6Ze6o3bEEw' },
			{ label: 'Co-op puzzle gameplay', href: 'https://youtu.be/mda-PeA5Ddk' }
		],
		media: [`${IMG}/toaster_cat_2.png`],
		poi: { kind: 'toaster', label: 'Giant toaster', size: [3.4, 2.6, 2.2] }
	},
	{
		slug: 'awale',
		title: 'Awale in AR',
		tags: ['A-Frame', 'AR', 'JavaScript'],
		summary:
			'The Awale board game in augmented reality: scan a flat surface with your phone and play with two players, no board needed.',
		body: [
			'This game is based on Awale, with one goal: make it playable with just a phone.',
			'Scan a flat surface, then play Awale with two players. No real board or anything else needed.'
		],
		links: [{ label: 'Play Awale (phone)', href: '/awale/awale.html' }],
		media: [`${IMG}/awale_screen.jpg`],
		poi: { kind: 'awale', label: 'Awale table', size: [2.8, 1.2, 1.4] }
	}
]);

const ICON = `${IMG}/hobbies`;

export const hobbies = place('hobbies', [
	{
		slug: 'volleyball',
		title: 'Volleyball',
		tags: ['Since 2016', 'Team captain'],
		summary: 'Three years of competitive volleyball as team captain, and still playing for fun.',
		body: [
			'I started volleyball in 2016 and played competitively for 3 years, before stopping to focus on my studies.',
			'I was the captain of my team: I had a strong mindset and was used to being a vocal leader in my previous video game team.',
			'In only 3 years, I became so passionate about this sport that I keep playing for fun whenever I can.',
			'My favorite team is the French national team, and my favorite player is Jenia Grebennikov.'
		],
		icon: `${ICON}/volley.png`,
		poi: {
			kind: 'volley',
			label: 'Beach volley court',
			size: [6.4, 2.6, 0.6]
		}
	},
	{
		slug: 'football',
		title: 'Football',
		tags: ['Tactics', 'Teamwork'],
		summary: 'Watching and analyzing games since I was a kid: teamwork beats individual talent.',
		body: [
			'I have watched football since I was a kid: my dad was a football journalist.',
			'I tried playing in a competitive club, but I was not very motivated at the time.',
			'More than playing, I enjoy watching professional players and analyzing their tactics and teamwork.',
			'I still watch games and their analysis today, because I find it fantastic how good teamwork can overcome strong individuals. I find the same appeal in competitive gaming.'
		],
		icon: `${ICON}/football.png`,
		poi: {
			kind: 'football',
			label: 'Football goal',
			size: [5.4, 2.5, 2]
		}
	},
	{
		slug: 'gaming',
		title: 'Competitive Online Gaming',
		tags: ['League of Legends', 'Overwatch', 'Rocket League', 'Valorant'],
		summary: 'Leading and coordinating a team in competitive games.',
		body: [
			'I have always played video games and still do, but these days I focus on competitive ones.',
			'I enjoyed many solo games, but I prefer playing with and against other teams: League of Legends, Overwatch, Rocket League, Valorant…',
			'I love leading and communicating with my teammates, and I do my best to get the most out of each of them.',
			'The synergy of a well-coordinated team is an awesome feeling.'
		],
		icon: `${ICON}/gaming.png`,
		poi: { kind: 'gaming', label: 'Gaming setup', size: [2.4, 2, 1.6] }
	},
	{
		slug: 'student-council',
		title: 'Student Council',
		tags: ['ENSIIE', 'Events', 'Diplomacy'],
		summary: 'Running club life and school parties at ENSIIE taught me to manage and listen.',
		body: [
			'The Student Council was a big part of my life at ENSIIE.',
			'We mostly organized the daily life of the clubs, and from time to time we threw a party at school.',
			'A lot had to be prepared for that to happen, so I learned to manage people and to communicate with different mindsets.',
			'It gave me a sense of diplomacy, and I enjoyed hearing everyone’s view on the issues inside the school. Now, I always try to listen to both sides when I face a problem.'
		],
		icon: `${ICON}/council.png`,
		poi: { kind: 'council', label: 'Speaker podium', size: [2, 2.6, 1.4] }
	},
	{
		slug: 'literature',
		title: 'Literature',
		tags: ['Novels', 'Rick Riordan', 'Michael Scott', 'Nietzsche'],
		summary: 'Reading a book feels like dreaming, and I mean that!',
		body: [
			'Reading a book feels like dreaming, and I mean that!',
			'I have never stopped reading since I learned how. Novels are what I like most.',
			'My taste changed over the years, from sci-fi to fantasy, then to crime novels… I don’t really have a favorite genre.',
			'Some of my favorite authors are Rick Riordan, Michael Scott and Nietzsche (and many, many more).'
		],
		icon: `${ICON}/books.png`,
		poi: { kind: 'books', label: 'Reading spot', size: [2.4, 1.6, 1.6] }
	},
	{
		slug: 'board-sports',
		title: 'Board Sports',
		tags: ['Ski', 'Snowboard', 'Ice skating'],
		summary: 'Speed, mountains and peace: skiing since childhood, snowboarding whenever I can.',
		body: [
			'I discovered skiing as a kid, when my grandparents took me to the Alps.',
			'It started a burning passion for mountain sports: skiing, snowboarding and ice skating.',
			'I jump on every chance to improve my snowboarding, because I love the feeling of speed.',
			'I also enjoy the peace of the mountains, a change from team sports. It probably partly explains why I went to study in Canada, of all countries.'
		],
		icon: `${ICON}/snowboard.png`,
		poi: { kind: 'snowboard', label: 'Snowy slope', size: [3, 2.2, 3] }
	}
]);

export const work = place('work', [
	{
		slug: 'bear-on-boat',
		title: 'Bear on Boat',
		tags: ['Albyon', 'Unity', 'VR', 'Meta Quest'],
		summary: 'A chill and quirky VR fishing game on Meta Quest: you are a bear, fishing on a lake.',
		body: [
			'A chill and quirky VR fishing game on Meta Quest, where you play a bear fishing on a lake full of fish and random items.',
			'At Albyon, I developed gameplay mechanics and VR interactions for it.'
		],
		links: [
			{
				label: 'Play on Meta Quest',
				href: 'https://www.meta.com/fr-fr/experiences/bear-on-boat/25807507738875155/'
			}
		],
		poi: { kind: 'bearboat', label: 'Bear on a boat', size: [3, 1.8, 3] }
	},
	{
		slug: 'bear-scouts',
		title: 'Bear Scouts',
		tags: ['Albyon', 'Unity', 'VR', 'Multiplayer'],
		summary:
			'A free multiplayer social game on Meta Quest where you play a bear scout hanging out at camp with friends.',
		body: [
			'A free multiplayer social game on Meta Quest where you play a bear scout hanging out at camp with friends.',
			'Gather wood, grill marshmallows, clean up the forest, fish for everything from tiny fish to massive sharks, climb parkours, dance and customize your bear with hats.',
			'At Albyon, I developed gameplay mechanics and VR interactions for it.'
		],
		links: [
			{
				label: 'Play on Meta Quest',
				href: 'https://www.meta.com/fr-fr/experiences/bear-scouts/33549458664669770/'
			},
			{ label: 'Game page', href: 'https://www.arianestudios.com/bear-scouts' }
		],
		poi: { kind: 'bearscouts', label: 'Scout camp', size: [3, 2, 2.4] }
	},
	{
		slug: 'loot',
		title: 'LOOT',
		tags: ['Albyon', 'Unity', 'VR', 'Co-op'],
		summary:
			'Explore, mine, escape: a procedurally generated VR adventure on Meta Quest, solo or with up to 4 friends.',
		body: [
			'Explore, mine, escape: a VR adventure on Meta Quest where every run is procedurally generated, to play solo or with up to 4 friends.',
			'At Albyon, I developed gameplay mechanics and VR interactions for it.'
		],
		links: [
			{
				label: 'Play on Meta Quest',
				href: 'https://www.meta.com/experiences/loot/35024660313846255/'
			},
			{
				label: 'Game Page',
				href: 'https://www.meta.com/fr-fr/experiences/app/developer-post/38715509994729578/'
			}
		],
		poi: { kind: 'loot', label: 'Diamond ore', size: [1.6, 1.4, 1.2] }
	},
	{
		slug: 'plundr',
		title: 'Plundr',
		tags: ['Albyon', 'Unity', 'VR'],
		summary:
			'A VR production from Albyon, where I developed gameplay mechanics and VR interactions.',
		body: [
			'A VR production from Albyon, where I developed gameplay mechanics and VR interactions.'
		],
		links: [
			{
				label: 'Play on Meta Quest',
				href: 'https://www.meta.com/fr-fr/experiences/plundr/1214103928448348/'
			}
		],
		poi: { kind: 'plundr', label: 'Pirate ship', size: [3, 2.8, 3] }
	},
	{
		slug: 'witch-grove',
		title: 'Witch Grove',
		tags: ['Albyon', 'Meta Horizon Worlds', 'Cross-platform'],
		summary:
			'A cross-platform witch role-playing game on Meta Horizon Worlds: grow magical plants and collect creatures.',
		body: [
			'A witch role-playing game on Meta Horizon Worlds, playable in VR and on mobile: collect magical creatures and manage your own garden in a cute and spooky world.',
			'Harvest and sell ingredients to the merchant, brew potions, customize your garden, fly on a broom over magical islands and duel your friends with spells.',
			'At Albyon, I developed this cross-platform experience, including its gacha and creature collection mechanics.'
		],
		links: [
			{ label: 'Play on Horizon', href: 'https://horizon.meta.com/world/847591858437049/' },
			{ label: 'Game page', href: 'https://www.arianestudios.com/witch-grove' }
		],
		poi: {
			kind: 'witchgrove',
			label: 'Witch cauldron',
			size: [2.2, 2, 2.2]
		}
	},
	{
		slug: 'revivre',
		title: 'ReviVRe',
		tags: ['Widid VR', 'Unity', 'C#', 'XR Interaction Toolkit'],
		summary: 'A VR training simulation teaching vine pruning, built with Widid VR.',
		body: [
			'ReviVRe is a VR training simulation for winegrowing, made to teach vine pruning.',
			'I developed and integrated new VR interactions to make the learning experience more immersive and effective.',
			'I adapted the XR Interaction Toolkit and built custom locomotion, including a backdash system for more precise movement in VR, and designed interactive behaviors that fit the ergonomic and technical constraints of VR.'
		],
		links: [{ label: 'Widid agriculture', href: 'https://widid.fr/agriculture/' }],
		poi: { kind: 'vineyard', label: 'Vineyard', size: [3.6, 1.8, 2.2] }
	},
	{
		slug: 'crimson-xr',
		title: 'Crimson XR, Mixed Reality Game',
		tags: ['Crimson XR', 'Unity', 'Blender', 'Hand tracking'],
		summary: 'A mixed reality game that brings a crimson world into your room.',
		body: [
			'A mixed reality game on Oculus Quest 2 that brings a crimson world into your room.',
			'I developed a mixed reality interface and hand tracking mechanics.',
			'I helped design a prototype shown to 8 VR arcades, which took part in the commercial validation of the project and a fundraising.'
		],
		links: [{ label: 'Visit crimsonxr.fr', href: 'https://crimsonxr.fr/' }],
		poi: { kind: 'portal', label: 'Crimson portal', size: [4.6, 5, 0.6] }
	}
]);

export type Experience = {
	company: string;
	role: string;
	dates: string;
	place: string;
	points: string[];
	/** Work spots made there. */
	slugs: string[];
};

export const experiences: Experience[] = [
	{
		company: 'Albyon Studio',
		role: 'VR / Gameplay Developer',
		dates: 'May 2024 – Present',
		place: 'Paris, France',
		points: [
			'Gameplay mechanics and VR interactions for several published VR games: Bear on Boat, Bear Scouts, LOOT and Plundr.',
			'Tools for developers and QA testers to smooth the testing pipeline, and for artists and designers to ease asset integration in Unity.',
			'Development of Witch Grove, a cross-platform Meta Horizon Worlds experience with gacha and creature collection mechanics.'
		],
		slugs: ['bear-on-boat', 'bear-scouts', 'loot', 'plundr', 'witch-grove']
	},
	{
		company: 'Widid VR',
		role: 'Unity C# & VR Developer',
		dates: 'Jul. 2023 – Apr. 2024',
		place: 'Paris, France',
		points: [
			'New VR interactions for ReviVRe, a winegrowing training simulation.',
			'Adapted the XR Interaction Toolkit and built custom locomotion, including a backdash system.',
			'Interactive behaviors designed for the ergonomic and technical constraints of VR.'
		],
		slugs: ['revivre']
	},
	{
		company: 'Crimson XR',
		role: 'Game Designer & Developer (internship)',
		dates: 'Jun. – Aug. 2023',
		place: 'Évry-Courcouronnes, France',
		points: [
			'Mixed reality interface and hand tracking mechanics for an Oculus Quest 2 game.',
			'Helped design a prototype shown to 8 VR arcades, supporting commercial validation and a fundraising.'
		],
		slugs: ['crimson-xr']
	}
];

export const spots = [...work, ...projects, ...hobbies];
