// Finds the Ramageddon Power Index of a team based on an array of form objects

// Takes an array of forms and returns an array consisting of RMI, cargo adjustment, hatch adjustment, climb adjustment, and quality assessment (good, great, etc.)
function calculate_rpi(forms) {
	var rpi = 200;
	
	var adjustSandstorm = 0, adjustCargo = 0, adjustHatch = 0, adjustClimb = 0, adjustDefense = 0, adjustFlags = 0;
	
	// Calculate RPI adjustment based on sandstorm performance
	var level2flag = false;
	var level2times = 0;
	for (var i = 0; i < forms.length; i ++) {
		if (forms[i].sslevel == "2") {
			level2flag = true;
			level2times ++;
		}
	}
	if (!level2flag) adjustSandstorm = -5 - (forms.length * 2); else adjustSandstorm = 6 + (level2times);
	
	// Calculate RPI adjustment based on cargo performance
	var cargo = [];
	for (i = 0; i < forms.length; i ++) {
		var cscargo = Number(forms[i].cscargo);
		var rcargo = Number(forms[i].rcargo);
		switch (cscargo) {
			case -1:cscargo = 0;break;
			case 1:cscargo = -35;break;
			case 2:cscargo = -15;break;
			case 3:cscargo = 15;break;
			case 4:cscargo = 30;break;
			case 5:cscargo = 40;break;
		}
		if (cscargo != 0) cargo.push(cscargo);
		switch (rcargo) {
			case -1:rcargo = 0;break;
			case 1:rcargo = -35;break;
			case 2:rcargo = -15;break;
			case 3:rcargo = 15;break;
			case 4:rcargo = 30;break;
			case 5:rcargo = 40;break;
		}
		if (rcargo != 0) cargo.push(rcargo);
	}
	var cargoAvg = 0;
	if (cargo.length > 0) {
		for (i = 0; i < cargo.length; i ++) {
			cargoAvg += cargo[i];
		}
		adjustCargo = (cargoAvg / cargo.length) * 2;
	}
	
	// Calculate RPI adjustment based on hatch performance
	var hatch = [];
	for (i = 0; i < forms.length; i ++) {
		var cshatch = Number(forms[i].cshatch);
		var rhatch = Number(forms[i].rhatch);
		switch (cshatch) {
			case -1:cshatch = 0;break;
			case 1:cshatch = -35;break;
			case 2:cshatch = -15;break;
			case 3:cshatch = 15;break;
			case 4:cshatch = 30;break;
			case 5:cshatch = 40;break;
		}
		if (cshatch != 0) hatch.push(cshatch);
		switch (rhatch) {
			case -1:rhatch = 0;break;
			case 1:rhatch = -35;break;
			case 2:rhatch = -15;break;
			case 3:rhatch = 15;break;
			case 4:rhatch = 30;break;
			case 5:rhatch = 40;break;
		}
		if (rhatch != 0) hatch.push(rhatch);
	}
	var hatchAvg = 0;
	if (cargo.length > 0) {
		for (i = 0; i < hatch.length; i ++) {
			hatchAvg += hatch[i];
		}
		adjustHatch = (hatchAvg / hatch.length) * 2;
	}
	
	// Calculate RPI adjustment based on climb performance
	var climb = [];
	var highestclimb = 0;
	for (i = 0; i < forms.length; i ++) {
		var climblevel = Number(forms[i].climb);
		var climbrate = Number(forms[i].climbrate);
		if (climblevel > highestclimb) highestclimb = climblevel;
		switch (climbrate) {
			case 1:climbrate = -25;break;
			case 2:climbrate = -15;break;
			case 3:climbrate = 0;break;
			case 4:climbrate = 15;break;
			case 5:climbrate = 30;break;
		}
		climb[i] = climbrate;
	}
	var climbAvg = 0;
	for (i = 0; i < climb.length; i ++) {
		climbAvg += climb[i];
	}
	switch (highestclimb) {
		case 0:highestclimb = -8 - (forms.length * 12);break;
		case 1:highestclimb = -8 - (forms.length * 7);break;
		case 2:highestclimb = 0;break;
		case 3:highestclimb = 30;break;
	}
	adjustClimb = (climbAvg / climb.length) + highestclimb;
	
	// Calculate RPI adjustment based on defense
	var defense = [];
	for (i = 0; i < forms.length; i ++) {
		var defenserate = Number(forms[i].defense);
		switch (defenserate) {
			case 1:defenserate = -20;break;
			case 2:defenserate = 0;break;
			case 3:defenserate = 10;break;
			case 4:defenserate = 15;break;
			case 5:defenserate = 20;break;
		}
		defense[i] = climbrate;
	}
	var defenseAvg = 0;
	for (i = 0; i < defense.length; i ++) {
		defenseAvg += defense[i];
	}
	adjustDefense = (defenseAvg / defense.length);
	
	// Calculate RPI adjustment with certain flags present
	for (i = 0; i < forms.length; i ++) {
		if (forms.goodpick == "true") adjustFlags += 10;
		if (forms.penalties == "true") adjustFlags -= 30;
		if (forms.breakdown == "true") adjustFlags -= 20;
	}
	
	rpi += adjustSandstorm + adjustCargo + adjustHatch + adjustClimb + adjustDefense + adjustFlags;
	rpi = Math.round(rpi * 10) / 10.0;	// Round to nearest tenth if necessary
	
	var rpiQuality = "";
	if (rpi < 50)
		rpiQuality = "Very Poor";
	else if (rpi < 140)
		rpiQuality = "Poor";
	else if (rpi < 200)
		rpiQuality = "Below Average";
	else if (rpi < 290)
		rpiQuality = "Average";
	else if (rpi < 330)
		rpiQuality = "Good";
	else if (rpi < 380)
		rpiQuality = "Very Good";
	else if (rpi < 440)
		rpiQuality = "Excellent";
	else rpiQuality = "Godly";
	
	return [rpi, Math.round(adjustCargo * 10) / 10.0, Math.round(adjustHatch * 10) / 10.0, Math.round(adjustClimb * 10) / 10.0, rpiQuality, adjustDefense];
}