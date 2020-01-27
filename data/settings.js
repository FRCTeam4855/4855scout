/* 
	This file contains custom settings for the scouting program. It is particularly useful to adjust these settings when
	sending the scouter program to your scouts so that, for example, they don't accidently put wrong data in the
	event key category of each scouting form. Feel free to edit any of these settings to your liking and distribute
	this version of the scouter to your team.
	
	When REGULAR SCOUTER is referenced in this file, it means that the settings are applied when the user of the scouting 
	program has selected "I am a scouter" when they opened the program.
*/

// Fills in the event key field for every form when in REGULAR SCOUTER mode. Leave blank as "" to not prefill the form; otherwise, put the event key of your choosing between the quotation marks (i.e. "2020week0")
var default_event_key = "";

// Indicates whether or not scouts in the REGULAR SCOUTER mode are able to edit the event key field, or if it is to be disabled entirely. Type true to allow editing and false to disable it
var allow_event_key_edits = true;