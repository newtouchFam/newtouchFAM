
if (typeof DWRMenuResult != "function") {
  function DWRMenuResult() {
    this.jsonString = null;
    this.errDesc = null;
    this.error = 0;
  }
}

if (typeof DWRResultComapny != "function") {
  function DWRResultComapny() {
    this.errDesc = null;
    this.error = 0;
    this.asParentCode = null;
  }
}

if (typeof DWRSingleSign != "function") {
  function DWRSingleSign() {
    this.errDesc = null;
    this.tokenvalue = null;
    this.error = 0;
  }
}

if (typeof DWRVerifyLoginResult != "function") {
  function DWRVerifyLoginResult() {
    this.companyNO = null;
    this.companyID = null;
    this.userName = null;
    this.userDispalyName = null;
    this.userAuth = null;
    this.setID = null;
    this.errDesc = null;
    this.userID = null;
    this.error = 0;
    this.companyNAME = null;
  }
}

// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;
DWREngine.setAsync(false);//设置同步

if (ForgetPW == null) var ForgetPW = {};
ForgetPW._path = 'dwr';
ForgetPW.saveRandomNum = function(RandomNum, starttime, endtime, username, ip,callback) 
{
	  dwr.engine._execute(ForgetPW._path, 'ForgetPW', 'saveRandomNum', RandomNum, starttime, endtime, username, ip,callback);
}
ForgetPW.findRandomNum = function(username, starttime, captcha,callback)
{
	  dwr.engine._execute(ForgetPW._path, 'ForgetPW', 'findRandomNum', username, starttime, captcha,callback);
}
ForgetPW.updateEndTime = function( starttime,endtime, callback)
{
	  dwr.engine._execute(ForgetPW._path, 'ForgetPW', 'updateEndTime',  starttime, endtime,callback);
}
ForgetPW.updateIntSate = function( username, callback)
{
	  dwr.engine._execute(ForgetPW._path, 'ForgetPW', 'updateIntSate',  username,callback);
}
ForgetPW.checkUserExist = function( username, callback)
{
	  dwr.engine._execute(ForgetPW._path, 'ForgetPW', 'checkUserExist',  username, callback);
}
