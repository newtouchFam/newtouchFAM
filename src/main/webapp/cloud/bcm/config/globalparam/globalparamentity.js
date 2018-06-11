Ext.namespace("bcm.config.GlobalParam");

bcm.config.GlobalParam.GlobalParamEntity = function(code)
{
	this.code = code;
	this.paramString = "";
	this.paramInt = 0;
	this.paramNumber = 0.0;
	this.status = 1;
	this.remark = "";

	this.setString = function(value)
	{
		this.paramString = value;
	};
	this.setInt = function(value)
	{
		this.paramInt = value;
	};
	this.setNumber = function(value)
	{
		this.paramNumber = value;
	};
	this.setStatus = function(value)
	{
		this.status = value;
	};
};