const availableCountries = ['ar', 'au', 'at', 'be', 'br', 'ca', 'cl', 'dk', 'fi', 'fr', 'de', 'hk', 'in', 'id', 'it', 'jp', 'kr', 'my', 'mx', 'nl', 'nz', 'no', 'cn', 'pl', 'pt', 'ph', 'ru', 'sa', 'za', 'es', 'se', 'ch', 'tw', 'tr', 'gb', 'us'];

function chooseMarket(){
	let found = false;
	for(let i = 0; i < navigator.languages.length; i++){
		try{
			let country = navigator.languages[i].split('-')[1].toLowerCase();
			if(typeof(availableCountries[country]) !== 'undefined'){
				localStorage.setItem('market', country);
				found = true;
				break;
			}
		}catch{}
	}
	if(!found) localStorage.setItem('market', 'us');
}

function setup(){
	let market = localStorage.getItem('market');
	let theme = localStorage.getItem('theme');
	let category = localStorage.getItem('category');
	let affiliates = localStorage.getItem('affiliates');
	let safeSearch = localStorage.getItem('safeSearch');
	if(theme === null || typeof(theme) === 'undefined') localStorage.setItem('theme', 'dark');
	if(market === null || typeof(market) === 'undefined') chooseMarket();
	if(category === null || typeof(category) === 'undefined') localStorage.setItem('category', 'general');
	if(affiliates === null || typeof(affiliates) === 'undefined') localStorage.setItem('affiliates', 'true');
	if(safeSearch === null || typeof(safeSearch) === 'undefined') localStorage.setItem('safeSearch', 'moderate');

	if(!(["dark", "tokyoNight", "monokai", "solarizedDark", "light", "blue", "nord", "dracula", "gray"].includes(theme))) localStorage.setItem('theme', 'dark');
	if(!(["general", "images", "videos", "news"].includes(category))) localStorage.setItem('category', 'general');
	document.getElementById("css-theme").href = "css/themes/" + localStorage.getItem('theme') + ".css";
}

setup();

const market = localStorage.getItem('market');
const safeSearch = localStorage.getItem('safeSearch');
const affiliatesEnabled = (localStorage.getItem('affiliates') === 'true');
const affiliates = {
	"https://www.hetzner.com/": "https://hetzner.cloud/?ref=Oflj8ToDXPAI",
	"https://pocketbitcoin.com/": "https://pocketbitcoin.com/?ref=rabbit",
	"https://www.ledger.com/": "https://shop.ledger.com/?r=8d93fca50c38",
	"https://www.yubico.com/": "https://www.pjtra.com/t/8-12281-262494-191575",
	"https://www.amazon.com/": "https://amzn.to/3K8oXHp"
};