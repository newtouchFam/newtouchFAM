
if (typeof DWRMenuResult != "function") {
  function DWRMenuResult() {
    this.jsonString = null;
    this.errDesc = null;
    this.error = 0;
  }
}

if (typeof DWRBaseResult != "function") {
  function DWRBaseResult() {
    this.errDesc = null;
    this.error = 0;
  }
}

// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (MenuProxy == null) var MenuProxy = {};
MenuProxy._path = 'dwr';
MenuProxy.getRoot = function(callback) {
  dwr.engine._execute(MenuProxy._path, 'MenuProxy', 'getRoot', callback);
}
MenuProxy.getChildren = function(p0, callback) {
  dwr.engine._execute(MenuProxy._path, 'MenuProxy', 'getChildren', p0, callback);
}
