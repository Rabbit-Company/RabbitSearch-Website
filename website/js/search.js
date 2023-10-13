let querySpeed = 0;
const query = parms.get('q');
let category = localStorage.getItem('category');
const categories = ['general', 'images', 'videos', 'news'];

if(query === null) location.assign('/');

document.getElementById('category').value = category;
document.getElementById('search').value = query;
document.getElementById('safeSearch').value = safeSearch;
document.getElementById('market').value = market;
document.getElementById('affiliates').value = affiliatesEnabled;
document.getElementById('themes').value = localStorage.getItem('theme');

if(category !== 'general'){
	document.getElementById('category-general').className = "border-transparent secondaryColor whitespace-nowrap pb-2 px-1 border-b font-normal text-sm cursor-pointer";
	document.getElementById('category-' + category).className = "primaryColor tertiaryBorderColor whitespace-nowrap pb-2 px-1 border-b font-normal text-sm cursor-pointer";
}

search(query, category).then((data) => {
	querySpeed = performance.now();
	displayResults(data, category);
}).catch((error) => {
	console.log("Error: " + error);
});

function search(query, type = 'general'){
	let endpoint = "https://api.rabbitsearch.org/search?q=";

	if(type === 'images') endpoint = "https://api.rabbitsearch.org/images?q=";
	if(type === 'videos') endpoint = "https://api.rabbitsearch.org/videos?q=";
	if(type === 'news') endpoint = "https://api.rabbitsearch.org/news?q=";

	return new Promise((resolve, reject) => {
		fetch(endpoint + encodeURIComponent(query) + "&s=" + safeSearch + "&m=" + market)
		.then((response) => response.json())
		.then((data) => resolve(data))
		.catch((error) => reject(error));
	});
}

function displayResults(data, type = 'general'){
	if(type === 'general') displayGeneralResults(data);
	if(type === 'images') displayImageResults(data);
	if(type === 'videos') displayVideoResults(data);
	if(type === 'news') displayNewsResults(data);
}

function changeDialog(style, text) {
	switch (style) {
		case 1:
			//Error dialog
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-red-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' /></svg>";

			document.getElementById('dialog-title').innerText = "ERROR";
			document.getElementById('dialog-text').innerText = text;

			document.getElementById('dialog-button-cancel').style.display = 'none';

			document.getElementById('dialog-button').className = "primaryButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = "Okay";
			document.getElementById('dialog-button').onclick = () => hide("dialog");
		break;
		case 2:
			//Error dialog with page redirection
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-red-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' /></svg>";

			document.getElementById('dialog-title').innerText = "ERROR";
			document.getElementById('dialog-text').innerText = text;

			document.getElementById('dialog-button-cancel').style.display = 'none';

			document.getElementById('dialog-button').className = "primaryButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = "Okay";
			document.getElementById('dialog-button').onclick = () => location.assign('/');
		break;
	}
}

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
function formatBytes(x){
	let l = 0, n = parseInt(x, 10) || 0;
	while(n >= 1024 && ++l) n = n/1024;
	return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

const viewRanges = [{ divider: 1E3, suffix: 'K'}, { divider: 1E6, suffix: 'M'}, { divider: 1E9, suffix: 'B' }];
function formatViews(x){
	for(let index = viewRanges.length - 1; index >= 0; index--){
		if(x > viewRanges[index].divider){
			let quotient = x / viewRanges[index].divider;
			if(quotient < 10){
				quotient = Math.floor(quotient * 10) / 10;
			} else {
				quotient = Math.floor(quotient);
			}
			return quotient.toString() + viewRanges[index].suffix;
		}
	}
	return x.toString();
}

function formatPublishedDate(x){
	const date = (x instanceof Date) ? x : new Date(x);
	const formatter = new Intl.RelativeTimeFormat('en');
	const ranges = {
		years: 31536000,
		months: 2592000,
		weeks: 604800,
		days: 86400,
		hours: 3600,
		minutes: 60,
		seconds: 1
	};
	const secondsElapsed = (date.getTime() - Date.now()) / 1000;
	for(let key in ranges) {
		if(ranges[key] < Math.abs(secondsElapsed)) {
			const delta = secondsElapsed / ranges[key];
			return formatter.format(Math.round(delta), key);
		}
	}
}

function displayGeneralResults(results){

	if(results.error === 429){
		changeDialog(2, "You are sending too many requests! Please wait 10 seconds before executing this action again.");
		show('dialog');
		return;
	}

	if(results.error !== 0) return;
	if(typeof(results.data?.web?.results) !== 'object') return;

	let html = "";
	html += `<p class="secondaryColor text-sm">Response took ${(querySpeed / 1000).toFixed(2)} seconds</p>`;

	for(let i = 0; i < results.data.web.results.length; i++){
		let result = results.data.web.results[i];

		if(typeof(result.title) === 'undefined') continue;
		if(typeof(result.url) === 'undefined') continue;
		if(typeof(result.description) === 'undefined') continue;

		let url = result.url;
		let niceURL = (url[url.length - 1] === '/') ? url.slice(0, -1) : url;

		let favicon = result.meta_url?.favicon;

		html += "<div>";
		if(affiliatesEnabled && typeof(affiliates[url]) !== 'undefined'){
			html += `<a href="${affiliates[url]}" class="primaryColor text-lg">
			<svg xmlns="http://www.w3.org/2000/svg" class="text-amber-600 align-text-bottom inline h-5 w-5" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" fill="currentColor"></path></svg>
			<span class="inline">${result.title}</span></a>`;
		}else{
			html += `<a href="${url}" class="primaryColor text-lg"><img src="${favicon}" loading="lazy" width="16" height="16" alt="🌐" class="inline mr-2" /> ${result.title}</a>`;
		}

		let path = result.meta_url?.path;
		if(typeof(path) === 'string' && path.length >= 2){
			html += `<p class="text-green-600 text-base truncate">${result.meta_url?.hostname} ${path}</p>`;
		}else{
			html += `<p class="text-green-600 text-base truncate">${niceURL}</p>`;
		}
		html += `<p class="secondaryColor text-sm">${result.description}</p></div>`;
	}
	document.getElementById('results').innerHTML = html;
	document.getElementById('footer').className = "primaryBackgroundColor";
}

function displayImageResults(results){

	if(results.error === 429){
		changeDialog(2, "You are sending too many requests! Please wait 10 seconds before executing this action again.");
		show('dialog');
		return;
	}

	if(results.error !== 0) return;
	if(typeof(results.data?.results) !== 'object') return;
	document.getElementById('results').className = "max-w-7xl w-full space-y-6";

	let html = "";
	html += `<p class="secondaryColor text-sm">Response took ${(querySpeed / 1000).toFixed(2)} seconds</p>`;

	html += `<ul role="list" class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">`;
	for(let i = 0; i < results.data.results.length; i++){
		let result = results.data.results[i];

		if(typeof(result.title) === 'undefined') continue;
		if(typeof(result.url) === 'undefined') continue;
		if(typeof(result.source) === 'undefined') continue;
		if(typeof(result.thumbnail?.src) === 'undefined') continue;
		if(typeof(result.properties?.url) === 'undefined') continue;
		if(typeof(result.meta_url?.scheme) === 'undefined') continue;
		if(typeof(result.meta_url?.hostname) === 'undefined') continue;

		html += `<li class="relative">`;
		html += `
			<div class="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus:outline-none">
				<a href="${result.properties.url}">
					<img src="${result.thumbnail.src}" alt="${result.title}" loading="lazy" class="loadedImages pointer-events-none object-cover group-hover:opacity-75">
				</a>
			</div>
			<a href="${result.url}" class="tertiaryColor mt-2 block truncate text-sm font-medium">${result.title}</a>
			<a href="${result.meta_url.scheme}://${result.meta_url.hostname}" class="secondaryColor block truncate text-sm font-medium">${result.source}</a>
		`;
		html += "</li>";
	}
	html += "</ul>";
	document.getElementById('results').innerHTML = html;
	document.getElementById('footer').className = "primaryBackgroundColor";
}

function displayVideoResults(results){

	if(results.error === 429){
		changeDialog(2, "You are sending too many requests! Please wait 10 seconds before executing this action again.");
		show('dialog');
		return;
	}

	if(results.error !== 0) return;
	if(typeof(results.data?.results) !== 'object') return;
	document.getElementById('results').className = "max-w-7xl w-full space-y-6";

	let html = "";
	html += `<p class="secondaryColor text-sm">Response took ${(querySpeed / 1000).toFixed(2)} seconds</p>`;

	html += `<ul role="list" class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">`;
	for(let i = 0; i < results.data.results.length; i++){
		let result = results.data.results[i];

		if(typeof(result.title) === 'undefined') continue;
		if(typeof(result.url) === 'undefined') continue;
		if(typeof(result.meta_url?.hostname) === 'undefined') continue;
		if(typeof(result.thumbnail?.src) === 'undefined') continue;
		if(typeof(result.age) === 'undefined') continue;
		if(typeof(result.meta_url?.favicon) === 'undefined') continue;
		if(typeof(result.meta_url?.hostname) === 'undefined') continue;

		let viewCount = result.viewCount || 0;

		html += `<li class="relative">`;
		html += `
			<div class="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus:outline-none">
				<a href="${result.url}">
					<img src="${result.thumbnail.src}" alt="${result.title}" loading="lazy" class="object-cover group-hover:opacity-75">
				</a>
			</div>
			<a href="${result.url}" class="tertiaryColor mt-2 block text-base font-medium truncate">${result.title}</a>
			<p class="secondaryColor pointer-events-none block text-sm font-medium truncate">${formatViews(viewCount)} views &middot; ${result.age}</p>
			<p class="secondaryColor pointer-events-none block text-sm font-medium truncate"><img src="${result.meta_url.favicon}" loading="lazy" width="16" height="16" alt="🌐" class="inline mr-2" /> ${result.meta_url.hostname}</p>
		`;
		html += "</li>";
	}
	html += "</ul>";
	document.getElementById('results').innerHTML = html;
	document.getElementById('footer').className = "primaryBackgroundColor";
}

function displayNewsResults(results){

	if(results.error === 429){
		changeDialog(2, "You are sending too many requests! Please wait 10 seconds before executing this action again.");
		show('dialog');
		return;
	}

	if(results.error !== 0) return;
	if(typeof(results.data?.results) !== 'object') return;

	let html = "";
	html += `<p class="secondaryColor text-sm">Response took ${(querySpeed / 1000).toFixed(2)} seconds</p>`;

	for(let i = 0; i < results.data.results.length; i++){
		let result = results.data.results[i];

		if(typeof(result.title) === 'undefined') continue;
		if(typeof(result.url) === 'undefined') continue;
		if(typeof(result.description) === 'undefined') continue;
		if(typeof(result.meta_url?.hostname) === 'undefined') continue;
		if(typeof(result.age) === 'undefined') continue;

		html += `<div>
		<a href="${result.url}" class="primaryColor text-lg"><img src="${result.meta_url.favicon}" loading="lazy" width="16" height="16" alt="🌐" class="inline mr-2" /> ${result.title}</a>
		<p class="secondaryColor text-base truncate">${result.meta_url.hostname} &middot; ${result.age}</p>
		<p class="secondaryColor text-sm">${result.description}</p>`;
		html += "</div>";
	}
	document.getElementById('results').innerHTML = html;
	document.getElementById('footer').className = "primaryBackgroundColor";
}

function changeCategory(selectedCategory){
	if(!categories.includes(selectedCategory)) return;
	if(selectedCategory === category) return;
	localStorage.setItem('category', selectedCategory);
	location.assign('?q=' + query);
}

function changeMarket(selectedMarket){
	console.log(selectedMarket);
	if(!availableCountries.includes(selectedMarket)) return;
	if(selectedMarket === market) return;
	localStorage.setItem('market', selectedMarket);
	location.assign('?q=' + query);
}

function changeSafeSearch(mode){
	if(!['off', 'moderate', 'strict'].includes(mode)) return;
	if(mode === safeSearch) return;
	localStorage.setItem('safeSearch', mode);
	location.assign('?q=' + query);
}

function changeAffiliates(enabled){
	if(!['true', 'false'].includes(enabled)) return;
	if(enabled === affiliates) return;
	localStorage.setItem('affiliates', enabled);
	location.assign('?q=' + query);
}

function changeTheme(theme){
	if(!(["dark", "tokyoNight", "monokai", "solarizedDark", "light", "blue", "nord", "dracula", "gray"].includes(theme))) localStorage.setItem('theme', 'dark');
	localStorage.setItem('theme', theme);
	document.getElementById("css-theme").href = "css/themes/" + localStorage.getItem('theme') + ".css";
}

document.getElementById('category-general').addEventListener('click', () => changeCategory('general'));
document.getElementById('category-images').addEventListener('click', () => changeCategory('images'));
document.getElementById('category-videos').addEventListener('click', () => changeCategory('videos'));
document.getElementById('category-news').addEventListener('click', () => changeCategory('news'));

document.getElementById('category').addEventListener('change', () => changeCategory(document.getElementById('category').value));
document.getElementById('market').addEventListener('change', () => changeMarket(document.getElementById('market').value));
document.getElementById('safeSearch').addEventListener('change', () => changeSafeSearch(document.getElementById('safeSearch').value));
document.getElementById('affiliates').addEventListener('change', () => changeAffiliates(document.getElementById('affiliates').value));
document.getElementById('themes').addEventListener('change', () => changeTheme(document.getElementById('themes').value));

document.getElementById('close-main-menu-btn').addEventListener('click', () => toggleMenu());
document.getElementById('category-settings').addEventListener('click', () => toggleMenu());