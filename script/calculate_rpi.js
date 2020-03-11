// Finds the Ramageddon Power Index of a team based on an array of form objects

// Takes an array of forms and returns an array consisting of RPI and quality assessment (good, great, etc.)
// RPI is a rough calculation of the average number of points a team is scoring per match, independent of their partners
function calculate_rpi(forms, factorPenalties, generateByEventKey, eventKey, generateByMatchKey, matchKey) {

	var rpi = 0;
	var formCount = 0;
	var rateOfInnerPortHits = .25;	// the true value here will reveal itself midseason, so we have to estimate
	
	// Calculate average autocross points per game
	var autocrossPts = 0, autolowPts = 0, autohighPts = 0;
	var lowportPts = 0, highportPts = 0, cp2Pts = 0, cp3Pts = 0;
	var climbPts = 0, levelPts = 0;
	var adjustPenalties = 0;
	
	// Find number of match forms, remove any verbal forms and excluded event/match forms from the mix
	for (var i = 0; i < forms.length; i ++) {
		if (forms[i].formtype == "match" && ((generateByEventKey && eventKey == forms[i].eventkey) || !generateByEventKey)) formCount ++;
	}
	if (generateByMatchKey) formCount = 1;	// the match has to have an existing form for this method of generation to work!
	
	for (i = 0; i < forms.length; i ++) {
		// Exceptions
		if (forms[i].formtype == "verbal") continue;
		if (generateByEventKey && eventKey != forms[i].eventkey) continue;
		if (generateByMatchKey && matchKey != get_match_key(forms[i].eventkey, forms[i].matchno)) continue;
		
		// Add up point totals
		autocrossPts += Number(forms[i].autocross) * 5;
		autolowPts += Number(forms[i].autolow) * 2;
		autohighPts += Number(forms[i].autohigh) * (4 + rateOfInnerPortHits * 2);
		
		lowportPts += Number(forms[i].lowport);
		highportPts += Number(forms[i].highport) * (2 + rateOfInnerPortHits);
		cp2Pts += Number(forms[i].cp2) * 10;
		cp3Pts += Number(forms[i].cp3) * 20;
		
		switch (forms[i].climb) {
			case "1":
				climbPts += 5;
				break;
			case "2":
				climbPts += 25;
				break;
		}
		
		levelPts += Number(forms[i].climblevel) * 15;
		if (factorPenalties && forms[i].penalties == "true") adjustPenalties -= 5;
	}
	
	autocrossPts /= formCount;
	autolowPts /= formCount;
	autohighPts /= formCount;
	
	lowportPts /= formCount;
	highportPts /= formCount;
	cp2Pts /= formCount;
	cp3Pts /= formCount;
	
	climbPts /= formCount;
	levelPts /= formCount;
	
	rpi += autocrossPts + autolowPts + autohighPts + lowportPts + highportPts + cp2Pts + cp3Pts + climbPts + levelPts + adjustPenalties;
	rpi = Math.round(rpi * 10) / 10.0;	// Round to nearest tenth if necessary
	
	var rpiQuality = "";
	if (rpi < 8)
		rpiQuality = "Very Poor";
	else if (rpi < 16)
		rpiQuality = "Poor";
	else if (rpi < 28)
		rpiQuality = "Average";
	else if (rpi < 55)
		rpiQuality = "Good";
	else if (rpi < 79)
		rpiQuality = "Very Good";
	else if (rpi < 100)
		rpiQuality = "Excellent";
	else rpiQuality = "Godly";
	
	if (rpi !== rpi) {
		rpi = -999;
		rpiQuality = "N/A";
	}
	
	return [rpi, rpiQuality];
}