let querySpeed = 0;
const query = parms.get('q');
let category = localStorage.getItem('category');
const categories = ['general', 'images', 'videos', 'news'];

if(query === null) location.assign('/');

document.getElementById('category').value = category;
document.getElementById('search').value = query;

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
	let endpoint = "https://api.rabbitsearch.org/searchGeneral?q=";
	if(type === 'images') endpoint = "https://api.rabbitsearch.org/searchImages?q=";
	if(type === 'videos') endpoint = "https://api.rabbitsearch.org/searchVideos?q=";
	if(type === 'news') endpoint = "https://api.rabbitsearch.org/searchNews?q=";
	return new Promise((resolve, reject) => {
		fetch(endpoint + encodeURIComponent(query))
		.then((response) => response.json())
		.then((data) => resolve(data))
		.catch((error) => reject(error));
	});
}

function displayResults(data, type = 'general'){
	if(type === 'general') displayGeneralResults(data);
	if(type === 'images') displayImageResults(data);
	if(type === 'videos') displayVideoResults(data);
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
	if(typeof(results.data?.webPages?.value) !== 'object') return;

	let html = "";

	html += `<p class="secondaryColor text-sm">About ${results.data?.webPages?.totalEstimatedMatches.toLocaleString()} results (${querySpeed}ms)</p>`;

	if(typeof(results.data.queryContext.alteredQuery) === 'string'){
		html += `<div><span class="secondaryColor text-base">Including results for <a href="?q=${results.data.queryContext.alteredQuery}" class="primaryColor text-base">${results.data.queryContext.alteredQuery}</a>.</span><br/>`;
		html += `<span class="secondaryColor text-sm">Do you want results only for <a href="?q=${results.data.queryContext.originalQuery}" class="primaryColor text-sm">${results.data.queryContext.originalQuery}</a>?</span></div>`;
	}

	for(let i = 0; i < results.data.webPages.value.length; i++){
		html += `<div>
		<a href="${results.data.webPages.value[i].url}" class="primaryColor text-lg">${results.data.webPages.value[i].name}</a>
		<p class="text-green-600 text-base truncate">${results.data?.webPages.value[i].url}</p>
		<p class="secondaryColor text-sm">${results.data?.webPages.value[i].snippet}</p>`;

		if(typeof(results.data.webPages.value[i].deepLinks) === 'object'){
			html += `<ul role="list" class="mx-auto grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-4 ml-6 mt-3">`;
			for(let j = 0; j < results.data.webPages.value[i].deepLinks.length; j++){
				html += `<li><a href="${results.data.webPages.value[i].deepLinks[j].url}" class="primaryColor text-base">${results.data.webPages.value[i].deepLinks[j].name}</a>`;
				if(typeof(results.data.webPages.value[i].deepLinks[j].snippet) === 'string') html += `<p class="secondaryColor text-sm truncate">${results.data.webPages.value[i].deepLinks[j].snippet}</p>`;
				html += "</li>";
			}
			html += "</ul>";
		}

		html += "</div>";
	}
	document.getElementById('results').innerHTML = html;
}

function displayImageResults(results){
	if(results.error === 429){
		changeDialog(2, "You are sending too many requests! Please wait 10 seconds before executing this action again.");
		show('dialog');
		return;
	}

	if(results.error !== 0) return;
	if(typeof(results.data?.value) !== 'object') return;
	document.getElementById('results').className = "max-w-7xl w-full space-y-6";

	let html = "";

	html += `<p class="secondaryColor text-sm">About ${results.data.totalEstimatedMatches.toLocaleString()} results (${querySpeed}ms)</p>`;

	html += `<ul role="list" class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">`;
	for(let i = 0; i < results.data.value.length; i++){
		html += `<li class="relative">`;
		html += `
			<div class="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
				<img src="${results.data.value[i].contentUrl}" alt="${results.data.value[i].name}" loading="lazy" class="pointer-events-none object-cover group-hover:opacity-75">
				<button type="button" class="absolute inset-0 focus:outline-none">
					<span class="sr-only">View details for ${results.data.value[i].name}</span>
				</button>
			</div>
			<p class="secondaryColor pointer-events-none mt-2 block truncate text-sm font-medium">${results.data.value[i].name}</p>
			<p class="secondaryColor pointer-events-none block text-sm font-medium">${results.data.value[i].width}x${results.data.value[i].height} (${formatBytes(results.data.value[i].contentSize.split(' ')[0])})</p>
		`;
		html += "</li>";
	}
	html += "</ul>";
	document.getElementById('results').innerHTML = html;
}

function displayVideoResults(results){
	if(results.error === 429){
		changeDialog(2, "You are sending too many requests! Please wait 10 seconds before executing this action again.");
		show('dialog');
		return;
	}

	if(results.error !== 0) return;
	if(typeof(results.data?.value) !== 'object') return;
	document.getElementById('results').className = "max-w-7xl w-full space-y-6";

	let html = "";

	html += `<p class="secondaryColor text-sm">About ${results.data?.totalEstimatedMatches.toLocaleString()} results (${querySpeed}ms)</p>`;
	html += `<ul role="list" class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">`;
	for(let i = 0; i < results.data.value.length; i++){
		html += `<li class="relative">`;
		html += `
			<div class="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus:outline-none">
				<a href="${results.data.value[i].contentUrl}">
					<img src="${results.data.value[i].thumbnailUrl}" alt="${results.data.value[i].name}" loading="lazy" class="object-cover group-hover:opacity-75">
				</a>
			</div>
			<a href="${results.data.value[i].contentUrl}" class="tertiaryColor mt-2 block text-base font-medium truncate">${results.data.value[i].name}</a>
			<p class="secondaryColor pointer-events-none block text-sm font-medium truncate">${formatViews(results.data.value[i].viewCount)} views &middot; ${formatPublishedDate(results.data.value[i].datePublished)}</p>
			<p class="secondaryColor pointer-events-none block text-sm font-medium truncate">${results.data.value[i].publisher[0].name} &middot; ${results.data.value[i].creator.name}</p>
		`;
		html += "</li>";
	}
	html += "</ul>";
	document.getElementById('results').innerHTML = html;
}

function changeCategory(selectedCategory){
	if(!categories.includes(selectedCategory)) return;
	if(selectedCategory === category) return;
	localStorage.setItem('category', selectedCategory);
	location.assign('?q=' + query);
}

document.getElementById('category-general').addEventListener('click', () => changeCategory('general'));
document.getElementById('category-images').addEventListener('click', () => changeCategory('images'));
document.getElementById('category-videos').addEventListener('click', () => changeCategory('videos'));
document.getElementById('category-news').addEventListener('click', () => changeCategory('news'));

document.getElementById('category').addEventListener('change', () => changeCategory(document.getElementById('category').value));