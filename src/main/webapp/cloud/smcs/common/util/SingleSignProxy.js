
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

if (SingleSignProxy == null) var SingleSignProxy = {};
SingleSignProxy._path = 'dwr';
SingleSignProxy.CreateToken = function(p0, p1, callback) {
  dwr.engine._execute(SingleSignProxy._path, 'SingleSignProxy', 'CreateToken', p0, p1, callback);
}
SingleSignProxy.Delete = function(p0, callback) {
  dwr.engine._execute(SingleSignProxy._path, 'SingleSignProxy', 'Delete', p0, callback);
}
SingleSignProxy.CreateTokenNewtouch = function(p0, p1, callback){
  DWREngine.setAsync(false);
  dwr.engine._execute(SingleSignProxy._path, 'SingleSignProxy', 'CreateTokenNewtouch', p0, p1, callback);
}