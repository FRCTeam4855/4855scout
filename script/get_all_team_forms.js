// Takes a team number and returns an array of all its forms
function get_team_forms(teamno) {
	// Grab team list and form ID list
	var teamList = JSON.parse(localStorage.teamList);
	var formList = JSON.parse(localStorage.formList);
	var indexList = [];

	// Select all forms containing this team
	for (var i = 0; i < teamList.length; i ++) {
		if (teamList[i] == teamno) indexList.push(i);
	}

	var formArray = [];

	// Package all relevant forms
	for (var i = 0; i < indexList.length; i ++) {
		thisID = "form-" + teamno + "-" + formList[indexList[i]];
		var myJSON = localStorage.getItem(thisID);
		var myForm = JSON.parse(myJSON);
		formArray.push(myForm);
	}
	return formArray;
}