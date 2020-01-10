// Simulates a match based on selected teams and displays the data to the webpage

function simulate_match() {
	var form = document.getElementById("simulateForm");
	// On submit, do stuff
	form.onsubmit = function(e) {
		e.preventDefault();
		// Simulate the match by evaluating RPIs of each team and drawing up a predicted match score

		// Reset the active team and active team data
		localStorage.simActiveTeam = "0";
		localStorage.simActiveRed = "";
		localStorage.simActiveBlue = "";
		localStorage.simActiveData = "";
		
		// Grab team numbers
		var teamnoR1 = document.getElementById("redTeam1").value;
		var teamnoR2 = document.getElementById("redTeam2").value;
		var teamnoR3 = document.getElementById("redTeam3").value;
		var teamnoB1 = document.getElementById("blueTeam1").value;
		var teamnoB2 = document.getElementById("blueTeam2").value;
		var teamnoB3 = document.getElementById("blueTeam3").value;
		var playDefense = document.getElementById("playDefense").checked;

		// Define team statistics in objects
		var redScore = 0, blueScore = 0;
		var redAuto = 0, blueAuto = 0;
		var redAutoCellsScored = 0, blueAutoCellsScored = 0;
		var redStageCapacity = 0, blueStageCapacity = 0;
		var redPower = 0, bluePower = 0;
		var redPanel = 0, bluePanel = 0;
		var redEndgame = 0, blueEndgame = 0;
		var redBalanced = false, blueBalanced = false;
		var redRP = [false, false, false], blueRP = [false, false, false];
		var redAllRP = 0, blueAllRP = 0;
		var red = [
			{
				teamno: teamnoR1,
				rpi: get_stat(teamnoR1, "rpi"),
				auto: get_stat(teamnoR1, "auto"),
				powerport: get_stat(teamnoR1, "powerport"),
				cp: get_stat(teamnoR1, "cp"),
				endgame: get_stat(teamnoR1, "endgame"),
				defense: get_stat(teamnoR1, "defense"),
				likelyDefending: false
			},
			{
				teamno: teamnoR2,
				rpi: get_stat(teamnoR2, "rpi"),
				auto: get_stat(teamnoR2, "auto"),
				powerport: get_stat(teamnoR2, "powerport"),
				cp: get_stat(teamnoR2, "cp"),
				endgame: get_stat(teamnoR2, "endgame"),
				defense: get_stat(teamnoR2, "defense"),
				likelyDefending: false
			},
			{
				teamno: teamnoR3,
				rpi: get_stat(teamnoR3, "rpi"),
				auto: get_stat(teamnoR3, "auto"),
				powerport: get_stat(teamnoR3, "powerport"),
				cp: get_stat(teamnoR3, "cp"),
				endgame: get_stat(teamnoR3, "endgame"),
				defense: get_stat(teamnoR3, "defense"),
				likelyDefending: false
			}
		];
		var blue = [
			{
				teamno: teamnoB1,
				rpi: get_stat(teamnoB1, "rpi"),
				auto: get_stat(teamnoB1, "auto"),
				powerport: get_stat(teamnoB1, "powerport"),
				cp: get_stat(teamnoB1, "cp"),
				endgame: get_stat(teamnoB1, "endgame"),
				defense: get_stat(teamnoB1, "defense"),
				likelyDefending: false
			},
			{
				teamno: teamnoB2,
				rpi: get_stat(teamnoB2, "rpi"),
				auto: get_stat(teamnoB2, "auto"),
				powerport: get_stat(teamnoB2, "powerport"),
				cp: get_stat(teamnoB2, "cp"),
				endgame: get_stat(teamnoB2, "endgame"),
				defense: get_stat(teamnoB2, "defense"),
				likelyDefending: false
			},
			{
				teamno: teamnoB3,
				rpi: get_stat(teamnoB3, "rpi"),
				auto: get_stat(teamnoB3, "auto"),
				powerport: get_stat(teamnoB3, "powerport"),
				cp: get_stat(teamnoB3, "cp"),
				endgame: get_stat(teamnoB3, "endgame"),
				defense: get_stat(teamnoB3, "defense"),
				likelyDefending: false
			}
		];

		// Calculate the autonomous score of each alliance (easily done, since no defense can be played)
		redAuto = red[0].auto[0] + red[1].auto[0] + red[2].auto[0];
		redStageCapacity += Math.min(9, red[0].auto[1] + red[1].auto[1] + red[2].auto[1]);	// only 9 max can be achieved towards capacity in auto

		blueAuto = blue[0].auto[0] + blue[1].auto[0] + blue[2].auto[0];
		blueStageCapacity += Math.min(9, blue[0].auto[1] + blue[1].auto[1] + blue[2].auto[1]);

		// BZZZZT... DING DING DINGGGG
		// Run teleop simulation and modify team's outputs based on defense
		// Defensive bots will be targeting robots with higher RPIs. Bots with wills of .8 or higher will always play defense
		if (playDefense) {
			// TODO program defense
		} else {
			// Simulate red scoring
			redPower = red[0].powerport[0] + red[1].powerport[0] + red[2].powerport[0];
			redStageCapacity = red[0].powerport[1] + red[1].powerport[1] + red[2].powerport[1];
			let cp2 = false, cp3 = false;
			for (var i = 0; i < red.length; i ++) {
				if (red[i].cp[0]) cp2 = true;
				if (red[i].cp[1]) cp3 = true;
			}
			if (redStageCapacity >= 29) redPanel = 10;
			if (redStageCapacity >= 49) {
				redPanel = 30;
				redRP[2] = true;
			}

			// Simulate blue scoring
			bluePower = blue[0].powerport[0] + blue[1].powerport[0] + blue[2].powerport[0];
			blueStageCapacity = blue[0].powerport[1] + blue[1].powerport[1] + blue[2].powerport[1];
			cp2 = false; cp3 = false;
			for (i = 0; i < blue.length; i ++) {
				if (blue[i].cp[0]) cp2 = true;
				if (blue[i].cp[1]) cp3 = true;
			}
			if (blueStageCapacity >= 29) bluePanel = 10;
			if (blueStageCapacity >= 49) {
				bluePanel = 30;
				blueRP[2] = true;
			}
		}

		// Simulate endgame scoring
		// Red endgame
		var balancers = 0;
		for (i = 0; i < red.length; i ++) {
			if (red[i].endgame[0] == "Parked") redEndgame += 5;
			if (red[i].endgame[1] == true) balancers ++;
		}
		if (balancers < 2) {
			// No balancing, just take all climb points available
			for (i = 0; i < red.length; i ++) {
				if (red[i].endgame[0] == "Hanging") redEndgame += 25;
			}
		} else {
			// Take as many climbers as there are balancers, park the others
			for (i = 0; i < red.length; i ++) {
				if (red[i].endgame[0] == "Hanging" && !red[i].endgame[1]) {
					redEndgame += 5;
					red[i].endgame[0] == "Parked";
				} else if (red[i].endgame[0] == "Hanging" && red[i].endgame[1]) {
					redEndgame += 25;
				}
			}
			redEndgame += 15;
			redBalanced = true;
		}
		if (redEndgame >= 65) redRP[1] = true;

		// Blue endgame
		balancers = 0;
		for (i = 0; i < blue.length; i ++) {
			if (blue[i].endgame[0] == "Parked") blueEndgame += 5;
			if (blue[i].endgame[1] == true) balancers ++;
		}
		if (balancers < 2) {
			// No balancing, just take all climb points available
			for (i = 0; i < blue.length; i ++) {
				if (blue[i].endgame[0] == "Hanging") blueEndgame += 25;
			}
		} else {
			// Take as many climbers as there are balancers, park the others
			for (i = 0; i < blue.length; i ++) {
				if (blue[i].endgame[0] == "Hanging" && !blue[i].endgame[1]) {
					blueEndgame += 5;
					blue[i].endgame[0] == "Parked";
				} else if (blue[i].endgame[0] == "Hanging" && blue[i].endgame[1]) {
					blueEndgame += 25;
				}
			}
			blueEndgame += 15;
			blueBalanced = true;
		}
		if (blueEndgame >= 65) blueRP[1] = true;

		// Tally final scores
		redScore = redAuto + redPower + redPanel + redEndgame;
		blueScore = blueAuto + bluePower + bluePanel + blueEndgame;
		if (redScore > blueScore) redRP[0] = true; else blueRP[0] = true;
		for (i = 0; i < redRP.length; i ++) {
			if (redRP[i]) {
				redAllRP ++;
				if (i == 0) redAllRP ++;
			}
		}
		for (i = 0; i < blueRP.length; i ++) {
			if (blueRP[i]) {
				blueAllRP ++;
				if (i == 0) blueAllRP ++;
			}
		}

		// Assemble display, starting with projection
		var disp = document.getElementById("projection");
		disp.innerHTML = "";
		document.getElementById("simMatchResults").style.display = "block";
		var dispString = ""
		if (redScore - 3 > blueScore)
			dispString = "<h2>RED ALLIANCE PROJECTED TO WIN</h2>";
		else if (blueScore - 3 > redScore)
			dispString = "<h2>BLUE ALLIANCE PROJECTED TO WIN</h2>";
		else dispString = "<h2>MATCH IS A TOSSUP</h2>";
		disp.innerHTML = dispString;

		// Display each team
		var ds = "";
		var teamData = "";
		localStorage.simActiveRed = JSON.stringify(red);	// store red alliance data in persisting storage space
		localStorage.simActiveBlue = JSON.stringify(blue);	// ... and do the same with blue
		for (i = 0; i < red.length; i ++) {
			ds += "<p><a href='#simTeamAttributes' onclick='simDisplayTeam(" + '"red", ' + i + ")'>" + red[i].teamno + "</a></p>";
		}
		document.getElementById("simRedTeams").innerHTML = ds;
		ds = "";
		teamData = "";
		for (i = 0; i < blue.length; i ++) {
			ds += "<p><a href='#simTeamAttributes' onclick='simDisplayTeam(" + '"blue", ' + i + ")'>" + blue[i].teamno + "</a></p>";
		}
		document.getElementById("simBlueTeams").innerHTML = ds;

		// Display scores
		document.getElementById("simRedScore").innerHTML = "<h3>" + redScore + "</h3>";
		document.getElementById("simBlueScore").innerHTML = "<h3>" + blueScore + "</h3>";

		// Light up RP indicators
		var rpBoxes = document.getElementsByClassName("simRPBox");
		for (i = 0; i < 3; i ++) {
			if (redRP[i]) rpBoxes[i].classList.add("complete"); else rpBoxes[i].classList.remove("complete");
		}
		for (i = 0; i < 3; i ++) {
			if (blueRP[i]) rpBoxes[i + 3].classList.add("complete"); else rpBoxes[i + 3].classList.remove("complete");
		}

		// Display match statistics
		// Red stats
		ds = "";
		ds += "<p><strong>" + redAllRP + " RP</strong></p>";
		ds += "<p>Auto: " + redAuto + "</p>";
		ds += "<p>Power Cells: " + redPower + "</p>";
		ds += "<p>Control Panel: " + redPanel + "</p>";
		ds += "<p>Endgame: " + redEndgame + "</p>";
		document.getElementById("simRedBreakdown").innerHTML = ds;

		// Blue stats
		ds = "";
		ds += "<p><strong>" + blueAllRP + " RP</strong></p>";
		ds += "<p>Auto: " + blueAuto + "</p>";
		ds += "<p>Power Cells: " + bluePower + "</p>";
		ds += "<p>Control Panel: " + bluePanel + "</p>";
		ds += "<p>Endgame: " + blueEndgame + "</p>";
		document.getElementById("simBlueBreakdown").innerHTML = ds;
	}
}

function simDisplayTeam(alliance, index) {
	var teamno;
	var box = document.getElementById("simTeamAttributes");
	var teamStats, allianceStats;
	var ds = "";
	console.log("started");
	if (localStorage.simActiveBlue == "") {
		console.log("nope");
		ds = "<p><em>Click on a team above to view their individual output</em></p>";
	} else {
		// Obtain red or blue alliance data
		if (alliance == "red") {
			allianceStats = JSON.parse(localStorage.simActiveRed);
		} else allianceStats = JSON.parse(localStorage.simActiveBlue);
		teamStats = allianceStats[index];
		teamno = teamStats.teamno;
		
		// Collect team's attributes from its object
		ds = "<h3>" + teamno + "</h3><h4>" + get_team_name(teamno.toString()) + "</h4>";
		ds += "<p>RPI: " + teamStats.rpi[0] + " (" + teamStats.rpi[1] + ")</p>";
		ds += "<p># of Auto Cells Scored: " + teamStats.auto[1] + "</p>";
		ds += "<p># of Teleop Cells Scored: " + teamStats.powerport[1] + "</p>";
		ds += "<p>Endgame Status: " + teamStats.endgame[0] + "</p>";
		
		// Print defensive statistics
		var dstrength = teamStats.defense[0], dodds = teamStats.defense[1];
		var dss = "", dos = "";
		if (dstrength <= 3)
			dss = "Very Weak";
		else if (dstrength <= 6)
			dss = "Weak";
		else if (dstrength <= 9)
			dss = "Moderate";
		else if (dstrength <= 13)
			dss = "<strong>Strong</strong>";
		else dss = "<strong style='color: red;'>Very Strong</strong>";
		
		if (dodds <= 0)
			dos = "Impossible";
		else if (dodds <= 0.35)
			dos = "Low";
		else if (dodds <= 0.45)
			dos = "Moderate";
		else if (dodds <= 0.75)
			dos = "High";
		else if (dodds <= 0.85)
			dos = "<strong>Very High</strong>";
		else dos = "<strong style='color: red;'>Probable</strong>";
			
		ds += "<p>Odds of Playing Defense: " + dos + "</p>";
		ds += "<p>Defensive Threat: " + dss + " (" + dstrength + ")</p>";
	}
	box.innerHTML = ds;
}