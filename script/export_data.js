// Code for exporting a set of forms

function export_data(dataType) {
	if ((dataType == "scouter" && localStorage.init) || (dataType == "master" && localStorage.masterInit)) {
		// Compile all JSONs into one JSON
		var formID, JSONlist, scoutList = {};
		var teamList = JSON.parse(localStorage.teamList);
		var formList = JSON.parse(localStorage.formList);
		for (let i = 0; i < localStorage.sheets; i ++) {
			formID = "form-" + teamList[i] + "-" + formList[i];
			scoutList[formID] = JSON.parse(localStorage.getItem(formID));
		}
		scoutList.EXPORT_VERSION = get_version();
		//JSONlist = JSON.stringify(scoutList);
		JSONlist = scoutList;			// prior line was stringifying JSON data twice
		
		// Create a unique ID for this set of data
		let dataID = Math.round(Math.random() * (999999 - 100000) + 100000);

		// Download the JSON file with all scouting data in it
		// The file will be named "data-2019.0-123456" (version number, random ID number)
		var prefix = "data-";
		var exportVer = get_version_string() + "-";
		if (dataType == "master") prefix = "MASTERDUMP-";
		downloadObjectAsJson(JSONlist, prefix + exportVer + dataID.toString());
	} else alert("You can't export when you haven't scouted any teams yet!");
}
function downloadObjectAsJson(exportObj, exportName){
	// Download a JSON file
	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
	var downloadAnchorNode = document.createElement('a');
	downloadAnchorNode.setAttribute("href",     dataStr);
	downloadAnchorNode.setAttribute("download", exportName + ".json");
	document.body.appendChild(downloadAnchorNode); // required for firefox
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}