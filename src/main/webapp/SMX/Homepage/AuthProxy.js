
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

if (AuthProxy == null) var AuthProxy = {};
AuthProxy._path = 'dwr';
AuthProxy.verifyLogin = function(p0, p1, p2, p3, p4, p5, callback) {
  dwr.engine._execute(AuthProxy._path, 'AuthProxy', 'verifyLogin', p0, p1, p2, p3, p4, p5, callback);
}
AuthProxy.updatePassword = function(p0, p1, p2, p3, p4, callback) {
  dwr.engine._execute(AuthProxy._path, 'AuthProxy', 'updatePassword', p0, p1, p2, p3, p4, callback);
}
AuthProxy.updatePersonInfo = function(p0, p1, p2, p3, p4,p5,p6,p7, callback) {
  dwr.engine._execute(AuthProxy._path, 'AuthProxy', 'updatePersonInfo', p0, p1, p2, p3, p4,p5,p6,p7, callback);
}

AuthProxy.getPersonInfoByVarname = function(p0,p1,callback) {
	dwr.engine._execute(AuthProxy._path, 'AuthProxy', 'getPersonInfoByVarname', p0,p1,callback);
}


