var parms = new URLSearchParams(window.location.search);
const IsNumeric = (num) => /^-{0,1}\d*\.{0,1}\d+$/.test(num);

function fhide(element){
	document.getElementById(element).style.display = 'none';
}

function fshow(element, method){
	document.getElementById(element).style.display = method;
}

function hide(element){
	document.getElementById(element).style.visibility = 'hidden';
}

function show(element){
	document.getElementById(element).style.visibility = 'visible';
}

function isHidden(element){
	return (document.getElementById(element).style.visibility == 'hidden');
}

function isfHidden(element){
	return (document.getElementById(element).style.display == 'none');
}

function setText(element, text){
	document.getElementById(element).innerText = text;
}

function animateButton(id, enabled){
	if(enabled){
		document.getElementById(id + "-color").className = "quaternaryBackgroundColor pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200";
		document.getElementById(id + "-animation").className = "translate-x-5 pointer-events-none absolute left-0 inline-block h-5 w-5 rounded-full tertiaryBackgroundColor shadow transform ring-0 transition-transform ease-in-out duration-200";
	}else{
		document.getElementById(id + "-color").className = "primaryBackgroundColor pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200";
		document.getElementById(id + "-animation").className = "translate-x-0 pointer-events-none absolute left-0 inline-block h-5 w-5 rounded-full tertiaryBackgroundColor shadow transform ring-0 transition-transform ease-in-out duration-200";
	}
}

function toggleMenu(){
	if(document.getElementById("main-menu").className === 'fixed inset-0 flex z-40'){
		document.getElementById("main-menu").className = 'fixed inset-0 flex z-40 hidden';
	}else{
		document.getElementById("main-menu").className = 'fixed inset-0 flex z-40';
	}
}

function toggleButton(id){
	let button = document.getElementById(id);
	if(button.className.includes('successButton')){
		button.innerText = lang["disable"];
		button.className = "dangerButton font-bold inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md focus:outline-none sm:text-sm";
	}else{
		button.innerText = lang["enable"];
		button.className = "successButton font-bold inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md focus:outline-none sm:text-sm";
	}
}

function copyToClipboard(text){
	let textArea = document.createElement("textarea");
	textArea.value = text;

	textArea.style.top = 0;
	textArea.style.left = 0;
	textArea.style.position = "fixed";

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	document.execCommand('copy');
	document.body.removeChild(textArea);
}

function downloadTxt(exportTxt, exportName){
	let dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(exportTxt);
	let downloadAnchorNode = document.createElement('a');
	downloadAnchorNode.setAttribute("href", dataStr);
	downloadAnchorNode.setAttribute("download", exportName);
	document.body.appendChild(downloadAnchorNode); // required for firefox
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}

function downloadObjectAsJson(exportObj, exportName){
	let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
	let downloadAnchorNode = document.createElement('a');
	downloadAnchorNode.setAttribute("href", dataStr);
	downloadAnchorNode.setAttribute("download", exportName + ".json");
	document.body.appendChild(downloadAnchorNode); // required for firefox
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}

function getDate(date){
	let local = new Date(date);
	local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
	return local.toJSON().slice(0, 10);
}

function showDialogButtons(){
	document.getElementById('dialog-button').style.display = "";
	document.getElementById('dialog-button-cancel').style.display = "";
}

function hideDialogButtons(){
	document.getElementById('dialog-button').style.display = "none";
	document.getElementById('dialog-button-cancel').style.display = "none";
}

async function generateHash(message){
	const msgUint8 = new TextEncoder().encode(message);
	const hashBuffer = await crypto.subtle.digest('SHA-512', msgUint8);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

const escapeHtml = (unsafe) => {
	return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}