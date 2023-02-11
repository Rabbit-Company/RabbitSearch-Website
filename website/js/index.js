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

function displayResults(data, type = 'search'){
	console.log("Error: " + data.error);
	if(data.error !== 0) return;
	console.log("Type: " + typeof(data.webPages?.value));
	if(typeof(data.webPages?.value) !== 'object') return;

	console.log("Name: " + data.webPages.value[0].name);
	let html = "";
	for(let i = 0; i < data.webPages.value.length; i++){
		html += `<p>${data.webPages.value[i].name}</p>`;
	}
	document.getElementById('results').innerHTML = html;
}