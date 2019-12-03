// All the code to submit a scouting report

window.addEventListener('load', function() {
	var form = document.getElementById("scout");

	// On submit, do stuff
	form.onsubmit = function(e) {
		e.preventDefault(); 
		var name = "", teamno = "", matchno = "", formID;
		var sslevel = "", ssscoring = "";
		var cscargo = "", cscargoexp = "", rcargo = "", rcargoexp = "";
		var cshatch = "", cshatchexp = "", rhatch = "", rhatchexp = "";
		var defense = "", defenserate = "", defenseexp = "";
		var climb = "", climbrate = "", climbexp = "";
		var goodpick = "", penalties = "", breakdown = "", comments = "";
		
		if (localStorage.source != "master") localStorage.init = true;

		// If there are no sheets, start counting them
		if (localStorage.sheets) {
			localStorage.sheets = Number(localStorage.sheets) + 1;
		} else {
			localStorage.sheets = 1;
		}

		// Generate a unique form ID and assign variables to form inputs
		formID = Math.round(Math.random() * (999999 - 100000) + 100000);
		name = document.getElementById("inName").value;
		teamno = document.getElementById("inTeamno").value;
		matchno = document.getElementById("inMatchno").value;
		
		sslevel = document.getElementById("inSslevel").value;
		ssscoring = document.getElementById("inSsscoring").value;
		
		cscargo = document.getElementById("inCscargo").value;
		cshatch = document.getElementById("inCshatch").value;
		rcargo = document.getElementById("inRcargo").value;
		rhatch = document.getElementById("inRhatch").value;
		cscargoexp = document.getElementById("inCscargoexp").value;
		cshatchexp = document.getElementById("inCshatchexp").value;
		rcargoexp = document.getElementById("inRcargoexp").value;
		rhatchexp = document.getElementById("inRhatchexp").value;
		
		defense = document.getElementById("inDefense").value;
		defenserate = document.getElementById("inDefenserate").value;
		defenseexp = document.getElementById("inDefenseexp").value;
		
		climb = document.getElementById("inClimb").value;
		climbrate = document.getElementById("inClimbrate").value;
		climbexp = document.getElementById("inClimbexp").value;
		
		goodpick = document.getElementById("inGoodpick").checked.toString();
		penalties = document.getElementById("inPenalties").checked.toString();
		breakdown = document.getElementById("inBreakdown").checked.toString();
		comments = document.getElementById("inComments").value;

		// Convert form inputs into an object
		var formObj = {
			"formID": formID, 
			"name": name, 
			"teamno": teamno, 
			"matchno": matchno,
			"sslevel": sslevel,
			"ssscoring": ssscoring,
			"cscargo": cscargo,
			"rcargo": rcargo,
			"cshatch": cshatch,
			"rhatch": rhatch,
			"cscargoexp": cscargoexp,
			"rcargoexp": rcargoexp,
			"cshatchexp": cshatchexp,
			"rhatchexp": rhatchexp,
			"defense": defense,
			"defenserate": defenserate,
			"defenseexp": defenseexp,
			"climb": climb,
			"climbrate": climbrate,
			"climbexp": climbexp,
			"goodpick": goodpick,
			"penalties": penalties,
			"breakdown": breakdown,
			"comments": comments
		};
		var formJSON = JSON.stringify(formObj);
		localStorage.setItem("form-" + teamno + "-" + formID.toString(), formJSON);

		// Start compiling a list of just form IDs if one doesn't exist yet, otherwise just add to the list
		var formList, teamList;
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
		} else window.location.href = "scouter_main.html";
		
		// At the conclusion of this process, we now have localStorage.form-XXXX-XXXXXX, which contains the form the user just filled out, as well as localStorage.formList, an array of IDs, localStorage.teamList, an array of teams which the formList correlates to, and localStorage.sheets, the number of entries that have been produced by the user. localStorage.init should also be ticked.
	}
});