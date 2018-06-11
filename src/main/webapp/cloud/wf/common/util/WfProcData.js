function WfProcData(jsonString) {
	var procDataArray = JSON.parse(jsonString);
	var obj = {};
	for (key in procDataArray[0]) {
		if (typeof procDataArray[0][key] != "function") {
			obj[key] = {
				name :key,
				value :procDataArray[0][key]
			};
		}
	}
	this.getValue = function(procDataName) {
		if (obj[procDataName] === undefined) {
			return null;
		}
		return obj[procDataName].value;
	};
}