window.addEventListener('load', function() {
	var form = document.getElementById("import");

	// On submit, do stuff
	form.onsubmit = function(e) {
		e.preventDefault(); 

		// Delete any existing data used to complete this process last time, up to 50 files
		for (var i = 0; i < 50; i ++) {
			if (localStorage.getItem("content" + i) !== undefined) localStorage.removeItem("content" + i);
		}
		var fileBatch = document.getElementById("dImport"); 


		if ('files' in fileBatch) {
			if (fileBatch.files.length == 0) {
				// Warn the user that they didn't put any files into the form
				alert("You didn't add any files. Click the button to choose files to upload.");
			} else {
				// Transfer all the data from the file uploads into the master scouter's database
				// Pull data from multiple files
				var fileno = fileBatch.files.length;
				for (i = 0; i < fileno; i ++) {
					addFromReader(fileBatch.files[i], i);
				}
				// This timeout is to ensure all asynchronous events have been complete before attempting to use the data
				setTimeout(function() {
					// Shove all data into one array so we can easily iterate through the data
					var jsonArray = new Array(0);
					for (var i = 0; i < fileno; i ++) {
						jsonArray.push(localStorage.getItem("content" + i));
					}
					// Begin to parse the JSONs one by one
					var teamList = new Array(0);
					var formList = new Array(0);
					var teamsWithData = new Array(0);
					var sheets = 0;
					// Iterate through each JSON file within the jsonArray
					for (i = 0; i < jsonArray.length; i ++) {
						// removed double JSON parse call here
						var myFile = JSON.parse(jsonArray[i]);	
						console.log(myFile);
						var myFormNames = Object.keys(myFile);	// extract only the full names of each form
						var exportVer = parseFloat(myFile.EXPORT_VERSION, 10);
						// File is from a different year. DON'T IMPORT
						if (Math.floor(exportVer) != Math.floor(get_version())) {
							alert("A file is from a different scouter version and different year. This file cannot be imported and it has been skipped.");
						} else {
							// Versions might be slightly different. Check for this and don't import files from future versions
							if (exportVer > get_version()) {
								// File is newer than scouter. DON'T IMPORT
								alert("A file is from a newer version of the scouter than this one. This file cannot be imported and it has been skipped.");
								continue;
							}
							// Known version discrepency issues. Block import
							if (exportVer == 2019.1 && exportVer < get_version()) {
								alert("A file is from an older version known to have breaking issues with this version. This file cannot be imported and it has been skipped.");
								continue;
							}
							if (exportVer < get_version()) {
								// File is older than scouter. Import anyway but prompt
								alert("A file is from an older version of the scouter than this one. This file has been imported, but its contents could possibly cause issues.");
							}
							// Iterate through each form in this file, but skip the object containing the version number
							for (var j = 0; j < myFormNames.length - 1; j ++) {
								// Now access the JSONs within the JSON
								// Jesus Christ it's JSON Bourne
								var thisFormName = myFormNames[j];
								var thisForm = myFile[thisFormName];
								var localListCheck;
								if (localStorage.masterInit) {
									// Check if this form already exists in the database
									console.log(localStorage.getItem(thisFormName));
									if (localStorage.getItem(thisFormName) == undefined) {
										// Add to database
										formList.push(thisForm.formID);
										teamList.push(thisForm.teamno);
										localListCheck = teamsWithData.indexOf(thisForm.teamno);
										var databaseListCheck = JSON.parse(localStorage.teamsWithData).indexOf(thisForm.teamno);
										if (localListCheck == -1 && databaseListCheck == -1) teamsWithData.push(thisForm.teamno);
										teamsWithData.sort((a,b) => Number(a) - Number(b));
										sheets ++;
										// Set the new data entries into localStorage
										localStorage.setItem(thisFormName, JSON.stringify(thisForm));
									} else console.log("Form with form ID " + thisFormName + " was thrown out: duplicate form");
								} else {
									if (localStorage.getItem(thisFormName) == undefined) {
										// Add to database
										formList.push(thisForm.formID);
										teamList.push(thisForm.teamno);
										localListCheck = teamsWithData.indexOf(thisForm.teamno);
										if (localListCheck == -1) teamsWithData.push(thisForm.teamno);
										teamsWithData.sort((a,b) => Number(a) - Number(b));
										sheets ++;
										// Set the new data entries into localStorage
										localStorage.setItem(thisFormName, JSON.stringify(thisForm));
									} else console.log("Form with form ID " + thisFormName + " was thrown out: duplicate form");
								}
							}
						}
					}
					// Append the data/arrays that were just compiled with the existing ones in localStorage
					if (!localStorage.masterInit) {
						// The data/arrays haven't actually been created yet
						localStorage.setItem("teamList", JSON.stringify(teamList));
						localStorage.setItem("formList", JSON.stringify(formList));
						localStorage.setItem("teamsWithData", JSON.stringify(teamsWithData));
						localStorage.setItem("sheets", sheets);
						localStorage.masterInit = true;
					} else {
						var taTeamList, taFormList, taTeamsWithData, taSheets;	// temporary array
						taTeamList = JSON.parse(localStorage.getItem("teamList"));
						taFormList = JSON.parse(localStorage.getItem("formList"));
						taTeamsWithData = JSON.parse(localStorage.getItem("teamsWithData"));
						teamsWithData = teamsWithData.concat(taTeamsWithData);
						teamsWithData.sort((a,b) => Number(a) - Number(b));
						taSheets = localStorage.getItem("sheets");
						localStorage.setItem("teamList", JSON.stringify(taTeamList.concat(teamList)));
						localStorage.setItem("formList", JSON.stringify(taFormList.concat(formList)));
						localStorage.setItem("teamsWithData", JSON.stringify(teamsWithData));
						localStorage.setItem("sheets", Number(taSheets) + Number(sheets));
					}

					window.location.href = "master_main.html";
					// At the conclusion of this process, we now have ALL of the localStorage.form-XXXX-XXXXXX that were imported from the files. We also have a localStorage.teamList, localStorage.formList, localStorage.teamsWithData, and localStorage.sheets. There's also localStorage.masterInit
				}, (1000));
			}
		} else alert("An error occurred. Try reloading the page.");
	}
});
// Pulls data from multiple files
function addFromReader(file, fileno) {
	var name = file.name;
	var reader = new FileReader();  
	reader.onload = function(e) {  
		// get file content
		console.log(e.target.result);
		localStorage.setItem("content" + fileno, e.target.result);
	}
	reader.readAsText(file, "UTF-8");
}