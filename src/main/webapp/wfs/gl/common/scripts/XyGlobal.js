Ext.BLANK_IMAGE_URL = 'resources/images/s.gif';

Ext.Ajax.timeout = 1800000;

String.prototype.realLength = function() 
{ 
  return this.replace(/[^\x00-\xff]/g,"**").length; 
} 