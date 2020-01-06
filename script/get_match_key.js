// Returns a match key using a qualification match number and an event key

function get_match_key(eventKey, qual) {
	return eventKey + "_qm" + qual;
}