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