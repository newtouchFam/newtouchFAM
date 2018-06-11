function WfWorkData(jsonString) {
	var workDataArray = JSON.parse(jsonString);
	var obj = {};
	for (key in workDataArray[0]) {
		if (typeof workDataArray[0][key] != "function") {
			obj[key] = {
				name :key,
				value :workDataArray[0][key],
				modi :false
			};
		}
	}
	this.setValue = function(workDataName, workDataValue) {
		if (obj[workDataName] === undefined) {
			return;
		} else {
			obj[workDataName].value = workDataValue;
			obj[workDataName].modi = true;
		}
	};
	this.getValue = function(workDataName) {
		if (obj[workDataName] === undefined) {
			return null;
		}
		return obj[workDataName].value;
	};
	this.getModified = function() {
		var returnObj = {};
		for (key in obj) {
			if (typeof obj[key] != "function") {
				if (obj[key].modi == true) {
					returnObj[key] = obj[key].value;
				}
			}
		}
		return returnObj;
	};
	this.getModifiedJson = function() {
		var returnObj = [];
		var i = 0;
		for (key in obj) {
			if (typeof obj[key] != "function") {
				if (obj[key].modi == true) {
					returnObj[i] = {
						WORKDATANAME :key,
						DATAVALUE :obj[key].value
					};
					i++;
				}
			}
		}
		return returnObj.toJSONString();
	};
}