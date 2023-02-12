let querySpeed = 0;
const categories = ['general', 'images', 'videos', 'news'];

if(parms.get('c') !== null){
	let category = parms.get('c');
	if(categories.includes(category)){
		document.getElementById('category').value = category;
	}
}

if(parms.get('q') !== null){
	document.getElementById('search').value = parms.get('q');
	search(parms.get('q')).then((data) => {
		querySpeed = performance.now();
		displaySearchResults(data);
	}).catch((error) => {
		console.log("Error: " + error);
	});
}

function search(query, type = 'search'){
	return new Promise((resolve, reject) => {
		fetch('https://api.rabbitsearch.org/search?q=' + encodeURIComponent(query))
		.then((response) => response.json())
		.then((data) => resolve(data))
		.catch((error) => reject(error));
	});
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
			//Error dialog with page refresh
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-red-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' /></svg>";

			document.getElementById('dialog-title').innerText = "ERROR";
			document.getElementById('dialog-text').innerText = text;

			document.getElementById('dialog-button-cancel').style.display = 'none';

			document.getElementById('dialog-button').className = "primaryButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = "Okay";
			document.getElementById('dialog-button').onclick = () => location.reload();
		break;
	}
}

function displaySearchResults(results){

	if(results.error === 429){
		changeDialog(2, "You are sending too many requests! Please wait 10 seconds before executing this action again.");
		show('dialog');
		return;
	}

	if(results.error !== 0) return;
	if(typeof(results.data?.webPages?.value) !== 'object') return;

	let html = "";

	html += `<p class="secondaryColor text-sm">About ${results.data?.webPages?.totalEstimatedMatches.toLocaleString()} results (${querySpeed}ms)</p>`;

	for(let i = 0; i < results.data.webPages.value.length; i++){
		html += `<div>
		<a href="${results.data.webPages.value[i].url}" class="primaryColor text-lg">${results.data.webPages.value[i].name}</a>
		<p class="text-green-600 text-base">${results.data?.webPages.value[i].url}</p>
		<p class="secondaryColor text-sm">${results.data?.webPages.value[i].snippet}</p>`;

		if(typeof(results.data.webPages.value[i].deepLinks) === 'object'){
			html += `<ul role="list" class="mx-auto grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-4 ml-6 mt-3">`;
			for(let j = 0; j < results.data.webPages.value[i].deepLinks.length; j++){
				html += `<li>
				<a href="${results.data.webPages.value[i].deepLinks[j].url}" class="primaryColor text-base">${results.data.webPages.value[i].deepLinks[j].name}</a>
				<p class="secondaryColor text-sm truncate">${results.data.webPages.value[i].deepLinks[j].snippet}</p>
				</li>`;
			}
			html += "</ul>";
		}

		html += "</div>";
	}
	document.getElementById('results').innerHTML = html;
}

function changeCategory(category){
	if(!categories.includes(category)) return;
	location.assign('?q=' + parms.get('q') + '&c=' + category);
}

document.getElementById('category-general').addEventListener('click', () => changeCategory('general'));
document.getElementById('category-images').addEventListener('click', () => changeCategory('images'));
document.getElementById('category-videos').addEventListener('click', () => changeCategory('videos'));
document.getElementById('category-news').addEventListener('click', () => changeCategory('news'));