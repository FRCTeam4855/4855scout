// Contains a script which will show a given form with all proper and consistent formatting conventions
// In addition, this also contains the script used to delete a form from memory

// Takes two arguments: an OBJECT instance of a form and an HTML element object and spews out all the data pertaining to the form
function form_print_data(form, element) {
	var name = form.name;
	var formID = form.formID;
	var formtype = form.formtype;
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
	if (formtype == "match") {
		displayString += "<li>Collected during match #" + matchno + " at event: " + form.eventkey + "</li>";
	} else {
		displayString += "<li>Collected at event: " + form.eventkey + "</li>";
	}
	displayString += "<li>Timestamp: " + form.timestamp + "</li></ul>";
	
	// Autonomous
	if (formtype == "match") {
		displayString += '<ul class = "qualityList"><li class="rate">Total RPI</li><li>Est. Point Contribution: <strong>' + calculate_rpi([form], true, false, "", true, get_match_key(form.eventkey, matchno)) + '</strong></li></ul>';
		
		let autocross;
		if (form.autocross == "1") autocross = "Yes"; else autocross = "No";
		displayString += '<ul class = "qualityList"><li class="rate">Autonomous Scoring</li><li>Autocross?: <strong>' + autocross + '</strong></li>';
		displayString += '<li>Auto - Low Goal: <strong>' + form.autolow + '</strong></li>';
		displayString += '<li>Auto - High Goal: <strong>' + form.autohigh + '</strong></li><br class="breaksmall"/>';

		// Power Port, Control Panel scoring
		displayString += '<li class="rate">Teleop Scoring</li><li>Power Port - Low Goal: <strong>' + form.lowport + '</strong></li>';
		displayString += '<li>Power Port - High Goal: <strong>' + form.highport + '</strong></li>';

		let cp2, cp3;
		if (form.cp2 == "1") cp2 = "Yes"; else cp2 = "No";
		if (form.cp3 == "1") cp3 = "Yes"; else cp3 = "No";
		displayString += '<li>Control Panel - Stg. 2 Activation: <strong>' + cp2 + '</strong></li>';

		displayString += '<li>Control Panel - Stg. 3 Activation: <strong>' + cp3 + '</strong></li></ul>';

		// Defensive ability
		displayString += '<ul class = "qualityList"><li class="rate">Defensive Effort</li>';
		if (form.defense == "1") {
			switch (form.defenserate) {
				case "0":
					displayString += '<li>Team ' + teamno + ' attempted defense during the match.</li>';
					break;
				case "1":
					displayString += '<li>Team ' + teamno + ' attempted defense during the match & received a <strong>poor</strong> rating.</li>';
					break;
				case "2":
					displayString += '<li>Team ' + teamno + ' attempted defense during the match & received a <strong>strong</strong> rating.</li>';
					break;
			}
			if (form.defenseexp != "") displayString += '<li><i>"' + form.defenseexp + '"</i></li>';
			displayString += '</ul>';
		} else displayString += "<li>Team " + teamno + " did not attempt defense during this match.</li></ul>"

		// Climb and comments
		let climb = "No park";
		if (form.climb == "1") climb = "Parked"; else if (form.climb == "2") climb = "Climbed";
		displayString += '<ul class = "qualityList"><li class="rate">Climb Performance</li><li>Climb Outcome: <strong>' + climb + '</strong></li>';
		let climblevel = "No";
		if (form.climblevel == "1") climblevel = "Yes";
		displayString += '<li>Leveled with a partner?: <strong>' + climblevel + '</strong></li></ul>';

		if (form.comments != "") displayString += '<p>Comments: <i>"' + form.comments + '"</i></p>';

		// Checkmarks
		displayString += '<ul class = "qualityList">';
		if (form.goodpick == "true") {
			displayString += 'This team was identified as a good team to choose during selections.<br>';
		}
		if (form.penalties == "true") {
			displayString += '<span style="color: #CA0033">This team was identified as incurring great penalties OR a yellow/red card during this match.</span><br>';
		}
		if (form.breakdown == "true") {
			displayString += '<span style="color: #CA0033">This team broke down, tipped over, or lost communications during this match.</span>';
		}
		displayString += '</ul>';
	} else {
		// Verbal form printing
		// Just list everything the team had to say
		displayString += '<ul class="qualityList"><li class="rate">Attributes</li><li>Drivetrain: <strong>' + form.drivetrain + '</strong></li>';
		displayString += '<li>Robot Weight: <strong>' + form.weight + ' lbs</strong></li>';
		if (form.innerport == "0") {
			displayString += '<li>Team ' + teamno + ' indicated that they are <strong>inconsistent</strong> when attempting to hit the inner port.</li>';
		} else displayString += '<li>Team ' + teamno + ' indicated that they <strong>frequently hit</strong> the inner port when shooting.</li>';
		switch (form.defense) {
			case "0":
				displayString += '<li>Defensive ability: <strong>Complete incapability</strong></li>';
				break;
			case "1":
				displayString += '<li>Defensive ability: <strong>Would rather not</strong></li>';
				break;
			case "2":
				displayString += '<li>Defensive ability: <strong>Able and willing</strong></li>';
				break;
		}
		let cp2, cp3;
		if (form.cp2 == "1") cp2 = "Able"; else cp2 = "Unable";
		if (form.cp3 == "1") cp3 = "Able"; else cp3 = "Unable";
		displayString += '<li>Control Panel - Stg. 2 Activation: <strong>' + cp2 + '</strong></li>';

		displayString += '<li>Control Panel - Stg. 3 Activation: <strong>' + cp3 + '</strong></li></ul>';
		displayString += '</ul>';
		if (form.comments != "") displayString += '<p>Comments: <i>"' + form.comments + '"</i></p>';
	}
	
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

