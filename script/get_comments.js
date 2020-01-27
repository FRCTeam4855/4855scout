// Gets an array of all a team's comments. If the defense parameter is true, defensive input will be returned instead of the normal general comments

function get_comments(teamno, defense) {
	var forms = get_team_forms(teamno);
	var comments = [];
	forms.forEach(function(form) {
		var comment = "";
		if (defense) comment = form.defenseexp; else comment = form.comments;
		if (comment != "") comments.push(comment);
	});
	return comments;
}