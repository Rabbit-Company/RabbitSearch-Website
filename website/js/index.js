if(parms.get('q') !== null){
	document.getElementById('search').value = parms.get('q');
	search(parms.get('q')).then((data) => {
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
	if(results.error !== 0) return;
	if(typeof(results.data?.webPages?.value) !== 'object') return;

	let html = "";

	html += `<p class="secondaryColor">About ${results.data?.webPages?.totalEstimatedMatches} results</p>`;

	for(let i = 0; i < results.data?.webPages.value.length; i++){
		html += `<p>${results.data?.webPages.value[i].name}</p>`;
	}
	document.getElementById('results').innerHTML = html;
}