// Does all the dirty work of collecting all the forms needed to calculate game statistics. stat indicates via string which statistic is needed
function get_stat(teamno, stat) {
	var forms = get_team_forms(teamno);
	switch (stat) {
		case "rpi":
			return calculate_rpi(forms, false, false, "", false, "");
		case "auto":
			// Returns an array with points scored, # pieces scored, and true/false for autocross
			var autocross = 0, autolow = 0, autohigh = 0;
			var allForms = 0;
			for (var i = 0; i < forms.length; i ++) {
				// Exceptions
				if (forms[i].formtype == "verbal") continue;
				allForms ++;
				autocross += Number(forms[i].autocross);
				autolow += Number(forms[i].autolow);
				autohigh += Number(forms[i].autohigh);
			}
			if ((autocross * 5) / allForms > 3.6) autocross = 5; else autocross = 0;
			autolow = Math.round(autolow / allForms);
			autohigh = Math.round(autohigh / allForms);
			if (allForms > 0) return [autocross + autolow * 2 + autohigh * 4, autolow + autohigh, autocross == 5]; else return ["-", "-", "-"];
		case "powerport":
			// Returns an array with points scored, # pieces scored, and the percent of goals that are high goals
			var lowport = 0, highport = 0;
			var allForms = 0;
			for (i = 0; i < forms.length; i ++) {
				// Exceptions
				if (forms[i].formtype == "verbal") continue;
				allForms ++;
				lowport += Number(forms[i].lowport);
				highport += Number(forms[i].highport);
			}
			lowport = Math.round(lowport / allForms);
			highport = Math.round(highport / allForms);
			if (allForms > 0) return [lowport + highport * 2, lowport + highport, highport / (highport + lowport)]; else return ["-", "-", "-"];
		case "cp":
			// Returns an array for both stage 2 or stage 3 with either true or false depending on whether or not the team can spin the control panel
			var cp2 = false, cp3 = false, verbals = false;
			for (i = 0; i < forms.length; i ++) {
				// Exceptions
				if (forms[i].formtype == "match") continue;
				verbals = true;
				if (forms[i].cp2 == "true") cp2 = true;
				if (forms[i].cp3 == "true") cp3 = true;
			}
			if (!verbals) {
				// No verbal forms have been submitted for the team so we have to see based on match data if they can spin the panel
				for (i = 0; i < forms.length; i ++) {
					if (forms[i].cp2 == "1") cp2 = true;
					if (forms[i].cp3 == "1") cp3 = true;
				}
			}
			return [cp2, cp3];
		case "endgame":
			// Calculates endgame scoring with an array containing a string for what the team did, whether or not they can potentially balance the switch with a partner, how many times they've climbed, and how often they've tried to climb
			var climb = "-", level = false;
			var climbno = 0, parkno = 0, levelno = 0, climbtries = 0;
			var allForms = 0;
			for (i = 0; i < forms.length; i ++) {
				// Exceptions
				if (forms[i].formtype == "verbal") continue;
				allForms ++;
				if (forms[i].climb == "1") parkno ++;
				if (forms[i].climb == "2") {
					climbno ++;
					climbtries ++;
				}
				if (forms[i].climbattempt == "true") {
					climbtries ++;
				}
				if (forms[i].climblevel == "1") levelno ++;
			}
			if (parkno > climbno) climb = "Parked";
			if (climbno > parkno) climb = "Hanging";
			if (parkno + climbno < Math.ceil(allForms * .5)) climb = "-";
			if (levelno <= 1 && allForms > 4) level = false;	// we can reasonably assume that they probably can't level most of the time if they only did it one out of four times
			else if (levelno >= 1) level = true;
			return [climb, level, climbno, climbtries];
		case "defense":
			// Calculates the defensive strength of a team and whether or not they're likely to play any defense
			// Defensive ability is returned by a number estimating the number of game pieces the defender can prevent the offense from scoring. Teams that would rather not play defense (and don't very often) will receive low ratings due to an inferred timid nature, and teams that are willing will rate higher. Teams that frequently play defense will receive a higher rating even if the quality isn't strong every time
			// Returns a defensive strength rating, defensive playing odds, a string to represent both of these parameters, and a % of the number of matches where defense was played
			var drate = 2, dwill = 0.1;	// defensive power rating, odds that team will want to play defense (between 0 and 1)
			var drateString = "", dwillString = "";
			var verbals = false;

			// First evaluate the verbal reports. If a team expresses no desire to defend, all values can be returned as 0
			for (i = 0; i < forms.length; i ++) {
				// Exceptions
				if (forms[i].formtype == "match") continue;
				verbals = true;
				if (forms[i].defense == "0") return [0, 0, "Uncertain", "Impossible"];	// not a chance
				if (forms[i].defense == "1") {				// team would rather not
					dwill = .08;
					drate = -2;
				}
				if (forms[i].defense == "2") {				// team is able and willing
					dwill = .14;	
					drate = 6;
				}
			}

			// Count how many times the team has been reported playing defense
			var allcount = 0, dcount = 0, dpoor = 0, dstrong = 0;
			for (i = 0; i < forms.length; i ++) {
				// Exceptions
				if (forms[i].formtype == "verbal") continue;
				allcount ++;
				if (forms[i].defenserate == "1") dpoor ++;
				if (forms[i].defenserate == "2") dstrong ++;
				if (forms[i].defense == "1") dcount ++;
			}
			// Will to play defense is defined by (between 0 and 1) OG will + time on defense^2 / (3.5 * all matches)
			if (allcount > 0) dwill += Math.max(0, Math.min(1, Math.pow(dcount, 2) / (3.5 * allcount)));
			// Defensive strength calculated by 2.5 * SQRT((# times on D * 1/2 * strong D games + 1) * (3 / poor D games + 1))
			drate += Math.round(2.5 * Math.sqrt((dcount * .5 * (dstrong + 1)) * (3 / (dpoor + 1))));
			drate = Math.max(3, Math.min(drate, 20));	// theoretical max game piece blocking is 20, minimum is 3
			
			// Generate strings for defensive rating and will
			if (drate <= 3)
				drateString = "Very Weak";
			else if (drate <= 6)
				drateString = "Weak";
			else if (drate <= 9)
				drateString = "Moderate";
			else if (drate <= 13)
				drateString = "<strong>Strong</strong>";
			else drateString = "<strong style='color: red;'>Very Strong</strong>";
			
			if (dwill <= 0)
				dwillString = "Impossible";
			else if (dwill <= 0.35)
				dwillString = "Low";
			else if (dwill <= 0.45)
				dwillString = "Moderate";
			else if (dwill <= 0.75)
				dwillString = "High";
			else if (dwill <= 0.85)
				dwillString = "<strong>Very High</strong>";
			else dwillString = "<strong style='color: red;'>Probable</strong>";
			
			if (dcount < 1) drateString = "Uncertain";
			var dpercent = Math.round((dcount / allcount) * 1000) / 10;	// percent of time that team plays defense
			if (allcount < 1) dpercent = "?"
			return [drate, dwill, drateString, dwillString, dpercent];
	}
	return 0;
}