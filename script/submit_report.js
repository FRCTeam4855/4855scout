// All the code to submit a scouting report

window.addEventListener('load', function() {
	var form = document.getElementById("scout");

	// On submit, do stuff
	form.onsubmit = function(e) {
		e.preventDefault(); 
		var name = "", teamno = "", matchno = "", timestamp = "", eventkey = "", formtype = "", formID;
		var autocross = "", autolow = "", autohigh = "";
		var lowport = "", highport = "", cp2 = "", cp3 = "";
		var defense = "", defenserate = "", defenseexp = "";
		var climb = "", climbattempt = "", climblevel = "";
		var inner = "", penalties = "", breakdown = "", comments = "";
		
		var drivetrain = "", trench = "", weight = "";
		
		if (localStorage.source == "scout") localStorage.init = true;

		// If there are no sheets, start counting them
		if (localStorage.source != "edit") {
			if (localStorage.sheets) {
				localStorage.sheets = Number(localStorage.sheets) + 1;
			} else {
				localStorage.sheets = 1;
			}
		}
		
		// Universal information, generation of a unique form ID and the assignment of variables to form inputs
		formtype = document.getElementById("formtype").value;
		formID = Math.round(Math.random() * (999999 - 100000) + 100000);
		if (localStorage.source == "edit" && localStorage.overrideEditID) formID = localStorage.overrideEditID;
		name = document.getElementById("inName").value.trim();
		teamno = document.getElementById("inTeamno").value.trim();	// team numbers are handled as strings
		eventkey = document.getElementById("inEventkey").value;
		var d = new Date();
		var m = d.getMonth() + 1;
		timestamp = m.toString() + "-" + d.getDate() + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
		comments = document.getElementById("inComments").value;
		var formObj;
		
		if (formtype == "verbal") {
			// Verbal form values
			drivetrain = document.getElementById("inDrivetrain").value;
			weight = document.getElementById("inWeight").value;
			trench = document.getElementById("inTrench").checked.toString();
			//innerport = document.getElementById("inInnerport").value;
			defense = document.getElementById("inDefense").value;
			cp2 = document.getElementById("inCp2").checked.toString();
			cp3 = document.getElementById("inCp3").checked.toString();
			
			// Convert form inputs into an object
			formObj = {
				"formID": formID, 
				"name": name, 
				"teamno": teamno, 
				"formtype": formtype,
				"timestamp": timestamp,
				"eventkey": eventkey,
				"drivetrain": drivetrain,
				"weight": weight,
				"trench": trench,
				//"innerport": innerport,
				"defense": defense,
				"cp2": cp2,
				"cp3": cp3,
				"comments": comments
			};
		} else {
			// Match form values
			matchno = document.getElementById("inMatchno").value.trim();
			
			if (document.getElementById("inAutocross").checked) autocross = "1"; else autocross = "0";
			autolow = document.getElementById("inAutolow").value;
			autohigh = document.getElementById("inAutohigh").value;

			lowport = document.getElementById("inLowport").value;
			highport = document.getElementById("inHighport").value;
			cp2 = document.getElementById("inCp2").checked;
			if (cp2) cp2 = "1"; else cp2 = "0";
			cp3 = document.getElementById("inCp3").checked;
			if (cp3) cp3 = "1"; else cp3 = "0";

			defense = document.getElementById("inDefense").value;
			defenserate = document.getElementById("inDefenserate").value;
			defenseexp = document.getElementById("inDefenseexp").value;

			climb = document.getElementById("inClimb").value;
			climbattempt = document.getElementById("inClimbattempt").checked.toString();
			climblevel = document.getElementById("inClimblevel").value;
			
			inner = document.getElementById("inInner").checked.toString();
			penalties = document.getElementById("inPenalties").checked.toString();
			breakdown = document.getElementById("inBreakdown").checked.toString();

			// Convert form inputs into an object
			formObj = {
				"formID": formID, 
				"name": name, 
				"teamno": teamno, 
				"matchno": matchno,
				"formtype": formtype,
				"timestamp": timestamp,
				"eventkey": eventkey,
				"autocross": autocross,
				"autolow": autolow,
				"autohigh": autohigh,
				"lowport": lowport,
				"highport": highport,
				"cp2": cp2,
				"cp3": cp3,
				"defense": defense,
				"defenserate": defenserate,
				"defenseexp": defenseexp,
				"climb": climb,
				"climbattempt": climbattempt,
				"climblevel": climblevel,
				"inner": inner,
				"penalties": penalties,
				"breakdown": breakdown,
				"comments": comments
			};
		}
		
		// File processing
		var formJSON = JSON.stringify(formObj);
		localStorage.setItem("form-" + teamno + "-" + formID.toString(), formJSON);

		// Start compiling a list of just form IDs if one doesn't exist yet, otherwise just add to the list
		var formList, teamList;
		if (localStorage.source != "edit") {
			if (localStorage.formList) {
				formList = JSON.parse(localStorage.formList);
				formList.push(formID);
				localStorage.formList = JSON.stringify(formList);

				teamList = JSON.parse(localStorage.teamList);
				teamList.push(teamno);
				localStorage.teamList = JSON.stringify(teamList);
			} else {
				formList = [ formID ];
				localStorage.formList = JSON.stringify(formList);

				teamList = [ teamno ];
				localStorage.teamList = JSON.stringify(teamList);
			}
		}
		
		// If we're submitting this report from the perspective of the master scouter then we do it a little differently
		if (localStorage.source == "master") {
			var teamsWithData = [teamno];
			if (!localStorage.masterInit) {
				localStorage.masterInit = true;
				localStorage.setItem("teamsWithData", JSON.stringify(teamsWithData));
			} else {
				var taTeamsWithData = JSON.parse(localStorage.getItem("teamsWithData"));
				if (taTeamsWithData.indexOf(teamno) == -1) {
					teamsWithData = teamsWithData.concat(taTeamsWithData);
					teamsWithData.sort((a,b) => Number(a) - Number(b));
					localStorage.setItem("teamsWithData", JSON.stringify(teamsWithData));
				}
			}
			window.location.href = "master_main.html";
		} else if (localStorage.source == "scout") window.location.href = "scouter_main.html"; else if (localStorage.source == "edit") {
			// Redirect back to the team/form window
			if (localStorage.masterInit) {
				localStorage.currentTeam = teamno;
				window.location.href = "master_view_team.html";
			} else {
				localStorage.currentID = "form-" + teamno + "-" + formID;
				window.location.href = "scout_view_data.html";
			}
		}
		
		// At the conclusion of this process, we now have localStorage.form-XXXX-XXXXXX, which contains the form the user just filled out, as well as localStorage.formList, an array of IDs, localStorage.teamList, an array of teams which the formList correlates to, and localStorage.sheets, the number of entries that have been produced by the user. localStorage.init should also be ticked.
	}
});