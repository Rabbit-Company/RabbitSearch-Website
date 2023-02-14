const availableMarkets = {
	'es-AR': 'Argentina',
	'en-AU': 'Australia',
	'de-AT': 'Austria',
	'nl-BE': 'Belgium (Dutch)',
	'fr-BE': 'Belgium (French)',
	'pt-BR': 'Brazil',
	'en-CA': 'Canada (English)',
	'fr-CA': 'Canada (French)',
	'es-CL': 'Chile',
	'da-DK': 'Denmark',
	'fi-FI': 'Finland',
	'fr-FR': 'France',
	'de-DE': 'Germany',
	'zh-HK': 'Hong Kong SAR',
	'en-IN': 'India',
	'en-ID': 'Indonesia',
	'it-IT': 'Italy',
	'ja-JP': 'Japan',
	'ko-KR': 'Korea',
	'en-MY': 'Malaysia',
	'es-MX': 'Mexico',
	'nl-NL': 'Netherlands',
	'en-NZ': 'New Zealand',
	'no-NO': 'Norway',
	'zh-CN': "People's republic of China",
	'pl-PL': 'Poland',
	'en-PH': 'Republic of the Philippines',
	'ru-RU': 'Russia',
	'en-ZA': 'South Africa',
	'es-ES': 'Spain',
	'sv-SE': 'Sweden',
	'fr-CH': 'Switzerland (French)',
	'de-CH': 'Switzerland (German)',
	'zh-TW': 'Taiwan',
	'tr-TR': 'Turkey',
	'en-GB': 'United Kingdom',
	'en-US': 'United States (English)',
	'es-US': 'United States (Spanish)'
};

function setup(){
	let lang = localStorage.getItem('lang');
	let theme = localStorage.getItem('theme');
	let category = localStorage.getItem('category');
	let affiliates = localStorage.getItem('affiliates');
	let safeSearch = localStorage.getItem('safeSearch');
	if(theme === null || typeof(theme) === 'undefined') localStorage.setItem('theme', 'dark');
	if(lang === null || typeof(lang) === 'undefined') localStorage.setItem('lang', navigator.language);
	if(category === null || typeof(category) === 'undefined') localStorage.setItem('category', 'general');
	if(affiliates === null || typeof(affiliates) === 'undefined') localStorage.setItem('affiliates', 'true');
	if(safeSearch === null || typeof(safeSearch) === 'undefined') localStorage.setItem('safeSearch', 'Moderate');

	if(!(["dark", "tokyoNight", "monokai", "solarizedDark", "light", "blue", "nord", "dracula", "gray"].includes(theme))) localStorage.setItem('theme', 'dark');
	if(!(["general", "images", "videos", "news"].includes(category))) localStorage.setItem('category', 'general');
	document.getElementById("css-theme").href = "css/themes/" + localStorage.getItem('theme') + ".css";
}

setup();

const safeSearch = localStorage.getItem('safeSearch');
const affiliatesEnabled = (localStorage.getItem('affiliates') === 'true');
const affiliates = {
	"https://www.hetzner.com/": "https://hetzner.cloud/?ref=Oflj8ToDXPAI",
	"https://pocketbitcoin.com/": "https://pocketbitcoin.com/?ref=rabbit",
	"https://www.ledger.com/": "https://shop.ledger.com/?r=8d93fca50c38",
	"https://www.yubico.com/": "https://www.pjtra.com/t/8-12281-262494-191575"
};