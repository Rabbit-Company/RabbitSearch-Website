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

document.onkeydown = function(e) {
	if(e.key == "F12") return false;
	if(e.ctrlKey && e.shiftKey && e.key == 'I') return false;
	if(e.ctrlKey && e.shiftKey && e.key == 'C') return false;
	if(e.ctrlKey && e.shiftKey && e.key == 'J') return false;
	if(e.ctrlKey && (e.key == 'u' || e.key == 'U')) return false;
}

document.addEventListener('contextmenu', e => e.preventDefault());

setup();