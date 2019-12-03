// Contains a script which will show a given form with all proper and consistent formatting conventions
// In addition, this also contains the script used to delete a form from memory

// Takes two arguments: an OBJECT instance of a form and an HTML element object and spews out all the data pertaining to the form
function form_print_data(form, element) {
	var name = form.name;
	var formID = form.formID;
	var teamno = form.teamno;
	var matchno = form.matchno;
	var teamname = get_team_name(teamno);
	
	var displayString = "";
	
	// General information
	displayString += "<article class = " + '"formData">';
	displayString += "<h2>" + teamno + "</h2>";
	displayString += "<h3>" + teamname + "</h3>";
	displayString += '<ul class = "qualityList"><li>Scouter Name: ' + name + '</li>';
	displayString += "<li>Form ID: form-" + teamno + "-" + formID + "</li>";
	displayString += "<li>Collected during match #: " + matchno + "</li></ul>";
	
	// Sandstorm
	displayString += '<ul class = "qualityList"><li class="rate">Sandstorm Level: <strong>' + form.sslevel + '</strong></li>';
	displayString += '<li><i>"' + form.ssscoring + '"</i></li><br class="breaksmall"/>';
	
	// Cargo ship, rocket ship stuff
	displayString += '<li class="rate">Cargo Ship - Cargo Rating: <strong>' + form.cscargo + '</strong></li>';
	if (form.cscargo != "0" && form.cscargo != "-1") displayString += '<li><i>"' + form.cscargoexp + '"</i></li><br class="breaksmall"/>'; else displayString += '</li><br class="breaksmall"/>';
	
	displayString += '<li class="rate">Rocket - Cargo Rating: <strong>' + form.rcargo + '</strong></li>';
	if (form.rcargo != "0" && form.rcargo != "-1") displayString += '<li><i>"' + form.rcargoexp + '"</i></li><br class="breaksmall"/>'; else displayString += '</li><br class="breaksmall"/>';
	
	displayString += '<li class="rate">Cargo Ship - Hatch Rating: <strong>' + form.cshatch + '</strong></li>';
	if (form.cshatch != "0" && form.cshatch != "-1") displayString += '<li><i>"' + form.cshatchexp + '"</i></li><br class="breaksmall"/>'; else displayString += '</li><br class="breaksmall"/>';
	
	displayString += '<li class="rate">Rocket - Hatch Rating: <strong>' + form.rhatch + '</strong></li>';
	if (form.rhatch != "0" && form.rhatch != "-1") displayString += '<li><i>"' + form.rhatchexp + '"</i></li></ul>'; else displayString += '</li></ul>';
	
	// Defensive ability
	displayString += '<ul class = "qualityList"><li class="rate">Defense: <strong>' + form.defense + '</strong></li>';
	if (form.defense != "0") {
		displayString += '<li><strong>Rating: ' + form.defenserate + '</strong></li>';
		displayString += '<li><i>"' + form.defenseexp + '"</i></li></ul>';
	} else displayString +="</ul>"
	
	displayString += '<ul class = "qualityList"><li class="rate">Climb Level: <strong>' + form.climb + '</strong></li>';
	displayString += '<li><strong>Rating: ' + form.climbrate + '</strong></li>';
	displayString += '<li><i>"' + form.climbexp + '"</i></li></ul>';
	
	if (form.comments != "") displayString += '<p>Comments: <i>"' + form.comments + '"</i></p>'
	
	// Checkmarks
	displayString += '<ul class = "qualityList">';
	if (form.goodpick == "true") {
		displayString += 'This team was identified as a good team to choose during selections.<br>';
	} else displayString += 'This team was <i>not</i> identified as a good team to choose during selections.<br>';
	if (form.penalties == "true") {
		displayString += '<span style="color: #CA0033">This team was identified as incurring great penalties OR a yellow/red card during this match.</span><br>';
	}
	if (form.breakdown == "true") {
		displayString += '<span style="color: #CA0033">This team broke down, tipped over, or lost communications during this match.</span>';
	}
	displayString += '</ul>';
	
	// Delete form link
	displayString += '<a href="#" onclick="delete_form(' + formID + ')">Delete this form</a>';
	
	// Finishing it off
	displayString += "</article>"
	
	element.innerHTML += displayString;
}

// Erase a form from storage
function delete_form(formID) {
	// The boys are back, parse 'em
	var teamList = JSON.parse(localStorage.teamList);
	var formList = JSON.parse(localStorage.formList);
	var teamsWithData;
	if (localStorage.masterInit) {
		teamsWithData = JSON.parse(localStorage.teamsWithData);
	}
	var deleteIndex = formList.indexOf(formID);
	if (deleteIndex > -1) {
		var teamno = teamList[deleteIndex];
		teamList.splice(deleteIndex, 1);
		formList.splice(deleteIndex, 1);
		localStorage.sheets = Number(localStorage.sheets) - 1;
		if (teamList.length < 1) {
			// You just deleted the last form
			var refString;
			if (localStorage.masterInit) {
				refString = "master_main.html"; 
			} else refString = "scouter_main.html";
			localStorage.clear();
			window.location.href = refString;
		} else {
			if (localStorage.masterInit && teamList.indexOf(teamno) == -1) teamsWithData.splice(teamsWithData.indexOf(teamno), 1);
			localStorage.removeItem("form-" + teamno + "-" + formID);

			// Overwrite team and form lists
			localStorage.teamList = JSON.stringify(teamList);
			localStorage.formList = JSON.stringify(formList);
			if (localStorage.masterInit) {
				localStorage.teamsWithData = JSON.stringify(teamsWithData);
				window.location.href = "master_main.html"; 
			} else window.location.href = "scouter_main.html";
		}
	} else alert("Somehow that form doesn't exist and the operation could not be completed. Reload the page and try again.");
}

