function setup(){
	let lang = localStorage.getItem('lang');
	let theme = localStorage.getItem('theme');
	let category = localStorage.getItem('category');
	if(theme === null || typeof(theme) === 'undefined') localStorage.setItem('theme', 'dark');
	if(lang === null || typeof(lang) === 'undefined') localStorage.setItem('lang', navigator.language);
	if(category === null || typeof(category) === 'undefined') localStorage.setItem('category', 'general');

	if(!(["dark", "tokyoNight", "monokai", "solarizedDark", "light", "blue", "nord", "dracula", "gray"].includes(theme))) localStorage.setItem('theme', 'dark');
	if(!(["general", "images", "videos", "news"].includes(category))) localStorage.setItem('category', 'general');
	document.getElementById("css-theme").href = "css/themes/" + localStorage.getItem('theme') + ".css";
}

setup();

const affiliates = {
	"https://www.hetzner.com/": "https://hetzner.cloud/?ref=Oflj8ToDXPAI",
	"https://pocketbitcoin.com/": "https://pocketbitcoin.com/?ref=rabbit",
	"https://www.ledger.com/": "https://shop.ledger.com/?r=8d93fca50c38",
	"https://www.yubico.com/": "https://www.pjtra.com/t/8-12281-262494-191575"
};