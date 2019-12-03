// Contains all the necessary elements to pull any piece of data from a certain form

// Extract the team number of a form from a JSON string
function form_get_teamno_from_string(formID) {
	var myJSON = JSON.parse(localStorage.getItem(formID));
	return myJSON.teamno;
}

// Extract the team number of a form from a JSON object
function form_get_teamno_from_obj(formID) {
	return formID.teamno;
}

// Takes a string form ID and a certain property name (BOTH STRINGS) and returns a string with the property
function form_get_property_from_string(formID, property) {
	var myJSON = JSON.parse(localStorage.getItem(formID));
	return myJSON[property];
}

// Takes a form object and a certain property name string and returns a string with the property
function form_get_property_from_obj(formID, property) {
	return formID[property];
}