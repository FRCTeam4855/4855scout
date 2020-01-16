// A long list of team names
// Would've used a JSON or something but apparently that's really stupid hard to do without a captive server to use so...

// Returns a team name when given its team number, otherwise spits out question marks
// Only returns common team numbers in the FiM area who we usually compete against
function get_team_name(teamno) {
	switch (Number(teamno)) {
		case 1:
			return "The Juggernauts";
		case 27:
			return "Team RUSH";
		case 33:
			return "Killer Bees";
		case 51:
			return "The Wings of Fire";
		case 66:
			return "Grizzly Robotics";
		case 67:
			return "The HOT Team";
		case 68:
			return "Truck Town Thunder";
		case 70:
			return "More Martians";
		case 74:
			return "Team CHAOS";
		case 85:
			return "B.O.B. (Built on Brains)";
		case 94:
			return "The Ninetyfouriors";
		case 107:
			return "Team R.O.B.O.T.I.C.S.";
		case 141:
			return "WOBOT";
		case 201:
			return "The FEDS";
		case 216:
			return "More Robodawgs";
		case 226:
			return "Hammerheads";
		case 244:
			return "Robodawgs 3D";
		case 245:
			return "Adambots";
		case 288:
			return "The Robodawgs";
		case 302:
			return "The Dragons";
		case 322:
			return "Team F.I.R.E.";
		case 494:
			return "Martians";
		case 503:
			return "Frog Force";
		case 858:
			return "Demons";
		case 862:
			return "Team RUSH";
		case 904:
			return "D Cubed";
		case 910:
			return "The Foley Freeze";
		case 1023:
			return "Bedford Express";
		case 1025:
			return "IMPI Robotics";
		case 1243:
			return "Dragons";
		case 1254:
			return "Tech Force";
		case 1504:
			return "Desperate Penguins";
		case 1677:
			return "Quantum Ninjas";
		case 1684:
			return "The Chimeras";
		case 1718:
			return "The Fighting Pi";
		case 1918:
			return "NC Gears";
		case 1940:
			return "Tech Tigers";
		case 2054:
			return "Tech Vikes";
		case 2337:
			return "EngiNERDs";
		case 2619:
			return "The Charge";
		case 2767:
			return "Stryke Force";
		case 2771:
			return "Code Red Robotics the Stray Dogs";
		case 2834:
			return "Bionic Black Hawks";
		case 2959:
			return "Robotarians";
		case 3234:
			return "Red Arrows";
		case 3357:
			return "COMETS";
		case 3452:
			return "GreengineerZ";
		case 3458:
			return "Code Blue";
		case 3538:
			return "RoboJackets";
		case 3539:
			return "Byting Bulldogs";
		case 3546:
			return "Buc'n'Gears";
		case 3572:
			return "Wavelength";
		case 3604:
			return "Goon Squad";
		case 3620:
			return "Average Joes";
		case 3707:
			return "Brighton TechnoDogs";
		case 3875:
			return "Red Storm Robotics";
		case 4003:
			return "TriSonics";
		case 4004:
			return "M.A.R.S. Rovers";
		case 4130:
			return "The Blue Devils";
		case 4237:
			return "Team Lance-A-Bot";
		case 4325:
			return "RoboRangers";
		case 4327:
			return "Q Branch";
		case 4362:
			return "CSPA Gems";
		case 4377:
			return "Boyne City Blaze";
		case 4381:
			return "Twisted Devils";
		case 4384:
			return "Benzene Bots";
		case 4408:
			return "Panthera Machina";
		case 4409:
			return "Ground Zero";
		case 4453:
			return "The Red Hot Chili Bots";
		case 4482:
			return "ID Robotics";
		case 4779:
			return "RoboSapiens";
		case 4855:
			return "Ramageddon";
		case 4956:
			return "RoboSharks";
		case 4967:
			return "That ONE Team-OurNextEngineers";
		case 5050:
			return "Cow Town Robotics";
		case 5056:
			return "MegaHurtz Robotics";
		case 5066:
			return "Singularity";
		case 5069:
			return "Iron Giants";
		case 5110:
			return "Robo Herd";
		case 5114:
			return "Titanium Tigers";
		case 5152:
			return "Alotobots";
		case 5161:
			return "Trojan Technicians";
		case 5173:
			return "Fennville RoboHawks";
		case 5182:
			return "Chieftainators";
		case 5194:
			return "Gobles Voltage";
		case 5204:
			return "Robocats";
		case 5248:
			return "Robo-Saxons";
		case 5256:
			return "The Atomics";
		case 5460:
			return "Strike Zone";
		case 5462:
			return "2PawR (2 Paw Robotics)";
		case 5470:
			return "The Cowpunchers";
		case 5501:
			return "Bobcats";
		case 5535:
			return "Bionic Bison";
		case 5547:
			return "The Talons";
		case 5559:
			return "Gear Grinders";
		case 5562:
			return "Laker Logistics";
		case 5610:
			return "Turbulence";
		case 5623:
			return "Robotics Rams";
		case 5675:
			return "WiredCats";
		case 5688:
			return "Robo Cats";
		case 5710:
			return "The O-Bots";
		case 5843:
			return "Flurb";
		case 5926:
			return "Da MOOse";
		case 5927:
			return "Globetrotters";
		case 5980:
			return "East Grand Rapids Robotics";
		case 6002:
			return "ZooBOTix";
		case 6043:
			return "Tesla Tigers";
		case 6053:
			return "Robusters";
		case 6090:
			return "Wayland Wildcats";
		case 6120:
			return "Cyberstangs";
		case 6137:
			return "Falcon Robotics";
		case 6425:
			return "The Conclave";
		case 6550:
			return "Wildcat Robotics";
		case 6568:
			return "Decatur Robotics Team";
		case 6588:
			return "Counter-Torque Robotics";
		case 6589:
			return "Cardinals.EXE";
		case 6642:
			return "Harrison Stingers of Steel";
		case 7054:
			return "SC Sailors";
		case 7187:
			return "Gear Cats";
		case 7195:
			return "Portland Raiders";
		case 7208:
			return "CMA Navigators";
		case 7210:
			return "RoboJackets";
		case 7211:
			return "Hollywood";
		case 7221:
			return "JHS Viking Robotics";
		case 7234:
			return "GLADIATORS";
		case 7248:
			return "Tactical Hams";
		case 7254:
			return "Knowmads";
		case 7256:
			return "Irish Robotics";
		case 7658:
			return "MagiTech";
		case 7809:
			return "Valhalla Nation";
		case 7811:
			return "Flamin' Hot Tigers";
		case 7814:
			return "River Valley Mustang Gearheads";
		case 7911:
			return "Belding RoboKnights";
		case 8126:
			return "Control Freaks";
		case 8344:
			return "OV Cardinal Robotics";
		case 8363:
			return "Marcellus W1LdBots";
		case 8397:
			return "Mission Control Robotics";
		default:
			return "???";
	}
}