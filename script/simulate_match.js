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
		simDisplayTeam("red", 0);	// refresh individual team data
		
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
		var redStageCapacity = 0, blueStageCapacity = 0;
		var redPower = 0, bluePower = 0;
		var redPanel = 0, bluePanel = 0;
		var redDefensivePrevention = 0, blueDefensivePrevention = 0;
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
				likelyDefending: false,
				likelyDefended: false
			},
			{
				teamno: teamnoR2,
				rpi: get_stat(teamnoR2, "rpi"),
				auto: get_stat(teamnoR2, "auto"),
				powerport: get_stat(teamnoR2, "powerport"),
				cp: get_stat(teamnoR2, "cp"),
				endgame: get_stat(teamnoR2, "endgame"),
				defense: get_stat(teamnoR2, "defense"),
				likelyDefending: false,
				likelyDefended: false
			},
			{
				teamno: teamnoR3,
				rpi: get_stat(teamnoR3, "rpi"),
				auto: get_stat(teamnoR3, "auto"),
				powerport: get_stat(teamnoR3, "powerport"),
				cp: get_stat(teamnoR3, "cp"),
				endgame: get_stat(teamnoR3, "endgame"),
				defense: get_stat(teamnoR3, "defense"),
				likelyDefending: false,
				likelyDefended: false
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
				likelyDefending: false,
				likelyDefended: false
			},
			{
				teamno: teamnoB2,
				rpi: get_stat(teamnoB2, "rpi"),
				auto: get_stat(teamnoB2, "auto"),
				powerport: get_stat(teamnoB2, "powerport"),
				cp: get_stat(teamnoB2, "cp"),
				endgame: get_stat(teamnoB2, "endgame"),
				defense: get_stat(teamnoB2, "defense"),
				likelyDefending: false,
				likelyDefended: false
			},
			{
				teamno: teamnoB3,
				rpi: get_stat(teamnoB3, "rpi"),
				auto: get_stat(teamnoB3, "auto"),
				powerport: get_stat(teamnoB3, "powerport"),
				cp: get_stat(teamnoB3, "cp"),
				endgame: get_stat(teamnoB3, "endgame"),
				defense: get_stat(teamnoB3, "defense"),
				likelyDefending: false,
				likelyDefended: false
			}
		];

		// Calculate the autonomous score of each alliance (easily done, since no defense can be played)
		redAuto = red[0].auto[0] + red[1].auto[0] + red[2].auto[0];
		redStageCapacity += Math.min(9, red[0].auto[1] + red[1].auto[1] + red[2].auto[1]);	// only 9 max can be achieved towards capacity in auto

		blueAuto = blue[0].auto[0] + blue[1].auto[0] + blue[2].auto[0];
		blueStageCapacity += Math.min(9, blue[0].auto[1] + blue[1].auto[1] + blue[2].auto[1]);

		// BZZZZT... DING DING DINGGGG
		// Run teleop simulation and modify team's outputs based on defense
		// Defensive bots will be targeting robots with higher teleop outputs. Bots with wills of .71 or higher will always play defense unless one of their partners has a greater will/strength
		
		// Choose teams that are most likely to be defended against during teleop
		var redDefender = -1, redTarget = -1;
		var blueDefender = -1, blueTarget = -1;

		// Red alliance: choose the team that will likely see defense played on them during this match, will be the highest cell scorer
		var pchigh = 0, pcindex = -1;
		for (i = 0; i < red.length; i ++) {
			if (red[i].powerport[0] > pchigh) {
				pchigh = red[i].powerport[0];
				pcindex = i;
			}
		}
		red[pcindex].likelyDefended = true;
		redTarget = pcindex;
		
		// Blue alliance: choose the team that will likely see defense played on them during this match, will be the highest cell scorer
		pchigh = 0, pcindex = -1;
		for (i = 0; i < blue.length; i ++) {
			if (blue[i].powerport[0] > pchigh) {
				pchigh = blue[i].powerport[0];
				pcindex = i;
			}
		}
		blue[pcindex].likelyDefended = true;
		blueTarget = pcindex;
		
		// Choose the likely defenders. If no teams are on defense, simulate the match as normal
		if (playDefense) {
			// Choose the red alliance defender
			var dwhigh = 0, dwindex = -1;			// most likely defender
			var dwhigh2 = 0, dwindex2 = -1;			// the second most likely defender
			for (i = 0; i < red.length; i ++) {
				if (red[i].defense[1] > dwhigh) {
					dwhigh2 = dwhigh;
					dwindex2 = dwindex;
					dwhigh = red[i].defense[1];
					dwindex = i;
				}
			}
			// If the likely defender is a particularly good scorer, make the second most likely defender do it (will of .7 or more)
			var def = -1;
			if (dwhigh > .71 && red[dwindex].powerport[1] < 20) {
				def = red[dwindex];
				redDefender = dwindex;
			} else if (dwhigh2 > .7) {
				def = red[dwindex2];
				redDefender = dwindex2;
			}
			if (def != -1) {
				def.likelyDefending = true;
				def.powerport[1] = Math.max(def.powerport[1] - 4, 0);		// reduce score because team will be defending instead of playing offense
				def.powerport[0] = Math.max(def.powerport[0] - 6, 0);
				if (def.powerport[1] > 0 && def.powerport[0] == 0) def.powerport[0] = 1;
			}
			
			// Choose the blue alliance defender
			dwhigh = 0, dwindex = -1;			// most likely defender
			dwhigh2 = 0, dwindex2 = -1;			// the second most likely defender
			for (i = 0; i < blue.length; i ++) {
				if (blue[i].defense[1] > dwhigh) {
					dwhigh2 = dwhigh;
					dwindex2 = dwindex;
					dwhigh = blue[i].defense[1];
					dwindex = i;
				}
			}
			// If the likely defender is a particularly good scorer, make the second most likely defender do it (will of .7 or more)
			def = -1;
			if (dwhigh > .71 && blue[dwindex].powerport[1] < 20) {
				def = blue[dwindex];
				blueDefender = dwindex;
			} else if (dwhigh2 > .7) {
				def = blue[dwindex2];
				blueDefender = dwindex2;
			}
			if (def != -1) {
				def.likelyDefending = true;
				def.powerport[1] = Math.max(def.powerport[1] - 4, 0);		// reduce score because team will be defending instead of playing offense
				def.powerport[0] = Math.max(def.powerport[0] - 6, 0);
				if (def.powerport[1] > 0 && def.powerport[0] == 0) def.powerport[0] = 1;
			}
			
			// Simulate defense: Red on blue
			console.log(redDefender);
			if (redDefender != -1) {
				redDefensivePrevention = red[redDefender].defense[0];
				let blueOriginalScore = blue[blueTarget].powerport[0];
				if (redDefensivePrevention > blue[blueTarget].powerport[1]) redDefensivePrevention = blue[blueTarget].powerport[1];
				blue[blueTarget].powerport[1] -= redDefensivePrevention;
				blue[blueTarget].powerport[0] = Math.round(blue[blueTarget].powerport[1] + blue[blueTarget].powerport[1] * blue[blueTarget].powerport[2]);	// recalculate power port score
				redDefensivePrevention = blueOriginalScore - blue[blueTarget].powerport[0];	// calculate defensive score impact
			}
			
			// Simulate defense: Blue on red
			console.log(blueDefender);
			if (blueDefender != -1) {
				blueDefensivePrevention = blue[blueDefender].defense[0];
				let redOriginalScore = red[redTarget].powerport[0];
				if (blueDefensivePrevention > red[redTarget].powerport[1]) blueDefensivePrevention = red[redTarget].powerport[1];
				red[redTarget].powerport[1] -= blueDefensivePrevention;
				red[redTarget].powerport[0] = Math.round(red[redTarget].powerport[1] + red[redTarget].powerport[1] * red[redTarget].powerport[2]);	// recalculate power port score
				blueDefensivePrevention = redOriginalScore - red[redTarget].powerport[0];	// calculate defensive score impact
			}
		}
				
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

		// Simulate endgame scoring
		// Red endgame
		var balancers = 0;
		var climbers = 0;
		for (i = 0; i < red.length; i ++) {
			if (red[i].endgame[0] == "Parked") redEndgame += 5; else if (red[i].endgame[0] == "Hanging") climbers ++;
			if (red[i].endgame[1] == true) balancers ++;
		}
		if (balancers < 2 || (balancers < 3 && climbers == 3)) {
			// No balancing, just take all climb points available
			for (i = 0; i < red.length; i ++) {
				if (red[i].endgame[0] == "Hanging") redEndgame += 25;
			}
		} else {
			// Take as many climbers as there are balancers, park the others
			for (i = 0; i < red.length; i ++) {
				if (red[i].endgame[0] == "Hanging" && !red[i].endgame[1]) {
					redEndgame += 5;
					red[i].endgame[0] = "Parked";
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
		climbers = 0;
		for (i = 0; i < blue.length; i ++) {
			if (blue[i].endgame[0] == "Parked") blueEndgame += 5; else if (blue[i].endgame[0] == "Hanging") climbers ++;
			if (blue[i].endgame[1] == true) balancers ++;
		}
		if (balancers < 2 || (balancers < 3 && climbers == 3)) {
			// No balancing, just take all climb points available
			for (i = 0; i < blue.length; i ++) {
				if (blue[i].endgame[0] == "Hanging") blueEndgame += 25;
			}
		} else {
			// Take as many climbers as there are balancers, park the others
			for (i = 0; i < blue.length; i ++) {
				if (blue[i].endgame[0] == "Hanging" && !blue[i].endgame[1]) {
					blueEndgame += 5;
					blue[i].endgame[0] = "Parked";
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
		if (blueScore == redScore) {
			// Score is tied, just give each team a tie RP
			blueAllRP --;	// by default the simulator gives blue the win in a tie, undo this
			redAllRP ++;	// credit red with the tie RP
			redRP[0] = true;
			var rpBoxes = document.getElementsByClassName("simRPBox");
			rpBoxes[0].innerHTML = "Tie";
			rpBoxes[3].innerHTML = "Tie";
		} else {
			var rpBoxes = document.getElementsByClassName("simRPBox");
			rpBoxes[0].innerHTML = "Win";
			rpBoxes[3].innerHTML = "Win";
		}

		// Assemble display, starting with projection
		var disp = document.getElementById("projection");
		disp.innerHTML = "";
		document.getElementById("simMatchResults").style.display = "block";
		var dispString = ""
		if (redScore - 4 > blueScore)
			dispString = "<h2>RED ALLIANCE PROJECTED TO WIN</h2>";
		else if (blueScore - 4 > redScore)
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
		
		// Generate turning point statistics
		// Red turning points
		var mainDiff = Math.abs(redScore - blueScore);
		var redTurningPoint1 = "-", redTurningPoint2 = "-";
		var turningPointStrings = ["<strong>Autonomous</strong>: The outcome of the match may be largely determined by the quality of your autonomous routines", "<strong>Power Cells</strong>: Every shot counts; shoot high and accurately to gain the edge", "<strong>Control Panel</strong>: Don't overlook this element; be sure to score enough power cells to reach capacity and spin the wheel", "<strong>Climbing</strong>: The endgame will likely turn the tides of the match, so climb well", "<strong>Strong Defense</strong>: Play defense well and nullify the opposing scoring core during teleop to reap benefit", "<strong>Resist the Defense</strong>: The opposing defense is strong, don't let it get in the way of scoring"];
		var redDiff = [mainDiff - redAuto, mainDiff - redPower, mainDiff - redPanel, mainDiff - redEndgame + 15, mainDiff - redDefensivePrevention, mainDiff - blueDefensivePrevention];
		var lgi = -1, lg = 1;
		var lgi2 = -1, lg2 = 1;
		redDiff.forEach(function(val, ind) {
			if (val <= 0 && val < lgi) {
				lgi2 = lgi;
				lg2 = lg;
				lgi = ind;
				lg = val;
			}
		});
		if (lgi != -1) redTurningPoint1 = turningPointStrings[lgi];
		if (lgi2 != -1) redTurningPoint2 = turningPointStrings[lgi2];
		
		var blueTurningPoint1 = "-", blueTurningPoint2 = "-";
		var blueDiff = [mainDiff - blueAuto, mainDiff - bluePower, mainDiff - bluePanel, mainDiff - blueEndgame + 15, mainDiff - blueDefensivePrevention, mainDiff - redDefensivePrevention];
		lgi = -1, lg = 1;
		lgi2 = -1, lg2 = 1;
		blueDiff.forEach(function(val, ind) {
			if (val <= 0 && val < lgi) {
				lgi2 = lgi;
				lg2 = lg;
				lgi = ind;
				lg = val;
			}
		});
		if (lgi != -1) blueTurningPoint1 = turningPointStrings[lgi];
		if (lgi2 != -1) blueTurningPoint2 = turningPointStrings[lgi2];
		
		// Fill in with secure data
		if (redTurningPoint1 == "-" && redScore > blueScore) redTurningPoint1 = "Outcome is expected to be decisive. Play your game and you'll win handily";
		if (blueTurningPoint1 == "-" && blueScore > redScore) blueTurningPoint1 = "Outcome is expected to be decisive. Play your game and you'll win handily";
		if (redScore - 180 > blueScore) blueTurningPoint1 = "<strong>Prayers</strong>: Match is expected to be hopelessly lopsided. Maybe their robots will all break down? Simultaneously?";
		if (blueScore - 180 > redScore) redTurningPoint1 = "<strong>Prayers</strong>: Match is expected to be hopelessly lopsided. Maybe their robots will all break down? Simultaneously?";
		
		// Populate game data table with information
		// <div class='tooltip'><span class='tooltiptext'></span>
		var dataTable = document.getElementById("simGameTable");
		var redD = "-", blueD = "-";
		if (redDefender != -1) redD = red[redDefender].teamno;
		if (blueDefender != -1) blueD = blue[blueDefender].teamno;
		var averageRedRPI = Math.round(((red[0].rpi[0] + red[1].rpi[0] + red[2].rpi[0]) * 10) / 3) / 10;
		var averageBlueRPI = Math.round(((blue[0].rpi[0] + blue[1].rpi[0] + blue[2].rpi[0]) * 10) / 3) / 10;
		dataTable.innerHTML = "<tr><td style='width: 150px'>" + averageRedRPI + "</td><td style='min-width: 200px;'><div class='tooltip'><span class='tooltiptext'>The average RPI of the entire alliance</span><strong>Average RPI</strong></div></td><td style='width: 150px;'>" + averageBlueRPI + "</td></tr>";
		dataTable.innerHTML += "<tr><td>" + redD + "</td><td><div class='tooltip'><span class='tooltiptext'>When defense is simulated, shows the team that will likely be playing defense in this match</span><strong>Likely Defender</strong></div></td><td>" + blueD + "</td></tr>";
		dataTable.innerHTML += "<tr><td>" + red[redTarget].teamno + "</td><td><div class='tooltip'><span class='tooltiptext'>The team that will score the most power cells during the match for each alliance. The likely defender will play defense against this team in the simulation.</span><strong>Strongest Power Cell Team</strong></div></td><td>" + blue[blueTarget].teamno + "</td></tr>";
		dataTable.innerHTML += "<tr><td>" + redDefensivePrevention + "</td><td><div class='tooltip'><span class='tooltiptext'>The prediction for the number of points that defense is able to remove from the scoreboard</span><strong>Defensive Score Prevention</strong></div></td><td>" + blueDefensivePrevention + "</td></tr>";
		dataTable.innerHTML += "<tr><td>" + red[0].endgame[0] + "</td><td><strong>Robot 1 Endgame</strong></td><td>" + blue[0].endgame[0] + "</td></tr>";
		dataTable.innerHTML += "<tr><td>" + red[1].endgame[0] + "</td><td><strong>Robot 2 Endgame</strong></td><td>" + blue[1].endgame[0] + "</td></tr>";
		dataTable.innerHTML += "<tr><td>" + red[2].endgame[0] + "</td><td><strong>Robot 3 Endgame</strong></td><td>" + blue[2].endgame[0] + "</td></tr>";
		var redb = "No", blueb = "No";
		if (redBalanced) redb = "Yes";
		if (blueBalanced) blueb = "Yes";
		dataTable.innerHTML += "<tr><td>" + redb + "</td><td><strong>Switch Balanced</strong></td><td>" + blueb + "</td></tr>";
		dataTable.innerHTML += "<tr><td><small>" + redTurningPoint1 + "</small></td><td><strong>Keys to Success</strong></td><td><small>" + blueTurningPoint1 + "</small></td></tr>";
		dataTable.innerHTML += "<tr><td><small>" + redTurningPoint2 + "</small></td><td>(beta)</td><td><small>" + blueTurningPoint2 + "</small></td></tr>";
	}
}

function simDisplayTeam(alliance, index) {
	var teamno;
	var box = document.getElementById("simTeamAttributes");
	var teamStats, allianceStats;
	var ds = "";
	if (localStorage.simActiveBlue == "") {
		ds = "<p><em>Click on a team above to view their individual output</em></p>";
	} else {
		// Obtain red or blue alliance data
		if (alliance == "red") {
			allianceStats = JSON.parse(localStorage.simActiveRed);
		} else allianceStats = JSON.parse(localStorage.simActiveBlue);
		teamStats = allianceStats[index];
		teamno = teamStats.teamno;
		
		// Collect team's attributes from its object
		ds = "<h2><a target='_blank' href='master_view_team.html' onclick='localStorage.currentTeam = " + teamno + "'>" + teamno + "</a></h2><h4>" + get_team_name(teamno.toString()) + "</h4>";
		ds += "<p>RPI: " + teamStats.rpi[0] + " (" + teamStats.rpi[1] + ")</p>";
		ds += "<p># of Auto Cells Scored: " + teamStats.auto[1] + "</p>";
		ds += "<p># of Teleop Cells Scored: " + teamStats.powerport[1] + "</p>";
		var autocross;
		if (teamStats.auto[2]) autocross = "Yes"; else autocross = "No";
		ds += "<p>Autocross: " + autocross + "</p>";
		ds += "<p>Endgame Status: " + teamStats.endgame[0] + "</p>";
		
		// Print defensive statistics
		var dstrength = teamStats.defense[0], dodds = teamStats.defense[1];
		var dss = teamStats.defense[2], dos = teamStats.defense[3];
			
		ds += "<p>Odds of Playing Defense: " + dos + "</p>";
		ds += "<p>Defensive Threat: " + dss + " (" + dstrength + ")</p>";
	}
	box.innerHTML = ds;
}