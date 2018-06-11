/**
 * 批量附件上传组件
 * @param serialNum
 * @param closeWin
 * @returns
 */
xyUploadFileObject = function(formSerialNo, closeWin) 
{
	this.formSerialNo = formSerialNo;
	this.parentWin = closeWin;
	
	this.isUploadFile = "false";
	this.isUploadFileAll = "false";
	this.countRows = null;
	this.idRowSelected = null;
	this.sessionId = null;

	//server handlers
	this.pathUploadHandler = null;
	this.pathGetInfoHandler = null;
	this.pathGetIdHandler = null;

	//progress
	this.progressBar = null;
	
	this.uploaded = false;
}

/**
 * 批量附件上传组件
 */
xyUploadFileObject = function(processInstID, entityDataID, formSerialNo, closeWin, fileAccept, fileExt, fileExtErrorMsg) 
{
	this.processInstID = processInstID;
	this.entityDataID = entityDataID;
	this.formSerialNo = formSerialNo;
	this.parentWin = closeWin;
	
	this.isUploadFile = "false";
	this.isUploadFileAll = "false";
	this.countRows = null;
	this.idRowSelected = null;
	this.sessionId = null;

	//server handlers
	this.pathUploadHandler = null;
	this.pathGetInfoHandler = null;
	this.pathGetIdHandler = null;

	//progress
	this.progressBar = null;
	
	this.uploaded = false;

	this.xy_FileAccept = fileAccept;
	this.xy_FileExt = fileExt;
	this.xy_FileExtErrorMsg = fileExtErrorMsg;

	/* 当前文件扩展名 */
	this.m_FileExt = "";
}

xyUploadFileObject.prototype.closeWin = function()
{
	this.parentWin();
}

xyUploadFileObject.prototype.setServerHandlers = function(uploadHandler, getInfoHandler, getIdHandler) 
{
	this.pathUploadHandler = uploadHandler;
	this.pathGetInfoHandler = getInfoHandler;
	this.pathGetIdHandler = getIdHandler;

}

xyUploadFileObject.prototype.create = function(htmlObject) 
{
	this.parentObject = document.getElementById(htmlObject);

	this.parentObject.style.position = "relative";
	this.parentObject.innerHTML = "<iframe src='about:blank' id='xyWfUploadFileObjectFrame' name='xyWfUploadFileObjectFrame' style='display:none' height='0' width='0'></iframe>";

	this.containerDiv = document.createElement("div");
	this.containerDiv.style.cssText = "position:absolute;overflow-y:auto;height:280px;background-color:#FFFFFF;border:0px solid #FFFFFF;top:0px;left:0px;z-index:10;width:420px";
	this.parentObject.appendChild(this.containerDiv);

	this.container = document.createElement("div");
	this.container.style.position = "relative";
	
	var strBtnUploadAll = "<table cellspacing='0' cellpadding='0' border='0' class='x-btn-wrap x-btn' id='wf_upload_file_UploadAll' style='width: 75px;'>"
			+ "<tbody><tr><td class='x-btn-left'><i> </i></td><td class='x-btn-center'><em unselectable='on'>"
			+ "<button type='button' class='x-btn-text'>上传</button></em>"
			+ "</td><td class='x-btn-right'><i> </i></td></tr></tbody></table>";
	var strBtnClearAll = "<table cellspacing='0' cellpadding='0' border='0' class='x-btn-wrap x-btn' id='wf_upload_file_ClearAll' style='width: 75px;'>"
			+ "<tbody><tr><td class='x-btn-left'><i> </i></td><td class='x-btn-center'><em unselectable='on'>"
			+ "<button type='button' class='x-btn-text'>全部清除</button></em>"
			+ "</td><td class='x-btn-right'><i> </i></td></tr></tbody></table>";
	var strBtnClose = "<table cellspacing='0' cellpadding='0' border='0' class='x-btn-wrap x-btn' id='wf_upload_file_closewin' style='width: 75px;'>"
			+ "<tbody><tr><td class='x-btn-left'><i> </i></td><td class='x-btn-center'><em unselectable='on'>"
			+ "<button type='button' class='x-btn-text'>关闭</button></em>"
			+ "</td><td class='x-btn-right'><i> </i></td></tr></tbody></table>";

	var str = "<table style='background:transparent url(ext/resources/images/default/panel/top-bottom.png) repeat-x scroll 0 bottom; border: 0px solid #FFFFFF;cellSpacing:1px;cellPadding:1px;' border='0'>"
			+ "<tr style='width:100%;height:280px'><td style='width:420px' colspan=4 align='center' id = 'cellContainer' >"
			+ "<div style='height:100%;width:100%'></div>"
			+ "</td></tr>"
			+ "<tr class='x-window-bc'><td style=';width: 100%; height: 32px;' align='left'></td>"
			+ "<td style='width: 76px; height: 32px;' align='right'>"
			+ strBtnUploadAll + "</td>"
			+ "<td style='width: 76px; height: 32px;' align='right'>"
			+ strBtnClearAll + "</td>"
			+ "<td style='width: 80px; height: 32px;' align='right'>"
			+ strBtnClose + "</td></tr></table>"
			+ "<div _id='fileContainer' style='width:84px;overflow:hidden;height:24px;left:0px;direction:rtl;position:absolute;top:289px'>"
			+ "<img style='z-index:2' src='wf/resources/images/upload/btn_addFile.gif' style='cursor:pointer;'/>";

	if (this.xy_FileAccept != null && this.xy_FileAccept.trim() != "")
	{
		str +=	"<input type='file' accept='" + this.xy_FileAccept + "' id='wf_upload_file1' name='upload' value='' class='hidden' style='cursor:pointer;z-index:3;left:7px;position:absolute;height:24px;top:0px'/></div>";
	}
	else
	{
		str +=	"<input type='file' id='wf_upload_file1' name='upload' value='' class='hidden' style='cursor:pointer;z-index:3;left:7px;position:absolute;height:24px;top:0px'/></div>";
	}

	this.container.innerHTML = str;

	var self = this;
	this.container.childNodes[0].rows[1].cells[1].childNodes[0].onclick = function() {
		self.uploadAllItems();
	};
	this.container.childNodes[0].rows[1].cells[2].childNodes[0].onclick = function() {
		self.removeAllItems();
	};
	this.container.childNodes[0].rows[1].cells[3].childNodes[0].onclick = function() {
		self.closeWin();
	};
		
	this.fileContainer = this.container.childNodes[1];
	this.fileContainer.childNodes[1].onchange = function() {
		self.addFile()
	};

	this.uploadForm = document.createElement("form");

	this.uploadForm.method = "post";
	this.uploadForm.encoding = "multipart/form-data";
	this.uploadForm.target = "xyWfUploadFileObjectFrame";
	this.container.appendChild(this.uploadForm);

	this.parentObject.appendChild(this.container);
	this.tblListFiles = null;

	this.currentFile = this.fileContainer.childNodes[1];

	this.progressBar = this.createProgressBar();

}

xyUploadFileObject.prototype.createXMLHttpRequest = function() 
{
	var xmlHttp = null;
	
	if (window.ActiveXObject) 
	{
		xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	else if (window.XMLHttpRequest) 
	{
		xmlHttp = new XMLHttpRequest();
	}
	
	return xmlHttp
}

//get file name
xyUploadFileObject.prototype.getFileName = function(path) 
{
	var arr = path.split("\\");
	return arr[arr.length - 1];
};

xyUploadFileObject.prototype.selectItemInExplorer = function(currentId) 
{
	var currentRow = this.getCurrentRowListFiles(currentId);

	if (this.idRowSelected) 
	{
		var row = this.getCurrentRowListFiles(this.idRowSelected);
		if (row) 
		{
			if (row.id != currentRow.id) 
			{
				currentRow.style.background = "#F3F3F3";
				this.idRowSelected = currentId;
				row.style.background = "#FFFFFF";
			} 
			else
			{
				currentRow.style.background = "#FFFFFF";
				this.idRowSelected = "";
			}
		} 
		else 
		{
			currentRow.style.background = "#F3F3F3";
			this.idRowSelected = currentId;
		}

	} 
	else 
	{
		currentRow.style.background = "#F3F3F3";
		this.idRowSelected = currentId;
	}

}

xyUploadFileObject.prototype.selectItemInMozilla = function(currentId) 
{
	var currentRow = this.getCurrentRowListFiles(currentId);

	if (this.idRowSelected) 
	{
		var row = this.getCurrentRowListFiles(this.idRowSelected);
		if (row) 
		{
			if (row.id != currentRow.id) 
			{
				currentRow.style.background = "#F3F3F3";
				this.idRowSelected = currentId;
				row.style.background = "#FFFFFF";
			} 
			else 
			{
				currentRow.style.background = "#FFFFFF";
				this.idRowSelected = "";
			}
		} 
		else 
		{
			currentRow.style.background = "#F3F3F3";
			this.idRowSelected = currentId;
		}

	} 
	else 
	{
		currentRow.style.background = "#F3F3F3";
		this.idRowSelected = currentId;
	}

}

// add item in "upload control"
xyUploadFileObject.prototype.addFile = function() 
{
	var currentId = this.createId();

	var file = this.currentFile;

	file.disabled = true;
	file.style.display = "none";
	this.uploadForm.appendChild(file);

	var newInputFile = document.createElement("input");
	newInputFile.type = "file";
	/* 2015-06-26 支持文件类型限制 */
	if (this.xy_FileAccept != null && this.xy_FileAccept.trim() != "")
	{
		newInputFile.accept = this.xy_FileAccept;
	}
	newInputFile.className = "hidden";
	newInputFile.style.cssText = "cursor:pointer!important;z-index:3;left:7px;position:absolute;height:24px;";
	newInputFile.id = "wf_upload_file" + (currentId + 1);
	newInputFile.name = "upload";
	this.currentFile = newInputFile;
	var self = this;
	newInputFile.onchange = function(){ return self.addFile()};
	this.fileContainer.appendChild(newInputFile);

	var fileName = this.getFileName(file.value);
	var imgFile = this.getImgFile(fileName);

	/* 2015-06-26 支持文件类型限制 */
	if (! this.checkFileExt(fileName))
	{
		return;
	}

	//create table ListFiles
	var containerData = this.containerDiv;
	if (this.tblListFiles == null) 
	{
		this.tblListFiles = this.createTblListFiles();
		containerData.appendChild(this.tblListFiles);
	}
	var rowListFiles = this.tblListFiles.insertRow(this.tblListFiles.rows.length);
	rowListFiles.setAttribute("fileItemId", currentId);
	rowListFiles.setAttribute("id", "rowListFiles" + currentId);
	rowListFiles.setAttribute("isUpload", "false");

	if (top.Ext.isIE)
	{
		rowListFiles.onclick = function(){self.selectItemInExplorer(currentId)};

	} 
	else 
	{
		rowListFiles.onclick = function(event){self.selectItemInMozilla(currentId)};
	}

	var cellListFiles = document.createElement("td");
	cellListFiles.align = "center";
	rowListFiles.appendChild(cellListFiles);

	//create table "content"
	var tblContent = document.createElement("table");
	cellListFiles.appendChild(tblContent);
	tblContent.style.cssText = ";border-bottom: 1px solid #E2E2E2;";
	tblContent.cellPadding = "0px";
	tblContent.cellSpacing = "0px";
	tblContent.border = "0px";
	tblContent.id = "tblContent" + currentId;

	var rowList = tblContent.insertRow(tblContent.rows.length);

	var cellList = document.createElement("td");
	cellList.rowSpan = 2;
	cellList.align = "center";

	cellList.innerHTML = "<img  src='" + imgFile + "'  />";
	
	cellList.style.cssText = ";width:60px;";
	rowList.appendChild(cellList);

	//add name of file
	cellList = document.createElement("td");
	cellList.align = "left";
	cellList.vAlign = "bottom";
	cellList.style.cssText = ";width:300px;height:30px;";
	cellList.innerHTML = "<div style='overflow: hidden;height: 12px;width:280px;'><div class='fileName' style='height: 12px;width:280px;'>"	+ fileName + "</div></div> ";
	cellList.className = "filenName";
	rowList.appendChild(cellList);

	// add link Remove
	cellList = document.createElement("td");
	cellList.style.cssText = ";width:140px;height:30px";
	cellList.innerHTML = "<input type='image' src='wf/resources/images/upload/btn_clean.gif'>";
	cellList.firstChild.onclick = function() {self.removeItem(currentId)};
	cellList.vAlign = "bottom";
	cellList.align = "center";
	rowList.appendChild(cellList);
	rowList = tblContent.insertRow(tblContent.rows.length);

	//  progress bar
	cellList = document.createElement("td");
	cellList.align = "left";
	cellList.style.cssText = ";width:300px;height:30px;";
	rowList.appendChild(cellList);

	// td
	cellList = document.createElement("td");
	cellList.style.cssText = ";width:140px;height:30px;";
	cellList.innerHTML = "<h1>";
	cellList.vAlign = "middle";
	cellList.align = "center";
	rowList.appendChild(cellList);

}

xyUploadFileObject.prototype.checkFileExt = function(strFileName)
{
	this.m_FileExt = "";
	for (var index = strFileName.length - 1; index >= 0; index--)
	{
		if (strFileName.charAt(index) == ".")
		{
			this.m_FileExt = strFileName.substr(index + 1);
			break;
		}
	}

	if (this.xy_FileExt == null || this.xy_FileExt.trim() == "")
	{
		return true;
	}
	
	if (this.m_FileExt == "")
	{
		if (this.xy_FileExtErrorMsg == null || this.xy_FileExtErrorMsg == "" || typeof(this.xy_FileExtErrorMsg) != "string")
		{
			Ext.MessageBox.alert("提示", "不允许选择此类文件，请重新选择");
			return false;
		}
		else
		{
			Ext.MessageBox.alert("提示", this.xy_FileExtErrorMsg);
			return false;
		}
	}

	var arrayFileExt = this.xy_FileExt.split(",");
	for (var i = 0; i < arrayFileExt.length; i++)
	{
		var strFileExt = arrayFileExt[i].trim();

		if (strFileExt.toLowerCase() === this.m_FileExt.toLowerCase())
		{
			return true;
		}
	}

	if (this.xy_FileExtErrorMsg == null || this.xy_FileExtErrorMsg == "" || typeof(this.xy_FileExtErrorMsg) != "string")
	{
		Ext.MessageBox.alert("提示", "不允许选择此类文件，请重新选择");
		return false;
	}
	else
	{
		Ext.MessageBox.alert("提示", this.xy_FileExtErrorMsg);
		return false;
	}
};

//get image src
xyUploadFileObject.prototype.getImgFile = function(fileName) 
{
	//-------------------------------------------
	var srcImgPic = "wf/resources/images/upload/ico_image.png";
	var srcImgVideo = "wf/resources/images/upload/ico_video.png";
	var srcImgSound = "wf/resources/images/upload/ico_sound.png";
	var srcImgArchives = "wf/resources/images/upload/ico_zip.png";
	var srcImgFile = "wf/resources/images/upload/ico_file.png";

	var valueImgPic = "jpg,jpeg,gif,png,bmp,tiff";
	var valueImgVideo = "avi,mpg,mpeg,rm,move";
	var valueImgSound = "wav,mp3,ogg";
	var valueImgArchives = "zip,rar,tar,tgz,arj";
	//------------------------------------------

	var ext = "_";
	var ext0 = fileName.split(".");
	if (ext0.length > 1)
	{
		ext = ext0[ext0.length - 1].toLowerCase();
	}

	if (valueImgPic.indexOf(ext) != -1) 
	{
		return srcImgPic;
	}

	if (valueImgVideo.indexOf(ext) != -1) 
	{
		return srcImgVideo;
	}

	if (valueImgSound.indexOf(ext) != -1) 
	{
		return srcImgSound;
	}

	if (valueImgArchives.indexOf(ext) != -1) 
	{
		return srcImgArchives;
	}

	return srcImgFile;
}

//create id for item control
xyUploadFileObject.prototype.createId = function() 
{
	var count = this.countRows;
	if (!count) 
	{
		count = 0;
	}
	
	this.countRows = parseInt(count) + 1;
	
	return this.countRows;
}

xyUploadFileObject.prototype.createTblListFiles = function() 
{
	var tblListFiles = document.createElement("table");
	tblListFiles.id = "tblListFiles";
	tblListFiles.style.cssText = "background-color:#FFFFFF;";
	tblListFiles.cellPadding = "0";
	tblListFiles.cellSpacing = "0";
	tblListFiles.border = "0";

	return tblListFiles;
}

//remove current item in control
xyUploadFileObject.prototype.removeItem = function(id) 
{
	this.getCurrentRowListFiles(id).parentNode.removeChild(this.getCurrentRowListFiles(id));
}

//remove all items in control
xyUploadFileObject.prototype.removeAllItems = function() 
{
	if (this.isUploadFile == "false") 
	{
		if (this.tblListFiles != null) 
		{
			var count = this.tblListFiles.rows.length;
			if (count > 0) 
			{
				for ( var i = 0; i < count; i++) 
				{
					this.tblListFiles.deleteRow(0);
				}
			}

		}
	}
}

//upload all items
xyUploadFileObject.prototype.uploadAllItems = function() 
{
	var flag = -1;

	if (this.tblListFiles != null) 
	{
		if (this.tblListFiles.rows.length > 0) 
		{
			for ( var i = 0; i < this.tblListFiles.rows.length; i++) 
			{
				if (this.tblListFiles.rows[i].attributes["isUpload"].value == "false") 
				{
					flag = i;
					break;
				}
			}

			if (flag != -1) 
			{
				this.isUploadFileAll = "true";
				var fileItemId = this.tblListFiles.rows[i].attributes["fileItemId"].value;
				this.uploadFile(fileItemId);
			} 
			else 
			{
				this.isUploadFileAll = "false";
			}
		}
	}
}

xyUploadFileObject.prototype.createProgressBar = function() 
{
	var srcImgProgress = "wf/resources/images/upload/pb_demoUload.gif";

	var tblProgress = document.createElement("table");
	tblProgress.cellPadding = "0";
	tblProgress.cellSpacing = "0";
	tblProgress.border = "0";
	tblProgress.style.cssText = "height:10px;width:153px;display:none;";
	tblProgress.id = "progress";

	var row = tblProgress.insertRow(tblProgress.rows.length);
	var cell1 = document.createElement("td");
	cell1.style.cssText = "font-size: 1px;border: 1px solid #A9AEB3;"
	cell1.innerHTML = "<img src=" + srcImgProgress + " style = 'width:150px;height:8px;'/>";
	row.appendChild(cell1);

	return tblProgress;
}

xyUploadFileObject.prototype.endLoading = function(id) 
{
	this.isUploadFile = "false";

	this.progressBar.style.display = "none";
	this.container.appendChild(this.progressBar);

	this.getCurrentInputFile(id).parentNode.removeChild(this.getCurrentInputFile(id));
}

//receipt of id
xyUploadFileObject.prototype.startRequest = function(id) 
{
	try 
	{
		var xmlHttp = this.createXMLHttpRequest();
		xmlHttp.open("POST", this.pathGetIdHandler, false);
		xmlHttp.send("a=0");

		if (xmlHttp.status == 200) 
		{
			if (!xmlHttp.responseText) 
			{
				throw "error";
			}

			this.sessionId = xmlHttp.responseText;
		} 
		else 
		{
			alert(xmlHttp.status);
			throw "error";
		}
	} 
	catch (e) 
	{
		throw e;
		return;
	}
}

xyUploadFileObject.prototype.sendIdSession = function(id) 
{
	try 
	{
		var xmlHttp = this.createXMLHttpRequest();
		xmlHttp.open("post", this.pathGetInfoHandler, false);
		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		xmlHttp.send("sessionId=" + this.sessionId);
		
		var responseData = null;
		if ( xmlHttp.responseText != null )
		{
			responseData = JSON.parse(xmlHttp.responseText);
		}
		
		if (xmlHttp.status == 200) 
		{
			if (xmlHttp.responseText) 
			{
				if (isNaN(parseInt(responseData.flag))) 
				{
					throw new Error(responseData.flag);
				}
				if (parseInt(responseData.flag) == 0) 
				{
					var self = this;

					try 
					{
						window.setTimeout( function(){ self.sendIdSession(id)}, 500);
					} 
					catch (e) 
					{
						top.Ext.MessageBox.alert("错误", e.message);
					}

				} 
				else if (parseInt(responseData.flag) == -1) 
				{
					this.uploaded = true; //只要有一个成功则认为已经上传过

					this.endLoading(id);
										
					var tblContent = this.getCurrentTblContent(id);
					tblContent.rows[1].cells[0].innerHTML += "<font class='text' >文件上传成功</font>";
					tblContent.rows[1].cells[0].vAlign = "top";
					var tblContent = this.getCurrentTblContent(id);
					tblContent.rows[0].cells[2].removeChild(tblContent.rows[0].cells[2].firstChild)

					if (this.isUploadFileAll == "true") 
					{
						this.uploadAllItems();
					}					
				}
				else if (parseInt(responseData.flag) == 1) 
				{
					this.endLoading(id);

					var tblContent = this.getCurrentTblContent(id);
					tblContent.rows[1].cells[0].innerHTML += "<font class='text' color=red >文件上传失败:" + responseData.msg + "</font>";
					tblContent.rows[1].cells[0].vAlign = "top";

					if (this.isUploadFileAll == "true") 
					{
						this.uploadAllItems();
					}
				}
			}
		} 
		else 
		{
			throw "error";
		}
	} 
	catch (e) 
	{
		this.endLoading(id);
		this.isUploadFileAll = "false";
		var tblContent = this.getCurrentTblContent(id);
		tblContent.rows[1].cells[0].innerHTML += "<font class='text' color=red >文件上传失败:" + e.message + "</font>";
		tblContent.rows[1].cells[0].vAlign = "top";

		return;
	}
}

xyUploadFileObject.prototype.getCurrentRowListFiles = function(id) 
{
	for ( var i = 0; i < this.tblListFiles.rows.length; i++) 
	{
		if (this.tblListFiles.rows[i].id == "rowListFiles" + id) 
		{
			return this.tblListFiles.rows[i];
		}
	}
}

xyUploadFileObject.prototype.getCurrentTblContent = function(id) 
{
	for ( var i = 0; i < this.tblListFiles.rows.length; i++) 
	{
		if (this.tblListFiles.rows[i].cells[0].firstChild.id == "tblContent" + id) 
		{
			return this.tblListFiles.rows[i].cells[0].firstChild;
		}
	}
}

xyUploadFileObject.prototype.getCurrentInputFile = function(id) 
{
	var collInputs = this.uploadForm.getElementsByTagName("input");

	for ( var i = 0; i < collInputs.length; i++) 
	{
		if (collInputs[i].id == "wf_upload_file" + id) 
		{
			return collInputs[i];
		}
	}
}

function getfilesize(filepath)    
{    
   var image = new image();    
   image.dynsrc = filepath;    
}

xyUploadFileObject.prototype.uploadFile = function(id) 
{
	if (this.isUploadFile == "false") 
	{
		if (top.Ext.isIE) 
		{
			this.selectItemInExplorer(id);
		} 
		else 
		{
			this.selectItemInMozilla(id);
		}

		var tblContent = this.getCurrentTblContent(id);
		tblContent.rows[1].cells[1].removeChild(tblContent.rows[1].cells[1].firstChild)
		tblContent.parentNode.parentNode.attributes["isUpload"].value = "true";

		//
		this.isUploadFile = "true";

		//
		this.getCurrentInputFile(id).disabled = false;
		this.progressBar.style.display = "inline";
		this.getCurrentRowListFiles(id).cells[0].firstChild.rows[1].cells[0].appendChild(this.progressBar);

		try 
		{
			//get id
			this.startRequest(id);
			//get info
			this.sendIdSession(id);
		}
		catch (e) 
		{
			this.endLoading(id);
			this.isUploadFileAll = "false";
			var tblContent = this.getCurrentTblContent(id);
			tblContent.rows[1].cells[0].innerHTML += "<font class='text' >错误</font>";
			tblContent.rows[1].cells[0].vAlign = "top";

			return;
		}

		var strFileName_Enc = SecurityUtil.Encode(this.getFileName(this.getCurrentInputFile(id).value), "newtouch", "ssc", "xywfuploadfile");
		var strFileExt_Enc = SecurityUtil.Encode(this.m_FileExt, "newtouch", "ssc", "xywfuploadfile");
		var strFileExtList_Enc = SecurityUtil.Encode(this.xy_FileExt, "newtouch", "ssc", "xywfuploadfile");

		var strUrl = this.pathUploadHandler + "?sessionId=" + this.sessionId;
		if (this.processInstID != undefined)
		{
			strUrl += "&processInstID=" + this.processInstID;
		}

		if (this.entityDataID != undefined)
		{
			strUrl += "&entityDataID=" + this.entityDataID;
		}

		if (this.formSerialNo != undefined)
		{
			strUrl += "&formSerialNo=" + this.formSerialNo;
		}

		strUrl += "&xyFileName=" + strFileName_Enc;
		strUrl += "&userfile=" + this.getCurrentInputFile(id).id;
		strUrl += "&fileExt=" + strFileExt_Enc;
		strUrl += "&fileExtList=" + strFileExtList_Enc;

		this.uploadForm.action = strUrl;
		
		this.uploadForm.submit();
	}
}
