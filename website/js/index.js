let querySpeed = 0;

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

function displaySearchResults(results){
	if(results.error !== 0){
		if(results.error === 429){
			document.getElementById('results').innerHTML = `<p class='text-red-500 font-md'>You are sending too many requests! Please wait before executing this action again.</p>`;
		}
		return;
	}
	if(typeof(results.data?.webPages?.value) !== 'object') return;

	let html = "";

	html += `<p class="secondaryColor text-sm">About ${results.data?.webPages?.totalEstimatedMatches.toLocaleString()} results (${querySpeed}ms)</p>`;

	for(let i = 0; i < results.data?.webPages.value.length; i++){
		html += `<p class="secondaryColor">${results.data?.webPages.value[i].name}</p>`;
	}
	document.getElementById('results').innerHTML = html;
}