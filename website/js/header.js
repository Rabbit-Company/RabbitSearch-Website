function detectLanguage(){
	for(const language of navigator.languages){
		if(Object.keys(lang).includes(language)){
			localStorage.setItem('lang', language);
			break;
		}
	}
	if(readData('lang') == null || typeof(readData('lang')) == 'undefined') localStorage.setItem('lang', 'en');
}

function setTheme(){
	if(readData('theme') == null || typeof(readData('theme')) == 'undefined') localStorage.setItem('theme', 'dark');
	if(readData('lang') == null || typeof(readData('lang')) == 'undefined') detectLanguage();

	if(!(["dark", "tokyoNight", "monokai", "solarizedDark", "light", "blue", "nord", "dracula", "gray"].includes(readData('theme')))) localStorage.setItem('theme', 'dark');
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