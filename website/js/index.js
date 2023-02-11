if(parms.get('q') !== null){
	document.getElementById('search').value = parms.get('q');
	search(parms.get('q')).then((data) => {
		displayResults(data);
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

function displayResults(results, type = 'search'){
	console.log("Error: " + results.error);
	if(results.error !== 0) return;
	console.log("Type: " + typeof(results.data?.webPages?.value));
	if(typeof(results.data?.webPages?.value) !== 'object') return;

	console.log("Name: " + results.data?.webPages.value[0].name);
	let html = "";
	for(let i = 0; i < results.data?.webPages.value.length; i++){
		html += `<p>${results.data?.webPages.value[i].name}</p>`;
	}
	document.getElementById('results').innerHTML = html;
}