if(parms.get('q') !== null){
	document.getElementById('search').value = parms.get('q');
	search(parms.get('q'));
}

function search(query, type){
	fetch('https://api.rabbitsearch.org/search?q=' + encodeURIComponent(query)).then(res => {
		console.log(res.body);
	});
}