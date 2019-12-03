// Show and hide labels and explanations for tasks that teams can't complete

function load_data() {
	var form = document.querySelector('form');
	form.addEventListener('change', function() {
		explanation_visible();
	});
	explanation_visible();
	if (localStorage.source == "master") document.getElementById("cancelButton").setAttribute("href", "master_main.html");
}
function explanation_visible() {
	var cscargo = document.getElementById("inCscargo");
	var rcargo = document.getElementById("inRcargo");
	var cshatch = document.getElementById("inCshatch");
	var rhatch = document.getElementById("inRhatch");

	var labelCscargoexp = document.querySelector("label[for=cscargoexp]");
	var cscargoexp = document.getElementById("inCscargoexp");
	var labelRcargoexp = document.querySelector("label[for=rcargoexp]");
	var rcargoexp = document.getElementById("inRcargoexp");
	var labelCshatchexp = document.querySelector("label[for=cshatchexp]");
	var cshatchexp = document.getElementById("inCshatchexp");
	var labelRhatchexp = document.querySelector("label[for=rhatchexp]");
	var rhatchexp = document.getElementById("inRhatchexp");

	if (Number(cscargo.value) > 0) {
		labelCscargoexp.style.display = "inline";
		cscargoexp.style.display = "inline";
	} else {
		labelCscargoexp.style.display = "none";
		cscargoexp.style.display = "none";
	}

	if (Number(rcargo.value) > 0) {
		labelRcargoexp.style.display = "inline";
		rcargoexp.style.display = "inline";
	} else {
		labelRcargoexp.style.display = "none";
		rcargoexp.style.display = "none";
	}

	if (Number(cshatch.value) > 0) {
		labelCshatchexp.style.display = "inline";
		cshatchexp.style.display = "inline";
	} else {
		labelCshatchexp.style.display = "none";
		cshatchexp.style.display = "none";
	}

	if (Number(rhatch.value) > 0) {
		labelRhatchexp.style.display = "inline";
		rhatchexp.style.display = "inline";
	} else {
		labelRhatchexp.style.display = "none";
		rhatchexp.style.display = "none";
	}
}