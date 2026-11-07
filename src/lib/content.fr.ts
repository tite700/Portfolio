// French version of content.ts, by slug (spots) or company (experiences).
// Anything missing here falls back to the English text. `links` lists the link
// labels in the same order as in content.ts; `label` is the spot's name in the city.

import type { Experience, Spot } from './content';

export type SpotFr = Partial<Pick<Spot, 'title' | 'summary' | 'body' | 'list' | 'tags'>> & {
	links?: string[];
	label?: string;
};

export const spotsFr: Record<string, SpotFr> = {
	// Projects
	modeling: {
		title: 'Modélisation et texturing',
		summary:
			'Mes rendus et animations Blender, le carnet de bord de mon apprentissage de la modélisation, du texturing et de l’animation.',
		body: [
			'Cette page rassemble quelques-uns de mes rendus et animations Blender.',
			'Suivez mon apprentissage de la modélisation, du texturing et de l’animation : de nouvelles pièces arrivent ici au fil de mes progrès.'
		],
		label: 'Statue'
	},
	'garden-gacha': {
		summary:
			'Un jeu gacha en VR dans un jardin : tirez des capsules et agrandissez votre collection.',
		body: [
			'Un jeu de jardinage immersif en VR avec des mécaniques gacha et une génération aléatoire de graines, autour de la sensibilisation à la permaculture.'
		],
		links: ['Jouer sur itch.io'],
		label: 'Machine à gacha'
	},
	root: {
		summary: 'Un jeu Unity autour des racines, publié sur itch.io.',
		body: ['Un jeu Unity autour des racines, publié sur itch.io.'],
		links: ['Jouer sur itch.io'],
		label: 'Sakura en fleurs'
	},
	autobattle: {
		summary:
			'Mon premier jeu : un auto-battler stratégique hors ligne inspiré de TFT et du tower defense. Gagnez de l’argent en éliminant des ennemis, achetez des unités alliées et regardez-les se battre seules.',
		body: [
			'Auto-Battle Arena est mon premier jeu : un auto-battler stratégique hors ligne, jouable sur PC et développé avec Unity.',
			'Il comporte un tutoriel et un niveau principal. Une bataille oppose des unités alliées à des unités ennemies. Éliminer des ennemis rapporte de l’argent, qui sert à acheter de nouvelles unités alliées. Les unités se battent seules.',
			'Le jeu s’inspire de TFT et du genre tower defense.'
		],
		label: 'Borne d’arcade'
	},
	fps: {
		title: 'Projet FPS compétitif',
		summary:
			'Un FPS multijoueur compétitif sous Unreal Engine 5 : synchronisation de l’état du jeu, gestion de la latence et du jitter, server rewind pour la détection des tirs, matchmaking et sessions.',
		body: [
			'Dans ce projet, nous avons développé un jeu de tir à la première personne compétitif sous Unreal Engine 5. Le cours couvrait l’ensemble des sujets nécessaires pour créer un FPS multijoueur.'
		],
		list: [
			'Bases du réseau et histoire des jeux multijoueurs',
			'Création d’un FPS compétitif sous Unreal Engine 5',
			'Synchronisation de l’état du jeu',
			'Gestion de la latence, du jitter et de la fiabilité réseau',
			'Élasticité de la programmation réseau',
			'Sécurité de la programmation réseau',
			'Serveurs de jeu',
			'Services en ligne',
			'Server rewind pour une détection des tirs précise malgré les délais réseau',
			'Fonctionnalités en ligne complètes, dont le matchmaking et la gestion des sessions'
		],
		label: 'Stand de tir'
	},
	'sign-vr': {
		tags: ['C#', 'Meta XR SDK', 'Accessibilité'],
		summary:
			'Une application VR pour apprendre la langue des signes sur casque Meta : le hand tracking reconnaît les signes statiques et dynamiques à deux mains, ainsi que les expressions du visage.',
		body: [
			'SignVR est une application VR pour apprendre la langue des signes avec un casque Meta.',
			'L’application suit les mains de l’utilisateur et compare ses gestes à une base de signes prédéfinis. Quand le geste est correct, il est validé et on passe à la lettre ou au mot suivant.',
			'SignVR gère les signes statiques (lettres de l’alphabet) et les gestes dynamiques à deux mains. Elle utilise aussi le suivi du visage pour des interactions simples : sourire, hocher la tête, fermer les yeux…',
			'Le build .apk pour casques Meta est téléchargeable, et une démo vidéo (version non finale) est disponible sur YouTube.'
		],
		links: ['Télécharger l’.apk', 'Voir la vidéo'],
		label: 'Main géante'
	},
	toastercat: {
		title: 'Jeux ToasterCat',
		summary:
			'Projets d’équipe sous Unreal Engine 5 : un FPS coopératif futuriste et un jeu de puzzle coopératif.',
		body: [
			'ToasterCat est une équipe qui crée des jeux sous Unreal Engine 5, en Blueprint et C++.',
			'FPS coopératif : un gameplay coopératif intense dans un univers futuriste.',
			'Jeu de puzzle coopératif : résolvez ensemble des énigmes complexes dans un lieu mystérieux.'
		],
		links: [
			'FPS coop sur itch.io',
			'Puzzle coop sur itch.io',
			'Gameplay du FPS coop',
			'Gameplay du puzzle coop'
		],
		label: 'Grille-pain géant'
	},
	awale: {
		title: 'Awalé en RA',
		tags: ['A-Frame', 'RA', 'JavaScript'],
		summary:
			'Le jeu de l’awalé en réalité augmentée : scannez une surface plane avec votre téléphone et jouez à deux, sans plateau.',
		body: [
			'Ce jeu reprend l’awalé, avec un objectif : le rendre jouable avec un simple téléphone.',
			'Scannez une surface plane, puis jouez à l’awalé à deux. Pas besoin de vrai plateau ni de quoi que ce soit d’autre.'
		],
		links: ['Jouer à l’awalé (téléphone)'],
		label: 'Table d’awalé'
	},

	// Hobbies
	volleyball: {
		tags: ['Depuis 2016', 'Capitaine'],
		summary:
			'Trois ans de volley en compétition comme capitaine d’équipe, et je joue toujours pour le plaisir.',
		body: [
			'J’ai commencé le volley en 2016 et j’ai joué en compétition pendant 3 ans, avant d’arrêter pour me concentrer sur mes études.',
			'J’étais capitaine de mon équipe : j’avais un bon mental et l’habitude d’être un leader qui parle beaucoup dans mon ancienne équipe de jeu vidéo.',
			'En seulement 3 ans, ce sport m’a tellement passionné que je continue à jouer pour le plaisir dès que j’en ai l’occasion.',
			'Mon équipe préférée est l’équipe de France, et mon joueur préféré est Jenia Grebennikov.'
		],
		label: 'Terrain de beach-volley'
	},
	football: {
		tags: ['Tactique', 'Esprit d’équipe'],
		summary:
			'Je regarde et analyse des matchs depuis tout petit : le collectif bat le talent individuel.',
		body: [
			'Je regarde le football depuis tout petit : mon père était journaliste sportif spécialisé dans le foot.',
			'J’ai essayé de jouer en club, mais je n’étais pas très motivé à l’époque.',
			'Plus que jouer, j’aime regarder les joueurs professionnels et analyser leur tactique et leur jeu collectif.',
			'Je regarde toujours des matchs et leurs analyses, parce que je trouve fantastique qu’un bon collectif puisse battre de fortes individualités. Je retrouve le même attrait dans le jeu vidéo compétitif.'
		],
		label: 'Cage de foot'
	},
	gaming: {
		title: 'Jeu vidéo compétitif en ligne',
		summary: 'Mener et coordonner une équipe dans les jeux compétitifs.',
		body: [
			'J’ai toujours joué aux jeux vidéo et j’y joue encore, mais aujourd’hui je me concentre sur les jeux compétitifs.',
			'J’ai aimé beaucoup de jeux solo, mais je préfère jouer avec et contre d’autres équipes : League of Legends, Overwatch, Rocket League, Valorant…',
			'J’adore mener mes coéquipiers et communiquer avec eux, et je fais de mon mieux pour tirer le meilleur de chacun.',
			'La synergie d’une équipe bien coordonnée est une sensation géniale.'
		],
		label: 'Setup gaming'
	},
	'student-council': {
		title: 'Bureau des élèves',
		tags: ['ENSIIE', 'Événements', 'Diplomatie'],
		summary:
			'Organiser la vie des clubs et les soirées de l’ENSIIE m’a appris à gérer une équipe et à écouter.',
		body: [
			'Le Bureau des élèves a pris une grande place dans ma vie à l’ENSIIE.',
			'Nous organisions surtout la vie quotidienne des clubs, et de temps en temps une soirée à l’école.',
			'Il fallait beaucoup de préparation pour que tout ça ait lieu : j’ai appris à gérer des personnes et à communiquer avec des façons de penser différentes.',
			'Ça m’a donné un sens de la diplomatie, et j’ai aimé entendre le point de vue de chacun sur les sujets internes à l’école. Aujourd’hui, j’essaie toujours d’écouter les deux parties face à un problème.'
		],
		label: 'Pupitre d’orateur'
	},
	literature: {
		title: 'Littérature',
		tags: ['Romans', 'Rick Riordan', 'Michael Scott', 'Nietzsche'],
		summary: 'Lire un livre, c’est comme rêver, et je le pense vraiment !',
		body: [
			'Lire un livre, c’est comme rêver, et je le pense vraiment !',
			'Depuis que je sais lire, je ne me suis jamais arrêté. Ce que je préfère, ce sont les romans.',
			'Mes goûts ont changé avec les années, de la science-fiction à la fantasy, puis aux polars… Je n’ai pas vraiment de genre préféré.',
			'Parmi mes auteurs préférés : Rick Riordan, Michael Scott et Nietzsche (et beaucoup, beaucoup d’autres).'
		],
		label: 'Coin lecture'
	},
	'board-sports': {
		title: 'Sports de glisse',
		tags: ['Ski', 'Snowboard', 'Patin à glace'],
		summary: 'Vitesse, montagne et calme : le ski depuis l’enfance, le snowboard dès que je peux.',
		body: [
			'J’ai découvert le ski enfant, quand mes grands-parents m’ont emmené dans les Alpes.',
			'C’est le début d’une passion brûlante pour les sports de montagne : ski, snowboard et patin à glace.',
			'Je saute sur chaque occasion de progresser en snowboard, parce que j’adore la sensation de vitesse.',
			'J’aime aussi le calme de la montagne, qui change des sports d’équipe. Ça explique sans doute en partie pourquoi je suis parti étudier au Canada, entre tous les pays.'
		],
		label: 'Piste enneigée'
	},

	// Work
	'bear-on-boat': {
		summary:
			'Un jeu de pêche en VR, calme et décalé, sur Meta Quest : vous êtes un ours qui pêche sur un lac.',
		body: [
			'Un jeu de pêche en VR calme et décalé sur Meta Quest, où vous incarnez un ours qui pêche sur un lac rempli de poissons et d’objets improbables.',
			'Chez Albyon, j’ai développé des mécaniques de gameplay et des interactions VR pour ce jeu.'
		],
		links: ['Jouer sur Meta Quest'],
		label: 'Ours sur une barque'
	},
	'bear-scouts': {
		tags: ['Albyon', 'Unity', 'VR', 'Multijoueur'],
		summary:
			'Un jeu social multijoueur gratuit sur Meta Quest où vous êtes un ours scout qui traîne au camp avec ses amis.',
		body: [
			'Un jeu social multijoueur gratuit sur Meta Quest où vous incarnez un ours scout qui traîne au camp avec ses amis.',
			'Ramassez du bois, faites griller des marshmallows, nettoyez la forêt, pêchez de minuscules poissons comme d’énormes requins, enchaînez des parcours d’escalade, dansez et personnalisez votre ours avec des chapeaux.',
			'Chez Albyon, j’ai développé des mécaniques de gameplay et des interactions VR pour ce jeu.'
		],
		links: ['Jouer sur Meta Quest', 'Page du jeu'],
		label: 'Camp scout'
	},
	loot: {
		tags: ['Albyon', 'Unity', 'VR', 'Coop'],
		summary:
			'Explorer, miner, s’échapper : une aventure VR générée procéduralement sur Meta Quest, en solo ou jusqu’à 4 amis.',
		body: [
			'Explorer, miner, s’échapper : une aventure VR sur Meta Quest où chaque partie est générée procéduralement, à jouer seul ou avec jusqu’à 4 amis.',
			'Chez Albyon, j’ai développé des mécaniques de gameplay et des interactions VR pour ce jeu.'
		],
		links: ['Jouer sur Meta Quest', 'Page du jeu'],
		label: 'Minerai de diamant'
	},
	plundr: {
		summary:
			'Une production VR d’Albyon, pour laquelle j’ai développé des mécaniques de gameplay et des interactions VR.',
		body: [
			'Une production VR d’Albyon, pour laquelle j’ai développé des mécaniques de gameplay et des interactions VR.'
		],
		links: ['Jouer sur Meta Quest'],
		label: 'Bateau pirate'
	},
	'witch-grove': {
		tags: ['Albyon', 'Meta Horizon Worlds', 'Cross-platform'],
		summary:
			'Un jeu de rôle de sorcière cross-platform sur Meta Horizon Worlds : faites pousser des plantes magiques et collectionnez des créatures.',
		body: [
			'Un jeu de rôle de sorcière sur Meta Horizon Worlds, jouable en VR et sur mobile : collectionnez des créatures magiques et gérez votre propre jardin dans un monde mignon et un peu effrayant.',
			'Récoltez et vendez des ingrédients au marchand, préparez des potions, personnalisez votre jardin, survolez des îles magiques en balai et affrontez vos amis en duel de sorts.',
			'Chez Albyon, j’ai développé cette expérience cross-platform, notamment ses mécaniques gacha et de collection de créatures.'
		],
		links: ['Jouer sur Horizon', 'Page du jeu'],
		label: 'Chaudron de sorcière'
	},
	revivre: {
		summary:
			'Une simulation de formation en VR pour apprendre la taille de la vigne, réalisée avec Widid VR.',
		body: [
			'ReviVRe est une simulation de formation viticole en VR, conçue pour apprendre la taille de la vigne.',
			'J’ai développé et intégré de nouvelles interactions VR pour rendre l’apprentissage plus immersif et plus efficace.',
			'J’ai adapté l’XR Interaction Toolkit et développé des mécaniques de locomotion personnalisées, dont un système de backdash pour des déplacements plus précis en VR, et conçu des comportements interactifs adaptés aux contraintes ergonomiques et techniques de la réalité virtuelle.'
		],
		links: ['Widid agriculture'],
		label: 'Vignes'
	},
	'crimson-xr': {
		title: 'Crimson XR, jeu en réalité mixte',
		summary: 'Un jeu en réalité mixte qui fait entrer un monde écarlate dans votre pièce.',
		body: [
			'Un jeu en réalité mixte sur Oculus Quest 2 qui fait entrer un monde écarlate dans votre pièce.',
			'J’ai développé une interface de réalité mixte et des mécaniques de hand tracking.',
			'J’ai contribué à la conception d’un prototype présenté à 8 salles VR, qui a participé à la validation commerciale du projet et à une levée de fonds.'
		],
		links: ['Visiter crimsonxr.fr'],
		label: 'Portail écarlate'
	}
};

// From the French CV.
export const experiencesFr: Record<string, Partial<Experience>> = {
	'Albyon Studio': {
		role: 'Développeur VR / Gameplay Developer',
		dates: 'Mai 2024 – aujourd’hui',
		points: [
			'Mécaniques de gameplay et interactions VR pour plusieurs productions VR publiées : Bear on Boat, Bear Scouts, LOOT et Plundr.',
			'Tools pour les développeurs et les QA testeurs afin de fluidifier le pipeline de test, et pour les artistes et designers afin de faciliter l’intégration des assets dans Unity.',
			'Développement de Witch Grove, une expérience cross-platform sur Meta Horizon Worlds intégrant des mécaniques gacha et de collection de créatures.'
		]
	},
	'Widid VR': {
		role: 'Développeur Unity C# et VR',
		dates: 'Juil. 2023 – Avr. 2024',
		points: [
			'Nouvelles interactions VR pour ReviVRe, une simulation de formation viticole.',
			'Adaptation de l’XR Interaction Toolkit et mécaniques de locomotion personnalisées, dont un système de backdash.',
			'Comportements interactifs adaptés aux contraintes ergonomiques et techniques de la réalité virtuelle.'
		]
	},
	'Crimson XR': {
		role: 'Game Designer et Developer (stage)',
		dates: 'Juin – Août 2023',
		points: [
			'Interface de réalité mixte et mécaniques de hand tracking pour un jeu sur Oculus Quest 2.',
			'Contribution à la conception d’un prototype présenté à 8 salles VR, pour la validation commerciale du projet et une levée de fonds.'
		]
	}
};
