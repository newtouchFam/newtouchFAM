
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

if (SecurityProxy == null) var SecurityProxy = {};
SecurityProxy._path = 'dwr';
SecurityProxy.getSecurityInfo = function(callback) {
  dwr.engine._execute(SecurityProxy._path, 'SecurityProxy', 'getSecurityInfo', callback);
}
SecurityProxy.BulkUpdate = function(p0, callback) {
  dwr.engine._execute(SecurityProxy._path, 'SecurityProxy', 'BulkUpdate', p0, callback);
}
