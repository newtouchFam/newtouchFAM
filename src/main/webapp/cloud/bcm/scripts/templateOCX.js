/**
 * 
 * @author <a href="mailto:awingedsteed@yahoo.com.cn">mashengwen</a>
 * 2009-7-23下午04:23:01
 */

	function templateOCX(url,creator,varname) {
		this.name=varname;
		this.template = new ActiveXObject('BBMComExcel.TXyComExcel');
		this.wsurl = url;
		this.creatorID=creator;
		this.jsonutils=new MfJSONUtils();
		this.err=false;
	}

	templateOCX.prototype.callback=function(){
		this.succ();
	}
	
	templateOCX.prototype.template_Download=function(){
		this.template.template_Download();
		if(this.getErr()){
			this.err=true;
		}		
	}
	
	templateOCX.prototype.setEnviroment = function() {
		var paramXml = '<Row><Url>' + this.jsonutils.encode(this.wsurl) + '</Url></Row>';
		this.template.setEnviroment(window,paramXml);
		this.template_Download();
	}
	
	templateOCX.prototype.getErr=function(){

		var result=this.template.getErr();
		if(0==result){
			return false;		
		}
		alert(this.template.getErrDesc());
		return true;		
	}

	templateOCX.prototype.template_AddNew = function(templateCode, templateName,
			respCenterID, templateTypeID,callback){
		
		
		if(this.err){
			return;
		}		
		
		this.succ=callback;

		var paramXml = '<Row>' + '<TemplateCode>' + this.jsonutils.encode(templateCode)
				+ '</TemplateCode>' + '<TemplateName>' + this.jsonutils.encode(templateName)
				+ '</TemplateName>' + '<RespCenterID>' + this.jsonutils.encode(respCenterID)
				+ '</RespCenterID>' + '<TemplateTypeID>' + this.jsonutils.encode(templateTypeID)
				+ '</TemplateTypeID>' + '<CreatorID>' + this.jsonutils.encode(this.creatorID) + '</CreatorID>'
				+ '<Success>' + this.jsonutils.encode(this.name+".callback") + '</Success>'
				+ '</Row>';
					
		this.template.template_AddNew(paramXml);
		this.getErr();
	}
	
	templateOCX.prototype.template_Update = function(templateID, templateName,
			version) {
		
		if(this.err){
			return;
		}				
		
		var paramXml = '<Row>' + '<TemplateID>' + this.jsonutils.encode(templateID) + '</TemplateID>'
				+ '<TemplateName>' + this.jsonutils.encode(templateName) + '</TemplateName>' + '<Version>'
				+ this.jsonutils.encode(version) + '</Version>' + '<CreatorID>' + this.jsonutils.encode(this.creatorID)
				+ '</CreatorID>' + '</Row>';
				
		this.template.template_Update(paramXml);
		this.getErr();

	}
	
	templateOCX.prototype.template_View = function(templateID, templateName,
			version) {
				
		if(this.err){
			return;
		}
	
		var paramXml = '<Row>' + '<TemplateID>' + this.jsonutils.encode(templateID) + '</TemplateID>'
				+ '<TemplateName>' + this.jsonutils.encode(templateName) + '</TemplateName>' + '<Version>'
				+ this.jsonutils.encode(version) + '</Version>' + '<CreatorID>' + this.jsonutils.encode(this.creatorID)
				+ '</CreatorID>' + '</Row>';

		this.template.template_View(paramXml);
		this.getErr();

	}
