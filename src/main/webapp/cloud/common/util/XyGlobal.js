Ext.BLANK_IMAGE_URL = 'resources/images/s.gif';

String.prototype.realLength = function() 
{ 
  return this.replace(/[^\x00-\xff]/g,"**").length; 
} 