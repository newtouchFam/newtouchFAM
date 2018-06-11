	function MfJSONUtils(keyValues,replaceValues){
		
		this.keys=['&','<','>',"'",'"'];
		this.replaces=['&amp;','&lt;','&gt;','&apos;','&quot;'];
		
		if(keyValues){
			if(replaceValues){
				if(keyValues instanceof Array && replaceValues instanceof Array && keyValues.length===replaceValues.length){
					this.keys.push(keyValues);	
					this.replaces.push(replaceValues);	
				}
			}
		}
	}
	
	MfJSONUtils.prototype.replaceStr=function(str){
		for(var i=0;i<this.keys.length;i++){
			str=str.replace(new RegExp('('+this.keys[i]+')','g'),this.replaces[i]);
		}
		return str;

	}

	MfJSONUtils.prototype.encode=function(str){
		return this.replaceStr(str);
	}

	MfJSONUtils.prototype.json2xml=function(obj,str,root){
		if(!(obj instanceof Array)){
			if(str){
				if(root){
					str+="<"+root+">";
				}
			}else{
				if(root){
					str="<"+root+">";
				}
			}
		}
		if(obj instanceof Array){
			for(var i=0;i<obj.length;i++){
				str=this.json2xml(obj[i],str,root);					
			}
		}else if(obj instanceof Object){
			for(var e in obj){
				str=this.json2xml(obj[e],str,e);					
			}
		}else{
				str+=this.encode(obj);
		}
		
		if(!(obj instanceof Array)){
			if(root){
				str+="</"+root+">";
			}
		}		
		return str;
	}

	MfJSONUtils.prototype.jsonstr2xml=function(jsonstr,root){
		var jsobj=eval('('+jsonstr+')');
		return this.json2xml(jsobj,null,root);
	}