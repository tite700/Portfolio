// English / French. The pages are prerendered in English; the browser switches to
// the visitor's language: ?lang=fr|en in the URL, then the saved choice, then the
// browser language.
import { experiencesFr, spotsFr } from './content.fr';
import { sections, type Experience, type Section, type Spot } from './content';

export type Lang = 'en' | 'fr';

export const i18n = $state({ lang: 'en' as Lang });

/** The text for the current language. */
export const t = (en: string, fr: string) => (i18n.lang === 'fr' ? fr : en);

export function setLang(lang: Lang) {
	i18n.lang = lang;
	document.documentElement.lang = lang;
	try {
		localStorage.setItem('lang', lang);
	} catch {
		// Private browsing: the choice just isn't remembered.
	}
}

export function initLang() {
	let saved: string | null = null;
	try {
		saved = localStorage.getItem('lang');
	} catch {
		// Ignore, as above.
	}
	const wanted =
		new URLSearchParams(location.search).get('lang') ?? saved ?? navigator.language.slice(0, 2);
	setLang(wanted === 'fr' ? 'fr' : 'en');
}

export const sectionTitle = (section: Section) =>
	t(
		sections[section].title,
		{ work: 'Expérience', projects: 'Projets', hobbies: 'Loisirs' }[section]
	);

/** A spot in the current language (French falls back to English field by field). */
export function tr(spot: Spot): Spot {
	const fr = i18n.lang === 'fr' ? spotsFr[spot.slug] : undefined;
	if (!fr) return spot;
	const { links, label, ...texts } = fr;
	return {
		...spot,
		...texts,
		links: spot.links?.map((link, i) => ({ ...link, label: links?.[i] ?? link.label })),
		poi: { ...spot.poi, label: label ?? spot.poi.label }
	};
}

export function trExperience(xp: Experience): Experience {
	return i18n.lang === 'fr' ? { ...xp, ...experiencesFr[xp.company] } : xp;
}

/** CV PDF for the current language. */
export const cvHref = () => `/cv/Baptiste_David_CV_${i18n.lang.toUpperCase()}.pdf`;
